<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading" @click="refresh" icon="el-icon-refresh">刷新</el-button>
    </div>
    <vxe-grid
      ref="table"
      row-id="id"
      :height="targetHeight"
      :loading="loading"
      :columns="columns"
      :data="data"
      :pager-config="tablePage"
      @page-change="handlePageChange"
    >
      <template v-slot:mark="{row}">
        <nx-tag
          :mapping-values="[0, 1]"
          :color="['#e71588', '#1ce726']"
          :value="row.read_mark"
          :label="row.read_mark_desc"
        >
        </nx-tag>
      </template>
      <template v-slot:ebay_name="{ row }">
        <span class="text-shenglue">{{ row.ebay_as_name }}----{{ row.ebay_name }}</span>
      </template>
      <template v-slot:action="{ row }">
        <el-button type="primary" size="mini" @click="tableEdit(row.message_id)">查看&回复</el-button>
      </template>
    </vxe-grid>
    <ebayWaiterChat ref="edit" @on-submit="refresh"></ebayWaiterChat>
  </d2-container>
</template>

<script>
import ebayWaiterChat from './ebay-waiter-chat'
import pageOption from '@/mixin/page-option'
import { getMessages } from '@api/ebay/ebayWaiter'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'ebay-waiter-index',
  components: {
    ebayWaiterChat,
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { title: '店铺名', field: 'ebay_name', width: 120, fixed: 'left', slots: { default: 'ebay_name' } },
        { title: '标题', field: 'title', width: 500, fixed: 'left' },
        { title: '问题类型', field: 'question_type', width: 150 },
        { title: '标记', field: 'read_mark_desc', width: 100, align: 'center', slots: { default: 'mark' }, filterMultiple: false },
        { title: '发生时间', field: 'creation_date', width: 135, formatter: 'unixTime' },
        { title: '操作', minWidth: 100, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        status: 0,
      },
    }
  },
  methods: {
    init () {
      this.refresh()
    },
    refresh () {
      this.loading = true
      getMessages(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
        this.data = data
        this.tablePage.total = count
      }).finally(() => {
        this.loading = false
      })
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.refresh()
    },
    searchSubmit () {
      this.page.current = 1
      this.refresh()
    },
    tableEdit (message_id = 0) {
      this.$refs.edit.open(message_id)
    },
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
  }
}
</script>

<style scoped>

</style>
