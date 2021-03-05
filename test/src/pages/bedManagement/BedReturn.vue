<style scoped>
  .search-btn {
    margin-left: 10px;
  }

  #select-box{
    margin-bottom: 10px;
  }

  #page-box {
    text-align: center;
    margin-top: 10px;
  }

</style>
<template>
  <div id="bedReturn">
    <!-- 条件查询区域 -->
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Form>
              <Select filterable clearable v-model="conditionForm.deptId" style="width:200px">
                <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
              </Select>
              <Select filterable clearable v-model="conditionForm.iwtId" style="width:200px">
                <Option v-for="item in wardTypeList" :value="item.iwtId" :key="item.iwtId">{{ item.iwtType }}</Option>
              </Select>
              <Input clearable v-model="conditionForm.bid" placeholder="请输入床号" clearable
                style="width: 200px; margin-right:5px" />
                <Input clearable v-model="conditionForm.name" placeholder="请输入病人姓名" clearable
                style="width: 200px; margin-right:5px" />
              <Button class="search-btn" type="primary" shape="circle" icon="ios-search"
                @click="getBedNotNull()"></Button>
            </Form>
          </div>
        </Card>
      </div>
    </div>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="提示">
        此操作将无法恢复！您确定要退床吗？
        <div slot="footer">
          <Button type="primary" @click="returnBed()">退床</Button>
          <Button @click="cancelReturn()">取消</Button>
        </div>
      </Modal>
    <!-- 表格区域 -->
    <Table border :columns="columns" :data="data">
    </Table>
    <!-- 分页区域 -->
    <div id="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" :page-size="11" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [{
            title: '操作',
            render: (h, params) => {
              return h("Button", {
                domProps: {
                  innerText: '退床'
                },
                props: {
                  type: 'primary',
                },
                on: {
                  click: () => {
                    this.check(params)
                  }
                }
              })
            },
            align: 'center'
          },
          {
            title: '所在科室',
            key: 'deptName'
          },
          {
            title: '病房号',
            key: 'wardId'

          },
          {
            title: '病房类型',
            key: 'iwtType'
          },
          {
            title: '床位号',
            key: 'bid'
          },
          {
            title: '床位状态',
            key: 'bedStatus',
            render: (h, params) => {
              return h('div', [
                h('Badge', {
                  attrs: {
                    status: params.row.bedStatus == '1' ? 'error' : 'success'
                  }
                }),
                h('span', {
                  style: {
                    color: params.row.bedStatus == '1' ? 'red' : '#19be6b'
                  }
                }, params.row.bedStatus == '1' ? '已满' : '未满')
              ])
            }
          },
          {
            title: '住院号',
            key: 'admissionNumber'
          },
          {
            title: '病人姓名',
            key: 'pname'
          }
        ],
        data: [],
        deptList: [],
        wardTypeList: [],
        total: 0,
        modal: false,
        conditionForm: {
          deptId: '',
          iwtId: '',
          bid: '',
          name:''
        },
        selectForm:{
          admissionId:'',
          wid:'',
          id:''
        }
      }
    },

    created() {
      this.getDept();
      this.getType();
      this.getBedNotNull();
    },
    methods: {
      getDept() {
        this.$http({
            url: 'common/getDept',
            method: 'GET'
          })
          .then(res => {
            if (res.data.status === 200) {
              this.deptList = res.data.data
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })

      },
      getType() {
        this.$http({
            url: 'ward/getType',
            method: 'GET'
          })
          .then(res => {
            if (res.data.status === 200) {
              this.wardTypeList = res.data.data
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            this.$Message.info("服务器出错")
            console.log(err)
          })
      },
      getBedNotNull() {
        this.$http({
            url: 'bed/getAllBedNotNull',
            method: 'GET',
            params: this.conditionForm
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
              this.total = res.data.data.total
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      pageChange(pageNum) {
        this.$http({
            url: 'bed/getAllBedNotNull',
            method: 'GET',
            params: {
              deptId: this.conditionForm.deptId,
              bedStatus: this.conditionForm.bedStatus,
              iwtId: this.conditionForm.iwtId,
              bid: this.conditionForm.bid,
              name:this.conditionForm.name,
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
              this.total = res.data.data.total
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      check(params) {
        this.selectForm.id = params.row.id;
        this.selectForm.admissionId = params.row.admissionId;
        this.selectForm.wid = params.row.wid;
        this.modal = true;
      },
      returnBed(){
        this.$http({
          url:'bed/returnBed',
          method:'POST',
          data:this.selectForm
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.modal = false;
            this.$Message.info(res.data.data)
            this.getBedNotNull()
          }else if (res.data.status === 500) {
            this.modal = false;
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      cancelReturn(){
        this.modal = false;
      }
      
    }
  }

</script>
