<style scoped>
  #table-box {
    margin-top: 10px;
  }

  #page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="staffQuit">
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Select filterable clearable v-model="conditionForm.deptName" style="width:200px">
            <Option v-for="item in deptList" :value="item.deptName" :key="item.deptName">{{ item.deptName }}</Option>
          </Select>
          <Input v-model="conditionForm.username" placeholder="请输入工号" clearable
            style="width: 200px; margin-right:5px" />
          <Input v-model="conditionForm.idNumber" placeholder="请输入身份证号" clearable
            style="width: 200px;margin-right:5px" />
          <Input v-model="conditionForm.staffName" placeholder="请输入员工姓名" clearable
            style="width: 200px;margin-right:5px" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getStaff()"></Button>
        </div>
      </Card>
    </div>
    <div id="table-box">
      <Table :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
        </template>
      </Table>

      <Modal :mask-closable="false" :closable="false" v-model="modal" title="提示">
        此操作将无法恢复！您确定要删除吗？
        <div slot="footer">
          <Button type="error" @click="delStaff">删除</Button>
          <Button @click="canceldel()">取消</Button>
        </div>
      </Modal>
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
        columns:[{
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          },
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '工号',
            key: 'username',
            width: 150
          },
          {
            title: '姓名',
            key: 'staffName',
            width: 150
          },
          {
            title: '性别',
            key: 'staffSex',
            width: 80
          },
          {
            title: '婚况',
            key: 'staffMarried',
            width: 150
          },
          {
            title: '身份证号',
            key: 'idNumber',
            width: 200
          },
          {
            title: '联系电话',
            key: 'staffTel',
            width: 200
          },
          {
            title: '所属部门',
            key: 'deptName',
            width: 150
          },
          {
            title: '居住地址',
            key: 'staffAddr',
            width: 250
          },
          { 
            title: '角色',
            key: 'role',
            render(h,params) {
              var newArr = [];
              params.row.roles.forEach(element => {
                newArr.push(h ('Tag',{prop:{color: "red"},style:{margin:"5px"}},element.roleName) )
              })
              return h("div",newArr)
            },
            width:150
          }
        ],
        data: [],
        deptList:[],
        modal:false,
        total: 0,
        conditionForm: {
          deptName: '',
          username: '',
          idNumber: '',
          staffName: ''
        },
        delUsername:''
      }
    },
    created() {
      this.getDept()
      this.getStaff()
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
      getStaff() {
        this.$http({
            url: 'staff/getStaff',
            method: 'GET',
            params: this.conditionForm
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
      del(index){
        this.delUsername = this.data[index].username
        this.modal = true; 
      },
      delStaff(){
        this.$http({
          url:'staff/delStaff',
          method:'DELETE',
          params:{
            username:this.delUsername
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.modal = false
            this.$Message.info(res.data.data)
            this.getStaff()
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      canceldel(){
        this.modal = false
      },
      pageChange(pageNum) {
        this.$http({
            url: 'staff/getStaff',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptName,
              username: this.conditionForm.username,
              idNumber: this.conditionForm.idNumber,
              staffName: this.conditionForm.staffName,
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
