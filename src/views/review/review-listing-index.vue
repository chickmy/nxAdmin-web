<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading" @click="refresh" icon="el-icon-refresh">刷新</el-button>
    </div>
    <vxe-grid
      ref="table"
      row-id="id"
      showOverflow="null"
      :height="targetHeight"
      :loading="loading"
      :columns="columns"
      :data="data"
      :pager-config="tablePage"
      @page-change="handlePageChange"
    >
      <template v-slot:action="{ row }">
        <el-button type="primary" size="mini" @click="tableEdit(row.box_id)">查看</el-button>
        <el-button type="success" size="mini" @click="Pass(row.id)">通过</el-button>
        <el-button type="danger" size="mini" @click="reject(row.id)">驳回</el-button>
      </template>
    </vxe-grid>
    <box-edit ref="edit" @on-submit="refresh"></box-edit>
  </d2-container>
</template>

<script>
import pageOption from '@/mixin/page-option'
import ContainerResize from '@/mixin/container-resize'
import { getReviewListingS, pass, reject } from '@/api/review/listing'
import BoxEdit from '@/views/collection/collection-box-edit'

export default {
  name: 'review-listing-index',
  components: {
    BoxEdit
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { type: 'checkbox', width: '60', fixed: 'left' },
        { title: 'id', field: 'id', width: 50, fixed: 'left' },
        { title: 'ebay账号', field: 'ebay_name', width: 90, fixed: 'left' },
        { title: 'ebay别名', field: 'ebay_as_name', width: 90, fixed: 'left' },
        { title: '提交申请人', field: 'user_name', width: 120, fixed: 'left' },
        { title: '创建时间', field: 'create_time', width: 130, formatter: 'unixTime' },
        { title: '客户', field: 'client_name', width: 135 },
        { title: '状态', field: 'status_desc', width: 135 },
        { title: '操作', minWidth: 210, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
      },
      locationList: [],
      locationId: '',
      dialogVisible: false,
      GmanualShip: {
        id: '',
        operator: '',
        tracking: '',
      }
    }
  },
  methods: {
    init () {
      this.refresh()
    },
    refresh () {
      this.loading = true
      getReviewListingS(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    tableEdit (id = 0) {
      this.$refs.edit.open(id)
    },
    Pass (id = 0) {
      this.loading = true
      pass(id).then(response => {
        this.$message({ message: '提交成功', type: 'success' })
        this.loading = false
        this.refresh()
      }).catch(() => {
      }).finally(() => {
        this.loading = false
      })
    },
    reject (id = 0) {
      this.$prompt('请输入理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        reject(id, value).then(response => {
          this.$message({ message: '提交成功', type: 'success' })
        }).catch(() => {
        }).finally(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
      this.refresh()
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
