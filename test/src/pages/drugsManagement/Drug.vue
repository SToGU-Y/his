<style scoped>
  .table-box {
    margin-top: 10px;
  }

  #page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="drug">
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Input v-model="conditionForm.drugNo" placeholder="请输入药品编号" clearable
            style="width: 200px; margin-right:5px" />
          <Input v-model="conditionForm.drugName" placeholder="请输入药品名称" clearable
            style="width: 200px;margin-right:5px" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getDrug()"></Button>
        </div>
      </Card>
    </div>
    <div class="table-box">
      <Table :columns="columns" :data="data">
      </Table>
    </div>
    <!-- 分页模块 -->
    <div id="page-box">
      <Page :total="total" :page-size="11" show-elevator @on-change="pageChange" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [{
            type: 'index',
            align: 'center'
          },
          {
            title: '药品编号',
            key: 'drugNo',
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.drugNo},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.drugNo)
              ]);
          }
          },
          {
            title: '药品名称',
            key: 'drugName',
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.drugName},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.drugName)
              ]);
          }
          },
          {
            title: '药品规格',
            key: 'drugSpecifications'
          },
          {
            title: '剂量单位',
            key: 'doseUnit'
          },
          {
            title: '单位',
            key: 'drugUnit'
          },
          {
            title: '药品库存',
            key: 'drugNum'
          },
          {
            title: '药品描述',
            key: 'drugDetail',
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.drugDetail},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.drugDetail)
              ]);
          }
          },
          {
            title: '药品单价',
            key: 'drugPrice'
          },
          {
            title: '药品类型',
            key:'drugType'
          }
        ],
        data: [],
        total: 0,
        conditionForm: {
          drugNo: '',
          drugName: ''
        }
      }
    },
    created() {
      this.getDrug();
    },
    methods: {
      getDrug() {
        this.$http({
            url: 'drug/getAllDrug',
            method: 'GET',
            params: this.conditionForm
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
            url: 'drug/getAllDrug',
            method: 'GET',
            params: {
              drugNo: this.conditionForm.drugNo,
              drugName: this.conditionForm.drugName,
              pageNum: pageNum
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
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
