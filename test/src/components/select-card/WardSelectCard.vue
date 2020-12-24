<style scoped>
</style>
<template>
  <div id="wardSelectCard">
     <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Select filterable clearable v-model="deptIdSelective" style="width:200px">
            <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
          </Select>
          <Input v-model="iwardId" placeholder="请输入病房号" clearable style="width: 200px; margin-right:5px" />
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
        iwardId:'',
        deptIdSelective:''
    }
  },

  components: {},

  computed: {},

  methods: {}
}

</script>