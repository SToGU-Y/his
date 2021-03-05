<style scoped>
  .page-box {
    margin-top: 10px;
  }

  .btn-box{
    margin: 5px;
    text-align: left;
  }

  #printMe h2{
    text-align: center;
  }

</style>
<template>
  <div id="depositReturn">
    <!-- 查询组件 -->
    <div class="card-box" style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Input placeholder="请输入押金号" v-model="conditionForm.desId" autofocus clearable style="width: 200px;" />
          <Input placeholder="请输入操作工号" v-model="conditionForm.operator" clearable style="width: 200px;" />
          <DatePicker type="daterange" placement="bottom-end" placeholder="请选择退款时间"
            style="width: 200px;margin-right:5px"
            format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getRefund"></Button>
        </div>
      </Card>
    </div>
    <div class="btn-box">
      <Button type="primary" v-print="printObj">打印</Button>
      <Button v-if="auth === 'ROLE_ADMIN'" type="error" @click="modal = true">删除</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="提示">
        是否删除所选项？
        <div slot="footer">
          <Button type="error" @click="del()">是</Button>
          <Button @click="no()">否</Button>
        </div>
      </Modal>
    </div>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll" @on-select="advicesSelective" @on-select-cancel="cancelSelect" 
        border :columns="columns" :data="data">
      </Table>

        <div style="display:none;">
          <div id="printMe">
            <h2>退款单记录</h2>
            <table  align="center" border="1" width="700px">
              <tr>
                <th>序号</th>
                <th>押金单号</th>
                <th>金额</th>
                <th>退款时间</th>
                <th>操作人员</th>
              </tr>
              <tr v-for="(item,index) in selectiveList" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.desId}}</td>
                <td>{{item.deposit}}</td>
                <td>{{moment(item.dateRefund).format('YYYY-MM-DD')}}</td>
                <td>{{item.sid}}</td>
              </tr>
            </table>
          </div>
        </div>
    </div>
    <!-- 分页 -->
    <div class="page-box">
      <Page :total="total" :page-size="12" show-elevator @on-change="pageChange" />
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '押金单号',
            key: 'desId',
            width: 160
          },
          {
            title: '押金金额',
            key: 'deposit'
          },
          {
            title: '押金状态',
            key: 'status',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Badge', {
                  attrs: {
                    status: params.row.status == '1' ? 'success' : 'error'
                  }
                }),
                h('span', {
                  style: {
                    color: params.row.status == '1' ? '#19be6b' : 'red'
                  }
                }, params.row.status == '1' ? '已交' : '未交')
              ])
            }
          },
          {
            title: '付款方式',
            key: 'paymentType',
            width: 100
          },
          {
            title: '操作人',
            key: 'sid'
          },
          {
            title: '付款时间',
            key: 'datePay',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', params.row.datePay == null ? '' : this.moment(params.row.datePay).format(
                'YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '退款时间',
            key: 'dateRefund',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', params.row.dateRefund == null ? '' : this.moment(params.row.dateRefund).format(
                'YYYY-MM-DD HH:mm:ss'))
            }
          }
        ],
        data: [],
        modal: false,
        total: 0,
        sid: '',
        auth:'',
        conditionForm: {
          desId: '',
          operator: '',
          refundDateStart:'',
          refundDateEnd:''
        },
        printObj:{
          id:'printMe',
          popTitle: '退款单记录',
          extraHead: '<meta http-equiv="Content-Language" content="zh-ch"/>'
        },
        selectiveList:[]
      }
    },

    created() {
      this.getRefund();
      this.sid = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.auth = JSON.parse(localStorage.getItem("TOKEN")).auth[0].authority;
    },

    methods: {
      getRefund() {
        this.$http({
            url: 'deposit/getRefund',
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
            this.$Message.info("服务器出错")
          });
      },
      pageChange(pageNum) {
        this.$http({
            url: 'deposit/getRefund',
            method: 'GET',
            params: {
              desId: this.conditionForm.desId,
              operator: this.conditionForm.operator,
              refundDateStart: this.conditionForm.refundDateStart,
              refundDateEnd: this.conditionForm.refundDateEnd,
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
            this.$Message.info("服务器出错")
          });
      },
      advicesSelective(selection, row) {
        this.selectiveList = selection
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
      },
      selectAllCancel(){
        this.selectiveList = []
      },
      selectAll(selection){
        this.selectiveList = selection
      },
      del(){
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的选项")
        }else{
          this.$http({
            url:'deposit/delRefundDeposit',
            method:'POST',
            data:this.selectiveList
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.modal = false;
              this.getRefund()
            }else{
              this.$Message.info(res.data.msg)
              this.modal = false;
            }
          })
          .catch((err) => {
            console.log(err);
          });
        }
      },
      no(){
        this.modal = false;
      },
      setTime(date){
        this.conditionForm.refundDateStart = date[0];
        this.conditionForm.refundDateEnd = date[1];
      },
    }
  }

</script>
