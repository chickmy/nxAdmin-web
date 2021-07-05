<template>
    <el-dialog
      :visible.sync="visible"
      @close="onClose"
      title="订单退款"
      footer-hide :styles="{top: '20px'}">
      <el-form :model="ruleForm" ref="form" label-width="80px" v-loading="loading" :rules="rules" class="demo-ruleForm">
        <el-form-item label="选择商品" prop="select">
          <el-select v-model="ruleForm.select" @change="showTitle" filterable placeholder="请选择退款商品">
            <el-option
              v-for="item in formData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="商品信息" v-show="show_title">
          <p>标题： {{ title }}</p>
          <p>订单金额： {{ order_price }}</p>
        </el-form-item>
        <el-form-item  label="退款金额" v-show="show_title" prop="refund_price">
          <el-input v-model="ruleForm.refund_price" placeholder="请输入退款金额" style="width: 217px"></el-input>
        </el-form-item>
        <el-form-item label="退款理由" v-show="show_title" prop="comment">
          <el-select v-model="ruleForm.comment" filterable placeholder="请选择退款理由">
            <el-option label="Out of stock or damaged" value="1"></el-option>
            <el-option label="Buyer asked to cancel" value="2"></el-option>
            <el-option label="lssue with buyer's shipping address" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import { selectEx, refund } from '@api/ebay/ebayOrder'

export default {
  name: 'ebay-order-refund',
  data () {
    return {
      id: 0,
      visible: false,
      loading: false,
      ruleForm: {
        select: '',
        refund_price: '',
        comment: '',
      },
      formData: [],
      title: '',
      show_title: false,
      order_price: '',
      rules: {
        select: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
        refund_price: [
          { required: true, message: '请输入金额', trigger: 'blur' },
        ],
        comment: [
          { required: true, message: '请选择', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    open (id = 0) {
      this.id = id
      this.visible = true
      this.$nextTick(() => {
        this.loadData()
      })
    },
    onClose () {
      this.$refs.form.resetFields()
    },
    loadData () {
      this.loading = true
      Promise.all([
        selectEx(this.id),
      ]).then(values => {
        this.$refs.form.resetFields()
        if (values[0]) {
          this.formData = values[0]
        }
      }).finally(() => {
        this.loading = false
      })
    },
    submit () {
      this.loading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          refund(this.ruleForm).then(() => {
            this.visible = false
          }).finally(() => {
            this.loading = false
            this.$emit('on-submit')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showTitle (id) {
      if (id !== '') {
        for (let i = 0; i < this.formData.length; i++) {
          if (this.formData[i].value === id) {
            this.title = this.formData[i].title
            this.order_price = this.formData[i].price
            this.ruleForm.refund_price = this.formData[i].price
            this.show_title = true
          }
        }
      }
    }
  },
}
</script>

<style>

</style>
