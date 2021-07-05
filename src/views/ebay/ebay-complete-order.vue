<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
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
      <template v-slot:genre="{row}">
        <nx-tag
          :mapping-values="[1, 2, 3]"
          :color="['#67C23A', '#409EFF', '#E6A23C']"
          :value="row.genre"
          :label="row.genre_desc"
        >
        </nx-tag>
      </template>
      <template v-slot:action="{ row }">
        <el-button size="mini" @click="view(row.shipment_id)">查看</el-button>
        <el-button type="danger" @click="ret(row.shipment_id)">退款</el-button>
      </template>
    </vxe-grid>
  </d2-container>
</template>

<script>
import pageOption from '@/mixin/page-option'
import { viewlabel, getCompleteOrders, refund } from '@api/ebay/ebayOrderBatch'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'ebay-complete-order',
  mixins: [pageOption, ContainerResize],
  data () {
    return {
      loading: false,
      id: 0,
      visible: false,
      columns: [
        { type: 'checkbox', width: '60', fixed: 'left' },
        { title: 'id', field: 'id', width: 80, fixed: 'left' },
        { title: 'EBAY操作状态', field: 'ebay_status_desc', width: 110 },
        { title: '订单ID', field: 'order_id', width: 110 },
        { title: '追踪号', field: 'tracking_number', width: 165 },
        { title: '邮费', field: 'shipping_price', width: 50 },
        { title: '状态', field: 'status_desc', width: 50 },
        { title: 'sku编号', field: 'orderExs[0].sku', width: 120 },
        { title: 'name', field: 'orders[0].name', width: 135 },
        { title: '地址1', field: 'orders[0].Street1', width: 135 },
        { title: '地址2', field: 'orders[0].Street2', width: 135 },
        { title: '城市', field: 'orders[0].CityName', width: 135 },
        { title: '州', field: 'orders[0].StateOrProvince', width: 135 },
        { title: '国家', field: 'orders[0].Country', width: 135 },
        { title: '邮政编码', field: 'orders[0].PostalCode', width: 135 },
        { title: '电话', field: 'orders[0].Phone', width: 135 },
        { title: '电子邮箱', field: 'orders[0].Email', width: 135 },
        { title: '操作', minWidth: 210, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        batch_id: '',
      },
    }
  },
  methods: {
    init () {
      if (!this.$route.params.batch_id) {
        this.$router.go(-1)
        return
      }
      this.batch_id = this.$route.params.batch_id
      this.where.batch_id = this.batch_id
      this.refresh()
    },
    refresh () {
      this.loading = true
      getCompleteOrders(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    view (id) {
      viewlabel(id).then(response => {
        window.open(response, '_blank')
        this.$message({ message: '提交成功', type: 'success' })
      }).catch(() => {
        this.$message({ message: '操作失败', type: 'error' })
      })
    },
    ret (id) {
      refund(id).then(response => {
        this.$message({ message: '提交成功', type: 'success' })
        this.refresh()
      }).catch(() => {
        this.$message({ message: '操作失败', type: 'error' })
      })
    }
  },
  mounted () {
    this.init()
  },
}
</script>

<style scoped>
</style>
