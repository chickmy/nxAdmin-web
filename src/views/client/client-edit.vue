<template>
    <el-dialog
      v-if="visible"
      :visible.sync="visible"
      @close="onClose"
      title="用户编辑"
      footer-hide :styles="{top: '20px'}">
      <el-form ref="form" :inline="true" :model="formData" label-width="80px" v-loading="loading" class="demo-form-inline">
        <div><h2 style="padding-top: 1px;padding-bottom: 10px;padding-left: 5px;">在线需求</h2></div>
        <el-form-item label="在线链接">
          <el-input v-model="formData.client_info.zx.claim" placeholder="要求链接数"></el-input>
        </el-form-item>
        <el-form-item label="完成日期">
          <div class="block">
            <el-date-picker
              v-model="formData.client_info.zx.date"
              type="date"
              value-format="yyyy-MM-dd">
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <div><h2 style="padding-top: 1px;padding-bottom: 10px;padding-left: 5px;">拍卖需求</h2></div>
        <el-form-item label="拍卖链接">
          <el-input v-model="formData.client_info.pm.claim" placeholder="要求链接数"></el-input>
        </el-form-item>
        <el-form-item label="完成日期">
          <div class="block">
            <el-date-picker
              v-model="formData.client_info.pm.date"
              type="date"
              value-format="yyyy-MM-dd">
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <div><h2 style="padding-top: 1px;padding-bottom: 10px;padding-left: 5px;">销售需求</h2></div>
        <el-form-item label="销售件数">
          <el-input v-model="formData.client_info.xs.claim" placeholder="要求件数"></el-input>
        </el-form-item>
        <el-form-item label="完成日期">
          <div class="block">
            <el-date-picker
              v-model="formData.client_info.xs.date"
              type="date"
              value-format="yyyy-MM-dd">
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <div><h2 style="padding-top: 1px;padding-bottom: 10px;padding-left: 5px;">件数需求</h2></div>
        <el-form-item v-if="formData.g_genre !== 3" label="现刷件数">
          <el-input v-model="formData.client_info.js.now" placeholder="现在件数"></el-input>
        </el-form-item>
        <el-form-item label="账户件数">
          <el-input v-model="formData.client_info.js.claim" placeholder="要求件数"></el-input>
        </el-form-item>
        <el-form-item label="完成日期">
          <div class="block">
            <el-date-picker
              v-model="formData.client_info.js.date"
              type="date"
              value-format="yyyy-MM-dd">
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <div><h2 style="padding-top: 1px;padding-bottom: 10px;padding-left: 5px;">额度需求</h2></div>
        <el-form-item v-if="formData.g_genre !== 3" label="现刷额度">
          <el-input v-model="formData.client_info.ed.now" placeholder="现在额度"></el-input>
        </el-form-item>
        <el-form-item label="账户额度">
          <el-input v-model="formData.client_info.ed.claim" placeholder="要求额度"></el-input>
        </el-form-item>
        <el-form-item label="完成日期">
          <div class="block">
            <el-date-picker
              v-model="formData.client_info.ed.date"
              type="date"
              value-format="yyyy-MM-dd">
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <div><h2 style="padding-top: 1px;padding-bottom: 10px;padding-left: 5px;">刷好评需求</h2></div>
        <el-form-item v-if="formData.g_genre !== 3" label="现刷好评">
          <el-input v-model="formData.client_info.shp.now" placeholder="现刷好评"></el-input>
        </el-form-item>
        <el-form-item label="刷好评数">
          <el-input v-model="formData.client_info.shp.claim" placeholder="要求刷好评数"></el-input>
        </el-form-item>
        <el-form-item label="完成日期">
          <div class="block">
            <el-date-picker
              v-model="formData.client_info.shp.date"
              type="date"
              value-format="yyyy-MM-dd">
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <div><h2 style="padding-top: 1px;padding-bottom: 10px;padding-left: 5px;">好评需求</h2></div>
        <el-form-item label="好评数">
          <el-input v-model="formData.client_info.hp.claim" placeholder="要求好评数"></el-input>
        </el-form-item>
        <el-form-item label="完成日期">
          <div class="block">
            <el-date-picker
              v-model="formData.client_info.hp.date"
              type="date"
              value-format="yyyy-MM-dd">
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <div><h2 style="padding-top: 1px;padding-bottom: 10px;padding-left: 5px;">出单需求</h2></div>
        <el-form-item label="真实出单">
          <el-input v-model="formData.client_info.zscd.claim" placeholder="要求真实出单数"></el-input>
        </el-form-item>
        <el-form-item label="完成日期">
          <div class="block">
            <el-date-picker
              v-model="formData.client_info.zscd.date"
              type="date"
              value-format="yyyy-MM-dd">
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <div><h2 style="padding-top: 1px;padding-bottom: 10px;padding-left: 5px;">刷单需求</h2></div>
        <el-form-item v-if="formData.g_genre !== 3" label="现刷单数">
          <el-input v-model="formData.client_info.sd.now" placeholder="现刷单件数"></el-input>
        </el-form-item>
        <el-form-item label="刷单件数">
          <el-input v-model="formData.client_info.sd.claim" placeholder="要求刷单件数"></el-input>
        </el-form-item>
        <el-form-item label="完成日期">
          <div class="block">
            <el-date-picker
              v-model="formData.client_info.sd.date"
              type="date"
              value-format="yyyy-MM-dd">
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import { getClientEbayAccount, saveClientEbayAccount } from '@api/client/index'
import { cloneDeep } from 'lodash'

