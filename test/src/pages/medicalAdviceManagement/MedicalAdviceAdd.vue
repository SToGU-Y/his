<style scoped>
  #medicalAdviceAdd {
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

  #back-btn button {
    display: block;
    margin-bottom: 10px;
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

  #p-box {
    font-size: 16px;
  }

  .table-fixbug {
    overflow: visible;
  }

</style>
<template>
  <div id="medicalAdviceAdd">
    <!-- 内容 -->
    <div id="content">
      <div id="back-btn">
        <Button type="primary" @click="back()">返回</Button>
        <Button type="primary" @click="add()">添加</Button>
        <Button type="primary" @click="save()">保存</Button>
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
          <Table height="630px" :columns="columns" :data="data" class="table-fixbug"></Table>
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
        columns: [{
            title: '开始时间',
            align: 'center',
            children: [{
                title: '开始日期',
                key: 'startDate',
                align: 'center',
                width: 200,
                render(h, {
                  row,
                  index
                }) {
                  return h("DatePicker", {
                    props: {
                      value: row.startDate,
                      format: 'yyyy年MM月dd日'
                    },
                    on: {
                      input: val => {
                        this.data[index].startDate = val;
                      }
                    }
                  })
                }
              },
              {
                title: '开始时间',
                key: 'startTime',
                align: 'center',
                width: 200,
                render(h, {
                  row,
                  index
                }) {
                  return h("TimePicker", {
                    props: {
                      value: row.startTime,
                      format: 'HH:mm',
                      confirm
                    },
                    on: {
                      input: val => {
                        this.data[index].startTime = val;
                      }
                    }
                  })
                }
              }
            ]
          },
          {
            title: '项目',
            key: 'Item',
            align: 'center',
            width: 400,
            render(h, {
              row,
              index
            }) {
              return h("Input", {
                props: {
                  value: row.Item
                },
                on: {
                  input: val => {
                    this.data[index].Item = val;
                  }
                }
              })
            }
          },
          {
            title: '结束时间',
            align: 'center',
            children: [{
                title: '结束日期',
                key: 'endDate',
                align: 'center',
                width: 200,
                render(h, {
                  row,
                  index
                }) {
                  return h("DatePicker", {
                    props: {
                      value: row.endDate,
                      format: 'yyyy年MM月dd日'
                    },
                    on: {
                      input: val => {
                        this.data[index].endDate = val;
                      }
                    }
                  })
                }
              },
              {
                title: '结束时间',
                key: 'endTime',
                align: 'center',
                width: 200,
                render(h, {
                  row,
                  index
                }) {
                  return h("TimePicker", {
                    props: {
                      value: row.endTime,
                      format: 'HH:mm',
                      confirm
                    },
                    on: {
                      input: val => {
                        this.data[index].endTime = val;
                      }
                    }
                  })
                }
              }
            ]
          },
          {
            title: '停嘱医生',
            key: 'endDoc',
            align: 'center',
            width: 150,
            render(h, {
              row,
              index
            }) {
              return h("Input", {
                props: {
                  value: row.endDoc,
                  disabled
                },
                on: {
                  input: val => {
                    this.data[index].endDoc = val;
                  }
                }
              })
            }
          },
          {
            title: '剂量',
            key: 'dose',
            align: 'center',
            width: 100,
            render(h, {
              row,
              index
            }) {
              return h("Input", {
                props: {
                  value: row.dose
                },
                on: {
                  input: val => {
                    this.data[index].dose = val;
                  }
                }
              })
            }
          },
          {
            title: '数量',
            key: 'amount',
            align: 'center',
            width: 100,
            render(h, {
              row,
              index
            }) {
              return h("Input", {
                props: {
                  value: row.amount
                },
                on: {
                  input: val => {
                    this.data[index].amount = val;
                  }
                }
              })
            }
          },
          {
            title: '用法',
            key: 'usage',
            align: 'center',
            width: 150,
            render(h, {
              row,
              index
            }) {
              return h("Input", {
                props: {
                  value: row.usage
                },
                on: {
                  input: val => {
                    this.data[index].usage = val;
                  }
                }
              })
            }
          },
          {
            title: '途径',
            key: 'way',
            align: 'center',
            width: 150,
            render(h, {
              row,
              index
            }) {
              return h("Input", {
                props: {
                  value: row.way
                },
                on: {
                  input: val => {
                    this.data[index].way = val;
                  }
                }
              })
            }
          },
          {
            title: '单价',
            key: 'price',
            align: 'center',
            width: 100,
            render(h, {
              row,
              index
            }) {
              return h("Input", {
                props: {
                  value: row.price,
                  disabled
                },
                on: {
                  input: val => {
                    this.data[index].price = val;
                  }
                }
              })
            }
          }
        ],
        data: [{
          startDate: '',
          startTime: '',
          Item: '',
          endDate: '',
          endTime: '',
          endDoc: '',
          dose: '',
          amount: '',
          usage: '',
          way: '',
          price: ''
        }]
      }
    },

    components: {},

    computed: {},

    methods: {
      back() {
        this.$router.go(-1)
      },
      pre() {
        this.$Message.info("已经是第一个了")
      },
      next() {
        this.$Message.info("已经是最后一个了")
      },
      add() {
        this.$Message.info("添加")
        const addData = {
          startDate: '',
          startTime: '',
          Item: '',
          endDate: '',
          endTime: '',
          endDoc: '',
          dose: '',
          amount: '',
          usage: '',
          way: '',
          price: ''
        };
        this.data.push(addData);
      },
      save() {
        this.$Message.info("保存")
      }
    }
  }

</script>
