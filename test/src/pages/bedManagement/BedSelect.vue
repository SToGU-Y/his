<style scoped>
</style>
<template>
<div id="">
    <!-- 条件查询区域 -->
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Select filterable clearable v-model="deptIdSelective" style="width:200px">
              <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
            </Select>
           <Select v-model="status" style="width:200px" label="病床类型">
              <Option value="I">I级</Option>
              <Option value="II">II级</Option>
            </Select>
            <Select v-model="status" style="width:200px" label="病房状态">
              <Option value="1">已满</Option>
              <Option value="0">未满</Option>
            </Select>
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="search()"></Button>
          </div>
        </Card>
      </div>
    </div>
    <!-- 表格区域 -->
    <Table height="600px" border :columns="columns" :data="data">
    </Table>
    <!-- 分页区域 -->
    <Page :total="100" show-elevator />
</div>
</template>

<script>
export default {
  data () {
    return {
        columns: [
            {
                title: '操作',
                render:(h,index)=> {
                   return  h("Button",{
                       domProps:{
                           innerText:'选择'
                       },
                       props :{
                           type: 'primary',
                       }
                   })
                },
                align:'center'
            },
            {
            title: '所在科室',
            key: 'deptId'
            },
          {
            title: '病房号',
            key: 'wardId'
            
          },
          {
            title: '病房类型',
            key: 'wardType'
          },
          {
              title: '床位号',
              key: 'bid'
          },
          {
            title: '床位状态',
            key: 'bedStatus'
          },
          {
            title: '病房可住人数',
            key: 'people'
          },
          {
            title: '病房价格',
            key: 'price'
          }
        ],
        data:[
            {
                deptId:'小儿科',
                wardId:'035',
                wardType:'I级病房',
                bid: '1',
                bedStatus:'未满',
                people:'5',
                price: '500元/晚'
            },
            {
                deptId:'小儿科',
                wardId:'035',
                wardType:'I级病房',
                bid: '1',
                bedStatus:'未满',
                people:'5',
                price: '500元/晚'
            },
            {
                deptId:'小儿科',
                wardId:'035',
                wardType:'I级病房',
                bid: '1',
                bedStatus:'未满',
                people:'5',
                price: '500元/晚'
            }
        ]
    }
  },

  created(){
    
  },
  components: {},

  computed: {},

  methods: {
   
  }
}

</script>