<style scoped>
  #page-box {
    margin-top: 10px;
  }
  #table-box{
    margin-top: 10px;
  }

</style>
<template>
  <div id="dept">
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Input v-model="conditionForm.deptId" placeholder="请输入科室编号" clearable
            style="width: 200px; margin-right:5px" />
          <Input v-model="conditionForm.deptName" placeholder="请输入科室名称" clearable
            style="width: 200px;margin-right:5px" />
          <Input v-model="conditionForm.director" placeholder="请输入主任姓名" clearable
            style="width: 200px;margin-right:5px" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getDept()"></Button>
        </div>
      </Card>
    </div>
    <div id="table-box">
      <Table :columns="columns" :data="data">
      </Table>
    </div>
    <!-- 分页模块 -->
    <div id="page-box">
      <Page :total="total" show-elevator :page-size="11" @on-change="pageChange" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '科室编号',
            key: 'deptId',
            width: 150
          },
          {
            title: '科室名称',
            key: 'deptName',
            width: 150
          },
          {
            title: '科室人员数量',
            key: 'staffNumber',
            width: 150
          },
          {
            title: '科室描述',
            key: 'describe',
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.describe},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.describe)
              ]);
          }
          },
          {
            title: '科室主任',
            key: 'director',
            width: 150
          }
        ],
        data: [],
        modal : false,
        modal2 : false,
        total: 0,
        conditionForm: {
          deptId: '',
          deptName: '',
          director: ''
        }
      }
    },
    created() {
      this.getDept()
    },
    methods: {
      getDept(){
        this.$http({
          url:'dept/getDept',
          method:'GET',
          params:this.conditionForm
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.data = res.data.data.list
            this.total = res.data.data.total
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      pageChange(pageNum){
        this.$http({
          url:'dept/getDept',
          method:'GET',
          params:{
            deptName:this.conditionForm.deptName,
            deptId:this.conditionForm.deptId,
            director:this.conditionForm.director,
            pageNum:pageNum
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.data = res.data.data.list
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      }
    }
  }

</script>
