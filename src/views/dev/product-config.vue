<template>
  <el-dialog :visible.sync="visible" @close="onClose" title="编辑" width="500px" footer-hide :styles="{top: '20px'}">
    <el-form ref="form" label-width="80px" v-loading="loading">
      <div><h2 style="padding-top: 1px;padding-bottom: 20px;padding-left: 5px;">采集失败配置</h2></div>
<!--      <el-form-item label="选择">-->
<!--        <el-radio-group v-model="formData.retry">-->
<!--          <el-radio label=0>下一次重试</el-radio>-->
<!--          <el-radio label=1>不重试</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
      <span style="color: #999;">如果采集失败几次之后，就不再采集这个信息</span>
      <el-form-item label="重试几次">
        <el-input name="day" v-model="formData.count" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                  maxlength="2" oninput="if(value>100)value=100"></el-input>
      </el-form-item>
      <div><h2 style="padding-top: 1px;padding-bottom: 20px;padding-left: 5px;">销量采集配置</h2></div>
      <span style="color: #999;">如果几天销量都没有增加，就相隔几天之后再采集</span>
      <el-form-item label="相隔几天">
        <el-input name="day" v-model="formData.day" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                  maxlength="2" oninput="if(value>30)value=30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { cloneDeep } from 'lodash'
import { getConfig, addConfig } from '@/api/dev/productConfig'

export default {
  name: 'productConfig',
  data () {
    return {
      id: 0,
      goods_id: 0,
      visible: false,
      loading: false,
      roleList: [],
      formData: {
      },
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    open () {
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
        getConfig(),
      ]).then(values => {
        if (values[0].length !== 0) {
          this.formData = values[0]
        }

      }).finally(() => {
        this.loading = false
      })
    },
    submit () {
      addConfig(this.formData)
      this.visible = false
    },
  },
}
</script>

<style scoped>

</style>
