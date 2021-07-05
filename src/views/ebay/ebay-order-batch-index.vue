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
      <template v-slot:status="{row}">
        <nx-tag
          :mapping-values="[1, 2, 3]"
          :color="['#67C23A', '#409EFF', '#E6A23C']"
          :value="row.status"
          :label="row.status_desc"
        >
        </nx-tag>
      </template>
      <template v-slot:action="{ row }">
        <el-button size="mini" @click="tableView(row.batch_id)">查看</el-button>
        <el-button v-if="row.status === 2" type="primary" size="mini" @click="buy(row.batch_id)">购买</el-button>
        <el-button v-if="row.status === 7 || row.status === 8" type="success" @click="print_label(row.batch_id)">打印</el-button>
      </template>
    </vxe-grid>
<!--    <EbayCompleteOrderView ref="view" @on-submit="refresh"></EbayCompleteOrderView>-->
  </d2-container>
</template>

<script>
import pageOption from '@/mixin/page-option'
import { getBatchs, payBatch, printLabel, lunxun } from '@api/ebay/ebayOrderBatch'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'ebay-order-batch-index',
  components: {
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { type: 'checkbox', width: '60', fixed: 'left' },
        { title: 'id', field: 'id', width: 80, fixed: 'left' },
        { title: '批次ID', field: 'batch_id', width: 180 },
        { title: '备注', field: 'remarks', width: 135,},
        { title: '状态',
          field: 'status_desc',
          width: 120,
          align: 'center',
          slots: { default: 'status' },
          filterMultiple: false
        },
        { title: '创建时间', field: 'create_time', width: 135, formatter: 'unixTime' },
        { title: '更新时间', field: 'update_time', width: 135, formatter: 'unixTime' },
        { title: '操作', minWidth: 210, fixed: 'right', slots: { default: 'action' } },
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
      getBatchs(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    tableView (batch_id = 0) {
      this.$router.push({ name: 'ebay-complete-order', params: { batch_id: batch_id } })
    },
    buy (id) {
      this.loading = true
      payBatch(id).then(response => {
        // 开始轮寻状态
        this.pagelunxun(id)
      }).catch(() => {
        this.$message({ message: '操作失败', type: 'error' })
      }).finally(() => {
      })
    },
    print_label (id) {
      printLabel(id).then(response => {
        window.open(response, '_blank')
        this.$message({ message: '提交成功', type: 'success' })
        this.refresh()
      }).catch(() => {
        this.$message({ message: '操作失败', type: 'error' })
      })
    },
    pagelunxun (id) {
      setTimeout(() => {
        lunxun(id).then(response => {
          console.log(response)
          if (response === 1) {
            this.$message({ message: '提交成功', type: 'success' })
            this.refresh()
            this.loading = false
          } else {
            this.pagelunxun(id)
          }
        })
      }, 3000)
    }
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
