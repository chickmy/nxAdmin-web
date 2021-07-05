<template>
    <el-dialog
      v-if="visible"
      :visible.sync="visible"
      @close="onClose"
      width="80%"
      :title="info[type]"
      footer-hide :styles="{top: '20px'}">
      <el-form ref="form" label-width="80px" v-loading="loading">
        <el-form-item :label="info[type]">
          <el-select v-model="user_id" @change="select" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template>
            <el-transfer
              filterable
              filter-placeholder="请输入ebay账号"
              :titles="['未分配', '已分配']"
              v-model="value"
              :data="data">
            </el-transfer>
          </template>
        </el-form-item>
        <el-form-item v-if="type === 0">
          <template>
            <el-checkbox v-model="checked">是否同步分配客服</el-checkbox>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import { getAdminUserSelect, saveClientSelect, getClientSelect } from '@api/ebay/ebayAccount'

export default {
  name: 'clientSelect',
  data () {
    return {
      id: 0,
      visible: false,
      loading: false,
      options: [],
      user_id: [],
      data: [],
      value: [],
      info: ['操作人', '客服', '客户'],
      type: 0,
      checked: false,
    }
  },
  methods: {
    open (type) {
      this.type = type
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
      getAdminUserSelect().then(values => {
        this.options = values
        this.loading = false
      })
    },
    select (id) {
      getClientSelect(id, this.type).then(values => {
        this.data = values.data
        this.value = values.value
      })
    },
    submit () {
      this.loading = true
      console.log(this.value)
      saveClientSelect(this.user_id, this.value, this.type, this.checked).then(() => {
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
.el-transfer-panel{
  width: 300px;
  height: 500px;
}

</style>
