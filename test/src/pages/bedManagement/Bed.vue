<style scoped>
  #bed {
    text-align: left;
  }

  #select-box {
    text-align: center;
    margin-bottom: 10px;
  }

  #page-box {
    margin-top: 10px;
    text-align: center;
  }

</style>
<template>
  <div id="bed">
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
              <Select clearable v-model="conditionForm.bedStatus" style="width:200px">
                <Option value="1">已用</Option>
                <Option value="0">未用</Option>
              </Select>
              <Input clearable v-model="conditionForm.bid" placeholder="请输入床号" clearable
                style="width: 200px; margin-right:5px" />
                <Input clearable v-model="conditionForm.name" placeholder="请输入病人姓名" clearable
                style="width: 200px; margin-right:5px" />
              <Button class="search-btn" type="primary" shape="circle" icon="ios-search"
                @click="getBedInformation()"></Button>
            </Form>
          </div>
        </Card>
      </div>
    </div>  
    <Table :columns="columns" :data="datas"></Table>
    <div id="page-box">
      <Page :total="total" @on-change="pageChange" :page-size="11"></Page>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        modal1: false,
        modal2: false,
        disabled: true,
        columns: [{
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
                }, params.row.bedStatus == '1' ? '已用' : '未用')
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
        deptList: [],
        wardTypeList: [],
        wardList: [],
        datas: [],
        conditionForm: {
          deptId: '',
          bedStatus: '',
          iwtId: '',
          bid: '',
          name:''
        },
        total: 0,
        addform: {
          wid: '',
          bid: ''
        },
        delid: ''
      }
    },

    created() {
      this.getDept();
      this.getType();
      this.getBedInformation();
    },

    methods: {
      getBedInformation() {
        this.$http({
            url: 'bed/getAllBed',
            method: 'GET',
            params: this.conditionForm
          })
          .then(res => {
            if (res.data.status === 200) {
              this.datas = res.data.data.list
              this.total = res.data.data.total
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
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
      pageChange(pageNum) {
        this.$http({
            url: 'bed/getAllBed',
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
              this.datas = res.data.data.list
              this.total = res.data.data.total
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err);
          })
      }
    }
  }

</script>
