<template>
  <el-dialog :visible.sync="visible" @close="onClose" title="编辑" width="500px" footer-hide :styles="{top: '20px'}">
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="商品ID" prop="commodity_id">
<!--        <el-input-->
<!--          type="textarea"-->
<!--          name="commodity_id"-->
<!--          :autosize="{ minRows: 2, maxRows: 4}"-->
<!--          placeholder="多个链接请换行;-->
<!--      例如：-->
<!--      353179787044-->
<!--      184647886078"-->
<!--          v-model.trim="formData.commodity_id">-->
<!--        </el-input>-->
        <el-input name="commodity_id" v-model.trim="formData.commodity_id"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getDevProductInfo, saveDevProductInfo } from '@api/dev/product'
import { cloneDeep } from 'lodash'

export default {
  name: 'productEdit',
  data () {
    return {
      id: 0,
      goods_id: 0,
      visible: false,
      loading: false,
      roleList: [],
      formData: {
        commodity_id: '',
      },
      rules: {
        url: [
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
        getDevProductInfo(this.id),
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
        if (valid) {
          this.loading = true
          const data = cloneDeep(this.formData)
          saveDevProductInfo(this.id, data).then(() => {
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
