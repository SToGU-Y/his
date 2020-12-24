<style scoped>
  #medicalAdviceDetail {
    width: 100%;
    height: 100%;
  }

  #content {
    position: relative;
    width: 1500px;
  }

  #back-btn {
    position: absolute;
    display: inline-block;
    left: 0px;
  }

  #medicalAdvice {
    display: inline-block;
    width: 1300px;
    height: 800px;
  }

  #btn-box {
    position: absolute;
    right: 0px;
    display: inline-block;
  }

  #btn-box button {
    margin-bottom: 10px;
    display: block;
  }

  #p-box{
    font-size: 16px;
  }

</style>
<template>
  <div id="medicalAdviceDetail">
    <!-- 内容 -->
    <div id="content">
      <div id="back-btn">
        <Button type="primary" @click="back">返回</Button>
      </div>
      <div style="background:#eee;padding:20px" id="medicalAdvice">
        <!-- 病人信息 -->
        <div id="p-box" style="background: white;">
          <h2>病人信息</h2>
          <Row>
            <Col span="6">
            姓名:张三
            </Col>
            <Col span="6">
            性别:男
            </Col>
            <Col span="6">
            年龄:48
            </Col>
            <Col span="6">
             入院科室:泌尿科
            </Col>
          </Row>
          <Row>
            <Col span="6">
              病房:48号
            </Col>
            <Col span="6">
              床位:S523
            </Col>
            <Col span="6">
              住院号:812463
            </Col>
            <Col span="6">
              医嘱医生:李四
            </Col>
          </Row>
        <Divider />
        <!-- 医嘱表格 -->
        <Table height="630px" :columns="columns" :data="data"></Table> 
      </div>
      </div>
      <div id="btn-box">
        <Button type="primary" @click="pre()">上一个</Button>
        <Button type="primary" @click="next()">下一个</Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [
          {
            title: '开始时间',
            align: 'center',
            children: [{
                title: '开始日期',
                key: 'startDate',
                align: 'center',
                width: 200
              },
              {
                title: '开始时间',
                key: 'startTime',
                align: 'center',
                width: 200
              }
            ]
          },
          {
            title: '项目',
            key: 'Item',
            align: 'center',
            width: 400
          },
          {
            title: '结束时间',
            align: 'center',
            children: [{
                title: '结束日期',
                key: 'endDate',
                align: 'center',
                width: 200
              },
              {
                title: '结束时间',
                key: 'endTime',
                align: 'center',
                width: 200
              }
            ]
          },
          {
            title: '停嘱医生',
            key: 'endDoc',
            align: 'center',
            width: 150
          },
          {
            title: '剂量',
            key: 'dose',
            align: 'center',
            width: 100
          },
          {
            title: '数量',
            key: 'amount',
            align: 'center',
            width: 100
          },
          {
            title: '用法',
            key: 'usage',
            align: 'center',
            width: 150
          },
          {
            title: '途径',
            key: 'way',
            align: 'center',
            width: 150
          },
          {
            title: '单价',
            key: 'price',
            align: 'center',
            width: 100
          }
        ],
        data:[
          {
            startDate:'1982-01-02',
            startTime:'06:00:00',
            Item:'马杀鸡',
            endDate:'1982-01-05',
            endTime:'06:00:00',
            endDoc:'王五',
            dose:'56',
            amount:'525',
            usage:'',
            way:'',
            price:'26/克'
          }
        ] 
      }
    },

    components: {},

    computed: {},

    methods: {
      back() {
        this.$router.go(-1)
      },
      pre(){
        this.$Message.info("已经是第一个了")
      },
      next(){
        this.$Message.info("已经是最后一个了")
      }
    }
  }

</script>
