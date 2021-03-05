<template>
  <div class="selectCard">
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Select filterable clearable v-model="deptNameSelective" style="width:200px">
            <Option v-for="item in deptList" :value="item.deptName" :key="item.deptName">{{ item.deptName }}</Option>
          </Select>
          <Input v-model="admissionNumber" placeholder="请输入住院号" clearable style="width: 200px; margin-right:5px" />
          <Input v-model="pid"  placeholder="请输入身份证号" clearable style="width: 200px;margin-right:5px" />
          <Input v-model="pname"  placeholder="请输入病人姓名" clearable style="width: 200px;margin-right:5px" />
          <DatePicker v-model="admissionOfDate" type="daterange" placement="bottom-end" placeholder="请选择入院时间"
            style="width: 200px;margin-right:5px"
            format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="search()"></Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        deptNameSelective: '',
        pid:'',
        pname:'',
        admissionNumber:'',
        admissionOfDate:['','']
      };
    },
    props : {
      deptList : Array
    }
    ,
    components: {},

    computed: {},

    methods: {
      search(){
        this.$emit("search",this.deptNameSelective,this.pid,this.pname,this.admissionNumber,this.admissionOfDate)
      },
      setTime(date){
        this.admissionOfDate = date;
      }
    }
  }

</script>
<style scoped>
</style>
