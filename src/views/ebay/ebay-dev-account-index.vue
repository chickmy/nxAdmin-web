<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading" @click="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button type="primary" @click="tableEdit()" icon="el-icon-plus">添加</el-button>
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
      <template v-slot:action="{ row }">
        <el-button type="success" size="mini" @click="addEbayAccount(row.id)">添加EBAY账号</el-button>
        <el-button type="primary" size="mini" @click="tableEdit(row.id)">编辑</el-button>
        <el-popconfirm title="确认删除?" @confirm="tableDelete(row.id)" style="margin-left: 10px">
          <el-button type="danger" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </vxe-grid>
    <ebayDevAccountEdit ref="edit" @on-submit="refresh"></ebayDevAccountEdit>
  </d2-container>
</template>

<script>
import ebayDevAccountEdit from './ebay-dev-account-edit'
import pageOption from '@/mixin/page-option'
import { getEbayDevAccounts, deleteebayDevAccount, createAuthUrl } from '@api/ebay/ebayDevAccount'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'ebay-dev-account-index',
  components: {
    ebayDevAccountEdit,
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { title: 'id', field: 'id', width: 80, fixed: 'left' },
        { title: '备注', field: 'remarks', width: 100, fixed: 'left' },
        { title: 'app_id', field: 'app_id', width: 70 },
        { title: 'dev_id', field: 'dev_id', width: 70 },
        { title: 'cert_id', field: 'cert_id', width: 70 },
        { title: 'ru_name', field: 'ru_name', width: 70 },
        { title: '创建时间', field: 'create_time', width: 135, formatter: 'unixTime' },
        { title: '更新时间', field: 'update_time', width: 135, formatter: 'unixTime' },
        { title: '操作', minWidth: 200, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        genre: 0,
        role_id: 0,
      },
    }
  },
  methods: {
    init () {
      this.refresh()
    },
    refresh () {
      this.loading = true
      getEbayDevAccounts(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    addEbayAccount (id = 0) {
      createAuthUrl(id).then((url) => {
        console.log(url)
        window.open(url, '_blank')
      }).finally(() => {
        this.loading = false
      })
    },
    tableEdit (id = 0) {
      this.$refs.edit.open(id)
    },
    tableDelete (id) {
      deleteebayDevAccount(id).finally(() => {
        this.refresh()
      })
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
