<style scoped>
  #type-add-box {
    height: 500px;
  }

  .page-box{
    margin-top: 5px;
  }

  #btn-box {
    text-align: left;
    margin-top: 5px;
  }

</style>
<template>
  <div id="wardType">
    <div style="background:#eee;padding:20px">
      <Table height="280px" :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
          <Button type="primary" size="small" style="margin-right: 5px" @click="update(index)">更改</Button>
        </template>
      </Table>
      <!-- 分页模块 -->
      <div class="page-box">
        <Page :total="total" show-elevator :page-size="pageSize" @on-change="pageChange" />
      </div>
    </div>

    <div id="btn-box">
      <Button type="primary" @click="modal = true">新增</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal">
        <Form ref="form" :rules="ruleValidate" :model="form" label-colon=":" label-position="right" :label-width="100">
          <FormItem label="病房类型" prop="iwtType">
            <Input v-model="form.iwtType" />
          </FormItem>
          <FormItem label="病房价格" prop="iwtPrice">
            <Input v-model="form.iwtPrice" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="add()">添加</Button>
          <Button @click="cancel()">取消</Button>
        </div>
      </Modal>
      <Modal :mask-closable="false" :closable="false" v-model="modal2">
        <Form ref="form2" :rules="ruleValidate" :model="form2" label-colon=":" label-position="right"
          :label-width="100">
          <FormItem label="病房类型" prop="iwtType">
            <Input v-model="form2.iwtType" />
          </FormItem>
          <FormItem label="病房价格" prop="iwtPrice">
            <Input v-model="form2.iwtPrice" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="updated()">更改</Button>
          <Button @click="cancel2()">取消</Button>
        </div>
      </Modal>
      <Modal v-model="modal3" title="提示">
        此操作将无法恢复！您确定要删除吗？
        <div slot="footer">
          <Button type="primary" @click="deleted()">删除</Button>
          <Button @click="cancel3()">取消</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [{
            title: '病房类型',
            key: 'iwtType'
          },
          {
            title: '病房价格(元/晚)',
            key: 'iwtPrice'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        data: [],
        modal: false,
        modal2: false,
        modal3: false,
        iwtId: '',
        total: 0,
        pageNum: 1,
        pageSize: 5,
        form: {
          iwtType: '',
          iwtPrice: ''
        },
        form2: {
          iwtType: '',
          iwtPrice: ''
        },
        ruleValidate: {
          iwtType: [{
            required: true,
            message: '类型不能为空',
            trigger: 'change'
          }],
          iwtPrice: [{
              required: true,
              message: '价格不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^\d+(\.\d+)?$/,
              message: '请输入数字',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created() {
      this.getType()
    },
    methods: {
      del(index) {
        this.iwtId = this.data[index].iwtId;
        this.modal3 = true;
      },
      deleted() {
        this.$http({
            url: 'ward/delType',
            method: 'DELETE',
            params: {
              iwtId: this.iwtId
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.modal3 = false;
              this.$Message.info(res.data.data)
              this.pageChange(this.pageNum);
            } else if (res.data.status === 500) {
              this.modal3 = false;
              this.$Message.info(res.data.data)
              this.pageChange(this.pageNum);
            }
          })
          .catch(err => {
            this.$Message.info("服务器出错")
            this.modal3 = false;
          })
      },
      add() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$http({
                method: 'POST',
                url: 'ward/addType',
                data: {
                  iwtType: this.form.iwtType,
                  iwtPrice: this.form.iwtPrice
                }
              })
              .then(res => {
                if (res.data.status === 200) {
                  this.$Message.info("添加成功");
                  this.form = {
                    iwtType: '',
                    iwtPrice: ''
                  }
                  this.modal = false;
                  this.pageChange(this.pageNum);
                } else if (res.data.status === 500) {
                  this.$Message.info("添加失败");
                  this.$Message.info(res.data.msg)
                  this.form = {
                    iwtType: '',
                    iwtPrice: ''
                  }
                  this.modal = false;
                }
              })
              .catch(err => {
                console.log(err);
                this.$Message.info("添加失败");
                this.modal = false;
              })
          }
        })
      },
      getType() {
        this.$http({
            url: 'ward/getTypeByPage',
            method: 'GET'
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
              this.total = res.data.data.total;
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            this.$Message.info("服务器出错")
            console.log(err)
          })
      },
      pageChange(pageNum) {
        this.$http({
            url: 'ward/getTypeByPage',
            method: 'GET',
            params: {
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
              this.pageNum = pageNum
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      update(index) {
        this.modal2 = true;
        this.form2 = {
          iwtId: this.data[index].iwtId,
          iwtType: this.data[index].iwtType,
          iwtPrice: this.data[index].iwtPrice
        }
      },
      updated() {
        this.$refs.form2.validate(valid => {
          if (valid) {
            this.$http({
                method: 'POST',
                url: 'ward/updateType',
                data: {
                  iwtId: this.form2.iwtId,
                  iwtType: this.form2.iwtType,
                  iwtPrice: this.form2.iwtPrice
                }
              })
              .then(res => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data);
                  this.form2 = {
                    iwtId: '',
                    iwtType: '',
                    iwtPrice: ''
                  }
                  this.modal2 = false;
                  this.pageChange(this.pageNum);
                } else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg);
                  this.form2 = {
                    iwtId: '',
                    iwtType: '',
                    iwtPrice: ''
                  }
                  this.modal2 = false;
                }
              })
              .catch(err => {
                console.log(err);
                this.$Message.info("服务器出错")
                this.modal = false;
              })
          }
        })

      },
      cancel() {
        this.modal = false;
      },
      cancel2() {
        this.modal2 = false;
      },
      cancel3() {
        this.iwtId = '';
        this.modal3 = false;
      }
    }
  }

</script>