export default {
  name: 'ClientEdit',
  data () {
    return {
      id: 0,
      visible: false,
      loading: false,
      formData: {
        client_info: {
          zx: { claim: '', date: '' },
          pm: { claim: '', date: '' },
          xs: { claim: '', date: '' },
          js: { now: '', claim: '', date: '' },
          ed: { claim: '', date: '' },
          shp: { now: '', claim: '', date: '' },
          hp: { claim: '', date: '' },
          zscd: { claim: '', date: '' },
          sd: { now: '', claim: '', date: '' },
        },
      },

    }
  },
  methods: {
    open (id = 0) {
      this.id = id
      this.visible = true
      this.formData.client_info.zx.claim = ''
      this.formData.client_info.zx.date = ''
      this.formData.client_info.pm.claim = ''
      this.formData.client_info.pm.date = ''
      this.formData.client_info.xs.claim = ''
      this.formData.client_info.xs.date = ''
      this.formData.client_info.js.now = ''
      this.formData.client_info.js.claim = ''
      this.formData.client_info.js.date = ''
      this.formData.client_info.ed.now = ''
      this.formData.client_info.ed.claim = ''
      this.formData.client_info.ed.date = ''
      this.formData.client_info.shp.now = ''
      this.formData.client_info.shp.claim = ''
      this.formData.client_info.shp.date = ''
      this.formData.client_info.hp.claim = ''
      this.formData.client_info.hp.date = ''
      this.formData.client_info.zscd.claim = ''
      this.formData.client_info.zscd.date = ''
      this.formData.client_info.sd.now = ''
      this.formData.client_info.sd.claim = ''
      this.formData.client_info.sd.date = ''
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
        getClientEbayAccount(this.id),
      ]).then(values => {
        this.$refs.form.resetFields()
        if (values[0]) {
          this.formData.g_genre = values[0].g_genre
          this.formData.client_info.zx.claim = values[0].client_info.zx.claim
          this.formData.client_info.zx.date = values[0].client_info.zx.date
          this.formData.client_info.pm.claim = values[0].client_info.pm.claim
          this.formData.client_info.pm.date = values[0].client_info.pm.date
          this.formData.client_info.xs.claim = values[0].client_info.xs.claim
          this.formData.client_info.xs.date = values[0].client_info.xs.date
          this.formData.client_info.js.now = values[0].client_info.js.now
          this.formData.client_info.js.claim = values[0].client_info.js.claim
          this.formData.client_info.js.date = values[0].client_info.js.date
          this.formData.client_info.ed.now = values[0].client_info.ed.now
          this.formData.client_info.ed.claim = values[0].client_info.ed.claim
          this.formData.client_info.ed.date = values[0].client_info.ed.date
          this.formData.client_info.shp.now = values[0].client_info.shp.now
          this.formData.client_info.shp.claim = values[0].client_info.shp.claim
          this.formData.client_info.shp.date = values[0].client_info.shp.date
          this.formData.client_info.hp.claim = values[0].client_info.hp.claim
          this.formData.client_info.hp.date = values[0].client_info.hp.date
          this.formData.client_info.zscd.claim = values[0].client_info.zscd.claim
          this.formData.client_info.zscd.date = values[0].client_info.zscd.date
          this.formData.client_info.sd.now = values[0].client_info.sd.now
          this.formData.client_info.sd.claim = values[0].client_info.sd.claim
          this.formData.client_info.sd.date = values[0].client_info.sd.date
        }
      }).finally(() => {
        this.loading = false
      })
    },
    submit () {
      this.loading = true
      const data = cloneDeep(this.formData)
      console.log(data)
      saveClientEbayAccount(this.id, data).then(() => {
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
