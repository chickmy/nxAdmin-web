<template>
  <el-dialog :visible.sync="visible" @close="onClose" title="用户编辑" width="450px" footer-hide :styles="{top: '20px'}">
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="分类名称" prop="name">
        <el-input name="sku"  v-model.trim="formData.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getGoodsClass, saveGoodsClass } from '@api/warehouse/goodsClass'
import { cloneDeep } from 'lodash'

export default {
  name: 'goodsClassEdit',
  data () {
    return {
      id: 0,
      visible: false,
      loading: false,
      roleList: [],
      formData: {
        name: '',
      },
      rules: {
        name: [
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
        getGoodsClass(this.id),
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
          console.log(data)
          saveGoodsClass(this.id, data).then(() => {
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
