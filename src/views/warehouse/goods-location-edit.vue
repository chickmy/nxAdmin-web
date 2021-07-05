<template>
  <el-dialog :visible.sync="visible" @close="onClose" title="位置编辑" width="450px" footer-hide :styles="{top: '20px'}">
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="位置名称" prop="remarks">
        <el-input name="remarks"  v-model="formData.remarks"></el-input>
      </el-form-item>
      <el-form-item label="发货人" prop="name">
        <el-input name="name"  v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="地址1" prop="street1">
        <el-input name="street1"  v-model="formData.street1"></el-input>
      </el-form-item>
      <el-form-item label="地址2" prop="street2">
        <el-input name="street2"  v-model="formData.street2"></el-input>
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input name="city"  v-model="formData.city"></el-input>
      </el-form-item>
      <el-form-item label="州" prop="state">
        <el-input name="state"  v-model="formData.state"></el-input>
      </el-form-item>
      <el-form-item label="邮政编码" prop="zip">
        <el-input name="zip"  v-model="formData.zip"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input name="phone"  v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getGoodsLocation, saveGoodsLocation } from '@api/warehouse/goodsLocation'
import { cloneDeep } from 'lodash'

export default {
  name: 'locationEdit',
  data () {
    return {
      id: 0,
      visible: false,
      loading: false,
      formData: {
        name: '',
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        remarks: '',
      },
      rules: {
        name: [
          { required: true },
        ],
        street1: [
          { required: true },
        ],
        city: [
          { required: true },
        ],
        state: [
          { required: true },
        ],
        zip: [
          { required: true },
        ],
        phone: [
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
        getGoodsLocation(this.id),
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
          saveGoodsLocation(this.id, data).then(() => {
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
