<template>
  <el-dialog :visible.sync="visible" @close="onClose" title="编辑" width="450px" footer-hide :styles="{top: '20px'}">
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="商品地址" prop="url">
        <el-input name="url" v-model.trim="formData.url"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input name="remarks" v-model.trim="formData.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getEbayCollectionInfo, saveEbayCollectionInfo } from '@api/warehouse/collectionInfo'
import { cloneDeep } from 'lodash'

export default {
  name: 'goodsClassEdit',
  data () {
    return {
      id: 0,
      goods_id: 0,
      visible: false,
      loading: false,
      roleList: [],
      formData: {
        url: '',
        remarks: '',
        goods_id: 0,
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
    open (id = 0, goods_id = 0) {
      this.id = id
      this.formData.goods_id = goods_id
      console.log(goods_id)
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
        getEbayCollectionInfo(this.id),
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
          saveEbayCollectionInfo(this.id, data).then(() => {
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
