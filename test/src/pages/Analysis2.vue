<style scoped>
  #top {
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
    background: #eee;
    padding: 20px;
  }

  #content {
    padding: 20px;
    background: #eee;
    height: 700px;
    overflow: scroll;
  }

  #top div,
  p {
    position: relative;
    display: inline-block;
    height: 100%;
    width: 15%;
    background: white;
    line-height: 60px;
  }

  #top div p {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    font-size: 8px;
    color: orange;
  }

  .content-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .condition {
    margin-bottom: 20px;
  }

  #top div span {
    position: absolute;
    left: 65%;
    font-size: 18px;
  }

  #left-content,
  #right-content {
    display: inline-block;
    width: 600px;
    height: 450px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 20px
  }

  #left-content {
    margin-right: 20px;
  }

  #center-content {
    margin: 0 auto;
    width: 80%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 20px
  }

</style>
<template>
  <div id="analysis2">
    <div id="top">
      <div>
        <p>今日收预缴金</p>
        <span>{{this.money.todayDeposit}}</span>
      </div>
      <div>
        <p>今日结算收款</p>
        <span>{{this.money.todayBill}}</span>
      </div>
      <div>
        <p>累计收预缴金</p>
        <span>{{this.money.totalDeposit}}</span>
      </div>
      <div>
        <p>累计结算收款</p>
        <span>{{this.money.totalBill}}</span>
      </div>
      <div>
        <p>总计</p>
        <span>{{this.money.todayDeposit+this.money.todayBill}}</span>
      </div>
    </div>
    <div id="content">
      <div class="condition">
        <DatePicker v-model="conditionForm2.date" type="year" placeholder="请选择年份" style="width: 200px"
          @on-change="setTime2"></DatePicker>
        <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="refresh2()"></Button>
      </div>
      <div id="center-content">
        <div>
          <div class="content-title">月收款情况</div>
          <ve-line :data="chartData3" :settings="chartSettings3" :extend="extend2"></ve-line>
        </div>
      </div>

      <div class="condition">
        <DatePicker type="daterange" placement="bottom-end" placeholder="请选择时间" style="width: 200px;margin-right:5px"
          format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
        <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="refresh()"></Button>
      </div>
      <div class="content-title">
        收款统计
      </div>
      <div id="left-content">
        <div>
          <div class="content-title">预缴金收款情况</div>
          <ve-histogram :data="chartData" :settings="chartSettings" :extend="extend"></ve-histogram>
        </div>
      </div>
      <div id="right-content">
        <div>
          <div class="content-title">结算收款情况</div>
          <ve-histogram :data="chartData2" :settings="chartSettings2" :extend="extend"></ve-histogram>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        chartData: {
          columns: ['dept', 'money'],
          rows: []
        },
        chartData2: {
          columns: ['dept', 'money'],
          rows: []
        },
        chartData3: {
          columns: ['month', 'money'],
          rows: []
        },
        chartSettings: {
          labelMap: {
            dept: '科室',
            money: '收款'
          },
          area: true,
          legendName: {
            legend: '各科室收款情况'
          }
        },
        chartSettings2: {
          labelMap: {
            dept: '科室',
            money: '收款'
          },
          area: true,
          legendName: {
            legend: '各科室收款情况'
          }
        },
        chartSettings3: {
          labelMap: {
            'month': '月份',
            'money': '收款'
          },
          area: true
        },
        extend: {
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          }
        },
        extend2: {
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            name: '月份',
          },
          series: {
            
          }
        },
        money: {},
        conditionForm: {
          dateS: '',
          dateE: ''
        },
        conditionForm2: {
          date: ''
        }
      }
    },

    created() {
      this.conditionForm2.date = new Date();
      this.getBill();
      this.getDeposit();
      this.getMoneyMessage();
      this.getStatisticsMonth();
    },

    methods: {
      getDeposit() {
        this.$http({
            url: 'analysis/getDeposit',
            method: 'GET',
            params: {
              date: this.conditionForm.dateS,
              date1: this.conditionForm.dateE
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.chartData.rows = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      getBill() {
        this.$http({
            url: 'analysis/getBill',
            method: 'GET',
            params: {
              date: this.conditionForm.dateS,
              date1: this.conditionForm.dateE
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.chartData2.rows = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      getMoneyMessage() {
        this.$http({
            url: 'analysis/getMoneyMessage',
            method: 'GET'
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.money = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      refresh() {
        this.getDeposit()
        this.getBill()
      },
      setTime(date) {
        this.conditionForm.dateS = date[0];
        this.conditionForm.dateE = date[1];
      },
      getStatisticsMonth() {
        this.$http({
            url: 'analysis/getStatisticsMonth',
            method: 'GET',
            params: {
              date: this.moment(this.conditionForm2.date).format('YYYY')
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.chartData3.rows = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      refresh2() {
        this.getStatisticsMonth();
      },
      setTime2(date) {
        this.conditionForm2.date = date
      }


    }
  }

</script>
