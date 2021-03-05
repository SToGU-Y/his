<style scoped>

  #select-box{
    margin-bottom: 10px;
  }

  #page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="dept">
    <div id="select-box" style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Select filterable clearable v-model="conditionForm.type" style="width:200px">
            <Option v-for="appliance in applianceTypeList" :value="appliance.mtName" :key="appliance.mtName">{{ appliance.mtName }}</Option>
          </Select>
          <Input v-model="conditionForm.name" placeholder="请输入设备名" clearable
            style="width: 200px; margin-right:5px" />
          <Input v-model="conditionForm.no" placeholder="请输入设备编号" clearable
            style="width: 200px;margin-right:5px" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getEquipment()"></Button>
        </div>
      </Card>
    </div>
    <div>
    
    <Table  :columns="columns" :data="data"></Table>
    <Modal :mask-closable="false" :closable="false" v-model="modal" title="借出">
      <Form ref="borrow" label-position="right" :label-width="100" label-colon=":" :rules="ruleValidate"
        :model="borrowForm">
        <FormItem label="备注" prop="remarks">
          <Input v-model="borrowForm.remarks" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="yes()">确定</Button>
        <Button @click="no()">取消</Button>
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
        columns: [
          {
            type: 'index',
            align: 'center',
            width: 60
          },
          {
            title: '操作',
            render: (h, params) => {
              return h("div", [
                h('Button',{
                domProps: {
                  innerText: '借用'
                },
                props: {
                  type: 'primary',
                  disabled: params.row.status == 0 ? false : true
                },
                on: {
                  click: () => {
                    this.borrow(params)
                  }
                }
              }),
              h('Button',{
                domProps: {
                  innerText: '退还'
                },
                props: {
                  type: 'error',
                  disabled: params.row.status == 1 ? false : true
                },
                on: {
                  click: () => {
                    this.return(params)
                  }
                }
              })
              ])
            },
            width: 200,
            align: 'center'
          },
          {
            title:'器械编号',
            key: 'no',
            width: 150
          },
          {
            title:'器械名称',
            key:'name',
            width: 100
          },
          {
            title:'厂商',
            key:'manufacturer',
            width: 100,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.manufacturer},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.manufacturer)
              ]);
          }
          },
          {
            title: '器械状态',
            key: 'status',
            render(h,params) {
              return h('div', [
                h('Badge', {
                  attrs: {
                    status: params.row.status == '1' ? 'error' : 'success'
                  }
                }),
                h('span', {
                  style: {
                    color: params.row.status == '1' ? 'red' : '#19be6b'
                  }
                }, params.row.status == '1' ? '借用中' : '在仓')
              ])
            },
            width: 100
          },
          {
            title:'器械类型',
            key: 'type',
            width: 100
          },
          {
            title: '器械详细',
            key: 'details',
            width: 600,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.details},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.details)
              ]);
          }
          },
          {
            title: '备注',
            key:'remarks',
            width: 300,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.remarks},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.remarks)
              ]);
          }
          }
        ],
        data: [],
        total: 0,
        modal: false,
        applianceTypeList: [],
        conditionForm: {
          type: '',
          no: '',
          name: ''
        },
        borrowForm:{
          id:'',
          remarks:''
        },
        ruleValidate: {
          remarks: [{
            required: true,
            message: '备注不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getApplianceType()
      this.getEquipment()
    },
    methods: {
      getApplianceType(){
        this.$http({
          url:'appliance/getApplianceType',
          method:'GET'
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.applianceTypeList = res.data.data
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      getEquipment(){
        this.$http({
          url:'appliance/getAppliance',
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
          url:'appliance/getAppliance',
          method:'GET',
          params:{
            type: this.conditionForm.type,
            no: this.conditionForm.no,
            name: this.conditionForm.name,
            pageNum:pageNum
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.data = res.data.data.list
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      borrow(params){
        this.borrowForm.id = params.row.id;  
        this.modal = true;
      },
      return(params){
        this.$http({
          url:'appliance/returnEquipment',
          method:'POST',
          data:{
            id:params.row.id
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.$Message.info(res.data.data)
            this.getEquipment()
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      yes(){
        this.$refs.borrow.validate(valid=>{
          if (valid) {
            this.$http({
          url:'appliance/borrowEquipment',
          method:'POST',
          data:this.borrowForm
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.getEquipment()
            this.$Message.info(res.data.data)
            this.modal = false;
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
          }
        })
      },
      no(){
        this.modal = false;
        this.$refs.borrow.resetFields()
      }
    }
  }

</script>
