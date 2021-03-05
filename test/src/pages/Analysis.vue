<style scoped>
#top{
    width:100%;
    height: 100px;
    margin-bottom: 10px;
    background:#eee;
    padding:20px;
}
#content{
    padding:20px;
    background:#eee;
    height:700px;
    overflow:scroll;
}
#top div,p{
    position: relative;
    display: inline-block;
    height: 100%;
    width: 20%;
    background: white;
    line-height: 60px;
}
#top div p{
    position: absolute;
    left: 0;
    top: 0;
    width:100px;
    font-size:8px;
    color: orange;
}
.content-title {
    font-size:28px;
    font-weight:bold;
    margin-bottom:20px;
}
.condition {
    margin-bottom:20px;
}
#top div span{
    position: absolute;
    right: 50px;
    font-size:18px;
}
#left-content,#right-content{
    display:inline-block;
    width:600px;
    height:450px;
    padding:20px;
    background:#fff;
    border-radius:10px;
    margin-bottom:20px
}
#left-content{
    margin-right: 20px;
}

  #center-content {
    margin: 0 auto;
    width: 80%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 20px
  }


</style>
<template>
<div id="analysis">
    <div id="top">
        <div>
            <p>今日住院人数</p>
            <span>{{this.people.todayInpatient}}</span>
        </div>
        <div>
            <p>今日出院人数</p>
            <span>{{this.people.todayLeave}}</span>
        </div>
        <div>
            <p>累计住院人数</p>
            <span>{{this.people.totalInpatient}}</span>
        </div>
        <div>
            <p>累计出院人数</p>
            <span>{{this.people.totalLeave}}</span>
        </div>
    </div>
    <div id="content">

      <div class="condition">
        <DatePicker v-model="conditionForm3.date" type="year" placeholder="请选择年份" style="width: 200px"
          @on-change="setTime3"></DatePicker>
        <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="refresh3()"></Button>
      </div>

      <div id="center-content">
        <div>
          <div class="content-title">人数情况</div>
          <ve-line :data="chartData5" :settings="chartSettings5" :extend="extend"></ve-line>
        </div>
      </div>

        <div class="condition">
            <DatePicker type="daterange" placement="bottom-end" placeholder="请选择入院时间"
                        style="width: 200px;margin-right:5px" format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search"
                        @click="refresh()"></Button>
        </div>
        <div class='content-title'>住院统计</div>
        <div id="left-content">
            <div>
                <div class='content-title'>住院情况</div>
                <ve-histogram  :data="chartData" :settings="chartSettings" :extend="extend"></ve-histogram>
            </div>
        </div>
        <div id="right-content">
            <div>
            <div class='content-title'>住院男女比例</div>
                <ve-pie :data="chartData2" :settings="chartSettings2" :extend="extend"></ve-pie>
            </div>
        </div>
        <div class="condition">
            <DatePicker type="daterange" placement="bottom-end" placeholder="请选择出院时间"
                        style="width: 200px;margin-right:5px" format="yyyy-MM-dd" @on-change="setTime2"></DatePicker>
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search"
                        @click="refresh2()"></Button>
        </div>
        <div class='content-title'>出院统计</div>
        <div id="left-content">
            <div>
                <div class='content-title'>出院情况</div>
                <ve-histogram  :data="chartData3" :settings="chartSettings3" :extend="extend"></ve-histogram>
            </div>
        </div>
        <div id="right-content">
            <div>
            <div class='content-title'>出院男女比例</div>
                <ve-pie :data="chartData4" :settings="chartSettings4" :extend="extend"></ve-pie>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  data () {
    return {
        chartData:{
            columns:['deptName','people'],
            rows:[]
        },
        chartData2:{
            columns:['sex','people'],
            rows:[]
        },
        chartData3: {
          columns: ['deptName', 'people'],
          rows: []
        },
        chartData4:{
            columns:['sex','people'],
            rows:[]
        },
        chartData5:{
            columns:["月份","住院","出院"],
            rows:[]
        },
        chartSettings2:{
            labelMap:{
                sex:'性别',
                people:'人数'
            }
        },
        chartSettings:{
            labelMap:{
                deptName:'科室',
                people:'住院人数'
            },
            area:true,
            legendName:{
                legend:'各科室住院人数'
            }
        },
        chartSettings4:{
            labelMap:{
                sex:'性别',
                people:'人数'
            }
        },
        chartSettings3: {
          labelMap: {
            deptName: '科室',
            people: '出院人数'
          }
        }, 
        chartSettings5: {
          labelMap: {
            月份: '月份',
            出院: '出院',
            住院:'住院'
          }
        }, 
        extend: {
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          }
        },       
        people:{},
        conditionForm:{
            dateS:'',
            dateE:''
        },
        conditionForm2:{
            dateS:'',
            dateE:''
        },
        conditionForm3:{
            date:''
        }
    }
  },

  created() {
      this.conditionForm3.date = new Date();
      this.getInpatient();
      this.getLeave();
      this.getLeaveSex();
      this.getInpatientSex();
      this.getPeopleMessage();
      this.getMonthMessage();
  },

  methods: {
      getInpatient(){
          this.$http({
              url:'analysis/getInpatient',
              method:'GET',
              params:{
                  date:this.conditionForm.dateS,
                  date2:this.conditionForm.dateE
              }
          })
          .then((res) => {
              if (res.data.status === 200) {
                  this.chartData.rows = res.data.data
              }else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
              }           
          })
          .catch((err) => {
              console.log(err);
          });
      },
      getInpatientSex(){
          this.$http({
              url:'analysis/getInpatientSex',
              method:'GET',
              params:{
                  date:this.conditionForm.dateS,
                  date1:this.conditionForm.dateE
              }
          })
          .then((res) => {
              if (res.data.status === 200) {
                  this.chartData2.rows = res.data.data
              }else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
              }           
          })
          .catch((err) => {
              console.log(err);
          });
      },
      refresh(){
          this.getInpatient()
          this.getInpatientSex()
      },
      getPeopleMessage(){
          this.$http({
              url:'analysis/getPeopleMessage',
              method:'GET'
          })
          .then((res) => {
              if (res.data.status === 200) {
                this.people= res.data.data  
              }else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg);
              }
          })
          .catch((err) => {
              console.log(err);
          });
      },
      getMonthMessage(){
          this.$http({
              url:'analysis/getMonthMessage',
              method:'GET',
              params:{
                  date:this.moment(this.conditionForm3.date).format('YYYY')
              }
          })
          .then((res) => {
              if (res.data.status === 200) { 

                var row = this.sortByKey(res.data.data,"月份")
                this.chartData5.rows = row
                console.log(this.chartData5); 
              }else if (res.data.status === 500) {
                this.$Message.info(res.data.msg);
              }
          })
          .catch((err) => {
              console.log(err);
          });
      },
      setTime(date) {
        this.conditionForm.dateS = date[0];
        this.conditionForm.dateE = date[1];
      },
      setTime3(date) {
        this.conditionForm3.date = date;
      },
      getLeave() {
        this.$http({
            url: 'analysis/getLeave',
            method: 'GET',
            params:{
                  date:this.conditionForm2.dateS,
                  date2:this.conditionForm2.dateE
              }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.chartData3.rows = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      getLeaveSex(){
            this.$http({
            url: 'analysis/getLeaveSex',
            method: 'GET',
            params:{
                  date:this.conditionForm2.dateS,
                  date1:this.conditionForm2.dateE
              }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.chartData4.rows = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      refresh2(){
          this.getLeave();
          this.getLeaveSex();
      },
      refresh3(){
          this.getMonthMessage();
      },
      setTime2(date) {
        this.conditionForm2.dateS = date[0];
        this.conditionForm2.dateE = date[1];
      },
      sortByKey(array,key){
            return array.sort(function(a,b){
                var x=a[key];
                var y=b[key];
                return ((x<y)?-1:((x<y)?1:0));
            });
        }
  }
}

</script>