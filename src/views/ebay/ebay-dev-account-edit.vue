<template>
  <el-dialog :visible.sync="visible" @close="onClose" title="添加/编辑" width="450px" footer-hide :styles="{top: '20px'}">
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="app_id" prop="app_id">
        <el-input name="app_id"  v-model="formData.app_id"></el-input>
      </el-form-item>
      <el-form-item label="dev_id" prop="dev_id">
        <el-input name="dev_id"  v-model="formData.dev_id"></el-input>
      </el-form-item>
      <el-form-item label="cert_id" prop="cert_id">
        <el-input name="cert_id"  v-model="formData.cert_id"></el-input>
      </el-form-item>
      <el-form-item label="ru_name" prop="ru_name">
        <el-input name="ru_name"  v-model="formData.ru_name"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input name="remarks"  v-model="formData.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getEbayDevAccount, saveEbayDevAccount } from '@api/ebay/ebayDevAccount'
import { cloneDeep } from 'lodash'

export default {
  name: 'ebayDevAccountEdit',
  data () {
    return {
      id: 0,
      visible: false,
      loading: false,
      formData: {
        app_id: '',
        dev_id: '',
        cert_id: '',
        ru_name: '',
        remarks: '',
      },
      rules: {
        app_id: [
          { required: true },
        ],
        dev_id: [
          { required: true },
        ],
        cert_id: [
          { required: true },
        ],
        ru_name: [
          { required: true },
        ],
        remarks: [
          { required: true },
        ],
      },
    }
  },
  computed: {
  },
  watch: {
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
      this.file_list = []
      Promise.all([
        getEbayDevAccount(this.id),
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
      this.$refs.form.validate(valid => {
        console.log(valid)
        if (valid) {
          this.loading = true
          const data = cloneDeep(this.formData)
          saveEbayDevAccount(this.id, data).then(() => {
            this.visible = false
          }).finally(() => {
            this.loading = false
            this.$emit('on-submit')
          })
        } else {
          this.$message.error('请输入正确的表单')
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
