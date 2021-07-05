<template>
    <el-dialog
      :visible.sync="visible"
      @close="onClose"
      title="用户编辑"
      footer-hide :styles="{top: '20px'}">
      <el-form ref="form" label-width="80px" v-loading="loading">
        <template v-for="(item,index) in formData.orders">
          <el-form-item :key="index" label="标题">
            <p>{{ item.title }}</p>
          </el-form-item>
          <el-form-item :key="'1'+index" label="sku" prop="as_name">
            <el-input name="as_name" v-model="formData.orders[index].sku">{{ item.sku }}</el-input>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import { getEbayOreder, saveEdit } from '@api/ebay/ebayOrder'
import { cloneDeep } from 'lodash'

export default {
  name: 'ebay-order-edit',
  data () {
    return {
      id: 0,
      visible: false,
      loading: false,
      formData: [],
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
        getEbayOreder(this.id),
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
      saveEdit(this.id, data).then(() => {
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
