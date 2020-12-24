<style scoped>
</style>
<template>
<div id="drug">
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
</template>

<script>
export default {
  data () {
    return {
    }
  },

  components: {},

  computed: {},

  methods: {}
}

</script>