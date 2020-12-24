<style scoped>
  #bed {
    text-align: left;
  }

  #select-box {
    text-align: center;
    margin-bottom: 7px;
  }

  #btn-box {
    margin-bottom: 7px;
  }
</style>
<template>
  <div id="bed">
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Select filterable clearable v-model="deptIdSelective" style="width:200px">
              <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
            </Select>
            <Input v-model="bid" placeholder="请输入床号" clearable style="width: 200px; margin-right:5px" />
            <Select v-model="status" style="width:200px" label="病房状态">
              <Option value="1">已满</Option>
              <Option value="0">未满</Option>
            </Select>
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="search()"></Button>
          </div>
        </Card>
      </div>
    </div>
    <div id="btn-box">
      <Button type="primary" @click="modal1 = true">新增病床</Button>
      <Button type="error" @click="modal2 = true">删除病床</Button>

      <Modal v-model="modal1">
        <Form>

        </Form>
      </Modal>
      <Modal v-model="modal2">
        <Form>

        </Form>
      </Modal>
    </div>
    <Table :columns="columns"></Table>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        modal1: false,
        modal2: false,
        columns:[
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
        ]
      }
    },

    components: {
    },

    computed: {},

    methods: {}
  }

</script>
