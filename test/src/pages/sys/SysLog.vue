<style scoped>
  .table-box {
    margin-top: 10px;
  }

  .page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="sysLog">
    <!-- 查询条件 -->
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
           <DatePicker type="daterange" placement="bottom-end" placeholder="请选择日志时间"
            style="width: 200px;margin-right:5px"
            format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getLog()"></Button>
        </div>
      </Card>
    </div>
    <!-- 数据表格 -->
    <div class="table-box">
      <Table border :columns="columns" :data="data">
      </Table>
    </div>
    <!-- 分页组件 -->
    <div class="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" />
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
            algin: 'center'
          },
          {
            title: '日志序号',
            key: 'logId',
            width: 100
          },
          {
            title: '操作人',
            key: 'username',
            width: 100
          },
          {
            title: '方式',
            key: 'method',
            width: 100
          },
          {
            title: '时间',
            key: 'createDate',
            width: 200,
            render:(h,params)=> {
              return h('div',params.row.createDate === null ? '':this.moment(params.row.createDate).format("yyyy年MM月DD日 HH:mm:ss"))
            },
          },
          {
            title: 'ip',
            key: 'ip',
            width: 150
          },
          {
            title:'请求uri',
            key:'uri',
            width: 200,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.uri},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.uri)
              ]);
          }
          },
          {
            title: '参数',
            key: 'params',
            width: 600,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.params},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.params)
              ]);
          }
          },
          {
            title: '方法描述',
            key:'methodDescribe',
            width:220
          }
        ],
        data: [],
        conditionForm: {
            logDateStart:'',
            logDateEnd:''
        },
        total: 0
      }
    },

    created() {
      this.getLog();
    },

    methods: {
      selectAllCancel() {
        this.selectiveList = []
      },
      selectAll(selection) {
        this.selectiveList = selection
      },
      advicesSelective(selection, row) {
        this.selectiveList = selection
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
      },
      getLog(){
        this.$http({
          url:'log/getAllLog',
          method: 'GET',
          params:{
              logDateStart:this.conditionForm.logDateStart,
              logDateEnd:this.conditionForm.logDateEnd
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.data = res.data.data.list;
            this.total = res.data.data.total;
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      pageChange(pageNum) {
        this.$http({
            url: 'log/getAllLog',
            method: 'GET',
            params: {
              logDateStart:this.conditionForm.logDateStart,
              logDateEnd:this.conditionForm.logDateEnd,
              pageNum: pageNum
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      setTime(date){
        this.conditionForm.logDateStart = date[0];
        this.conditionForm.logDateEnd = date[1];
      }
    }
  }

</script>
