<style scoped>
  #ward {
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
  <div id="ward">
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Select filterable clearable v-model="deptIdSelective" style="width:200px">
              <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
            </Select>
            <Select filterable clearable v-model="wardStatus" style="width:200px">
              <Option value="0">未满</Option>
              <Option value="1">已满</Option>
            </Select>
            <Input v-model="wardId" placeholder="请输入病房号" clearable style="width: 200px; margin-right:5px" />
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="search()"></Button>
          </div>
        </Card>
      </div>
    </div>
    <div id="btn-box">
    </div>
    <Table :columns="columns" :data="datas">
    </Table>
    <div id="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" :page-size="11"></Page>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [{
            title: '所在科室',
            key: 'deptName'
          },
          {
            title: '病房',
            key: 'wardId'
          },
          {
            title: '病房类型',
            key: 'iwtType'
          },
          {
            title: '病房状态',
            key: 'wardStatus',
            render: (h, params) => {
              return h('div', [
                h('Badge', {
                  attrs: {
                    status: params.row.wardStatus == '1' ? 'error' : 'success'
                  }
                }),
                h('span', {
                  style: {
                    color: params.row.wardStatus == '1' ? 'red' : '#19be6b'
                  }
                }, params.row.wardStatus == '1' ? '已满' : '未满')
              ])
            }
          },
          {
            title: '病房可住人数',
            key: 'wardBedNum'
          },
          {
            title: '病房价格',
            key: 'iwtPrice'
          }
        ],
        wardStatus: '',
        deptIdSelective: '',
        wardId: '',
        datas: [],
        deptList: [],
        total: 0,
        wardTypeList: [],
        pageNum: 1,
      }
    },

    created() {
      this.getDept();
      this.getWard();
      this.getType();
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
      getWard() {
        this.$http({
            url: 'ward/getWardByCondition',
            method: 'GET',
            params: {
              deptIdSelective: this.deptIdSelective,
              wardStatus: this.wardStatus,
              wardId: this.wardId
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
              this.wardTypeList = res.data.data;
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            this.$Message.info("服务器出错")
            console.log(err)
          })
      },
      search() {
        this.$http({
            url: 'ward/getWardByCondition',
            method: 'GET',
            params: {
              deptIdSelective: this.deptIdSelective,
              wardStatus: this.wardStatus,
              wardId: this.wardId
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
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      pageChange(pageNum) {
        this.$http({
            url: 'ward/getWardByCondition',
            method: 'GET',
            params: {
              deptIdSelective: this.deptIdSelective,
              wardStatus: this.wardStatus,
              wardId: this.wardId,
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.datas = res.data.data.list
              this.pageNum = pageNum
              this.total = res.data.data.total
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      }
    }
  }

</script>
