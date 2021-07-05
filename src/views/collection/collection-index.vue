<template>
  <d2-container ref="container">
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4}"
      placeholder="多个链接请换行;
      例如：
      https://www.ebay.com/itm/item/353179787044
      https://www.ebay.com/itm/item/184647886078"
      v-model="textarea2">
    </el-input>
    <div style="margin-top: 10px">
      <el-button type="primary" @click="addTask">开始采集</el-button>
    </div>
  </d2-container>
</template>

<script>
import { add } from '@/api/collection'
import { createShiping } from '@/api/ebay/ebayOrder'

export default {
  name: 'collection-index',
  data () {
    return {
      textarea2: ''
    }
  },
  methods: {
    addTask () {
      if (this.textarea2 !== '') {
        let re = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
        let str = this.textarea2
        str = str.split(/[\r\n]/)
        for (let i = 0; i < str.length; i++) {
          if (!re.test(str[i])) {
            this.$message.error('请输入正确的URL地址,错误为第' + i + '行')
            return
          }
        }
        add(str).then(response => {
          this.$message({ message: '提交成功', type: 'success' })
        }).catch(() => {
          // this.$message({ message: '操作失败', type: 'error' })
        }).finally(() => {
          this.loading = false
        })
        return
      }
      this.$message.error('请输入内容')
    }
  }
}
</script>

<style scoped>

</style>
