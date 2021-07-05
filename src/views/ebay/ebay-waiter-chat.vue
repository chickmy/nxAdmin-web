<template>
  <el-dialog
    :visible.sync="visible"
    @close="onClose"
    title="聊天"
    width="605px"
    footer-hide :styles="{top: '20px'}">
    <JwChat
      :taleList="list"
      @enter="bindEnter"
      v-model="inputMsg"
      :toolConfig='tool'
      scrollType="noscroll"
    />
  </el-dialog>
</template>

<script>
import { getUserMsg, replyMsg } from '@/api/ebay/ebayWaiter'
import { formatUnix } from '@/libs/util.common'
// import { cloneDeep } from 'lodash'

export default {
  name: 'ebay-waiter-chat',

  data () {
    return {
      message_id: 0,
      visible: false,
      loading: false,
      inputMsg: '',
      list: [],
      tool: {
        show: [''], // 二级数组中放自定义名称
        showEmoji: false, // 是否显示表情图标
        // callback: this.toolEvent
      },
    }
  },
  methods: {
    open (message_id = 0) {
      this.message_id = message_id
      this.visible = true
      this.$nextTick(() => {
        this.loadData()
      })
    },
    onClose () {
      // this.$refs.form.resetFields()
    },
    loadData () {
      this.loading = true
      Promise.all([
        getUserMsg(this.message_id),
      ]).then(values => {
        if (values[0]) {
          for (let i = 0; i < values[0].length; i++) {
            if (values[0][i].date !== undefined) {
              values[0][i].date = formatUnix(values[0][i].date, 'YYYY-MM-DD HH:mm')
            }
          }
          this.list = values[0]
        }
      }).finally(() => {
        this.loading = false
      })
    },
    bindEnter () {
      console.log()
      replyMsg(this.message_id, this.inputMsg).then(values => {
        console.log(values)
        let tmp = this.list.pop()
        this.list.push({
          date: '刚刚',
          text: { text: this.inputMsg },
          mine: true,
          img: '/image/one.jpeg',
        }, tmp)
      })
    },
  },
}
</script>

<style scoped>

</style>
