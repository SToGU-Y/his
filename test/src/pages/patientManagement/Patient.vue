<style scoped>
  #cardItem .ivu-input-wrapper {
    margin: 0 10px 0 0;
  }

  .page-box {
    margin-top: 10px;
  }

  .card-box {
    margin-bottom: 10px;
  }

</style>

<template>
  <div id="patient">
    <!-- 查询组件 -->
    <div class="card-box" style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Input placeholder="请输入身份证号" v-model="pid" autofocus clearable style="width: 200px;" />
          <Input placeholder="请输入姓名" v-model="pname" clearable style="width: 200px;" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search"
            @click="getPatient"></Button>
        </div>
      </Card>
    </div>
    <!-- 查询结果表格之类的 -->
    <Table :loading="loading" border :columns="columns" :data="patientlist">
    </Table>
    <!-- 分页模块 -->
    <div class="page-box">
      <Page :total="total" show-elevator @on-change="pageChange"/>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '身份证号',
            key: 'pid',
            width: 200
          },
          {
            title: '姓名',
            key: 'pname',
            width: 150
          },
          {
            title: '性别',
            key: 'sex',
            width: 80
          },
          {
            title: '出生年月日',
            key: 'birth',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.birth).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '国籍',
            key: 'nationality',
            width: 150
          },
          {
            title: '民族',
            key: 'nation',
            width: 80
          },
          {
            title: '联系电话',
            key: 'tel',
            width: 150
          },
          {
            title: '婚况',
            key: 'married',
            width: 100
          },
          {
            title: '出生地',
            key: 'born',
            width: 150
          },
          {
            title: '户口地址',
            key: 'regAddr',
            width: 150
          },
          {
            title: '现居住地址',
            key: 'currAddr',
            width: 150
          },
          {
            title: '籍贯',
            key: 'nativePlace',
            width: 150
          },
          {
            title: '紧急联系人',
            key: 'contact',
            width: 150
          },
          {
            title: '紧急联系人关系',
            key: 'conRel',
            width: 150
          },
          {
            title: '紧急联系人电话',
            key: 'conTel',
            width: 150
          }
        ],
        patientlist: [],
        total: 100,
        pid: '',
        pname: '',
        loading: true,
        total:0
      };
    },
    created() {
      this.getPatient();
    },
    methods: {
      getPatient() {
        this.$http({
            url: 'patient/getPatientByCondition',
            method: "GET",
            params: {
              pid: this.pid,
              pname: this.pname
            }
          })
          .then(res => {    
              if (res.data.status == 200) {
                this.patientlist = res.data.data.list;
                this.total = res.data.data.total
                this.loading = false;
              }
          })
          .catch(err => {
            this.$Message.error("服务器出错！")
          })
      },
      pageChange(pageNum) {
        this.$http({
            url:'patient/getPatientByCondition',
            method:'GET',
            params:{
              pid: this.pid,
              pname: this.pname,
              pageNum: pageNum
            } 
          })
          .then(res=>{
              if (res.data.status === 200) {
                this.datas = res.data.data.list
              }
          })
          .catch(err=>{
            console.log(err);
          })
      }

    }
  }

</script>
