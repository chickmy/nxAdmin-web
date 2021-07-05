<template>
    <el-dialog
      :visible.sync="visible"
      @close="onClose"
      title="用户编辑"
      footer-hide :styles="{top: '20px'}">
      <el-form ref="form" :model="formData" label-width="80px" v-loading="loading">
        <el-form-item label="昵称" prop="as_name">
          <el-input name="as_name"  v-model.trim="formData.as_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import { getEbayAccount, saveEbayAccount } from '@api/ebay/ebayAccount'
import { cloneDeep } from 'lodash'

export default {
  name: 'SkuAccountEdit',
  data () {
    return {
      id: 0,
      visible: false,
      loading: false,
      formData: {
        sku: '',
      },
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
        getEbayAccount(this.id),
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
      const data = cloneDeep(this.formData)
      saveEbayAccount(this.id, data).then(() => {
        this.visible = false
      }).finally(() => {
        this.loading = false
        this.$emit('on-submit')
      })
    },
  },
}
</script>

<style>

</style>
