<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <div></div>
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
      <template v-slot:attention="{ row }">
        <span v-if="row.store_info">
          {{  row.store_info.attention }}
        </span>
      </template>
      <template v-slot:comment="{ row }">
        <span v-if="row.store_info">
          {{  row.store_info.comment }}
        </span>
      </template>
      <template v-slot:reg_date="{ row }">
        <span v-if="row.store_info">
          {{ row.store_info.reg_date }}
        </span>
      </template>
      <template v-slot:area="{ row }">
        <span v-if="row.store_info">
          {{ row.store_info.area }}
        </span>
      </template>
      <template v-slot:store_feedBack="{ row }">
        <span v-if="row.store_info">
          {{ row.store_info.store_feedBack }}
        </span>
      </template>
      <template v-slot:total_feedback="{ row }">
        <span v-if="row.store_feedback">
          {{ row.store_feedback.total_feedback }}
        </span>
      </template>
      <template v-slot:positive="{ row }">
        <span v-if="row.store_feedback">
          一日：{{ row.store_feedback.positive.one_month }}/半年：{{ row.store_feedback.positive.six_month }}/一年：{{ row.store_feedback.positive.twelve_month }}
        </span>
      </template>
      <template v-slot:neutral="{ row }">
        <span v-if="row.store_feedback">
          一日：{{ row.store_feedback.neutral.one_month }}/半年：{{ row.store_feedback.neutral.six_month }}/一年：{{ row.store_feedback.neutral.twelve_month }}
          </span>
      </template><template v-slot:negative="{ row }">
        <span v-if="row.store_feedback">
          一日：{{ row.store_feedback.negative.one_month  }}/半年：{{ row.store_feedback.negative.six_month }}/一年：{{ row.store_feedback.negative.twelve_month }}
        </span>
      </template>
      <template v-slot:action="{ row }">
        <el-button type="primary" size="mini" @click="viewProduct(row.store_name)">查看链接</el-button>
        <el-popconfirm title="确认删除?" @confirm="tableDelete(row.id)" style="margin-left: 10px">
          <el-button type="danger" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </vxe-grid>
  </d2-container>
</template>

<script>
import pageOption from '@/mixin/page-option'
import { getdevStoreInfos, deleteDevStoreInfos, } from '@api/dev/store'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'store-index',
  components: {
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { title: 'id', field: 'id', width: 80, fixed: 'left' },
        { title: '店铺名称', field: 'store_name', width: 80 },
        { title: '状态', field: 'status_desc', width: 80 },
        { title: '关注', width: 80, slots: { default: 'attention' } },
        { title: '评论', width: 80, slots: { default: 'comment' } },
        { title: '注册日期', width: 80, slots: { default: 'reg_date' } },
        { title: '地区', width: 80, slots: { default: 'area' } },
        { title: '星星评分', width: 80, slots: { default: 'store_feedBack' } },
        { title: '总体评分', width: 80, slots: { default: 'total_feedback' } },
        { title: '好评', width: 80, slots: { default: 'positive' } },
        { title: '中评', width: 80, slots: { default: 'neutral' } },
        { title: '差评', width: 80, slots: { default: 'negative' } },
        { title: '上架链接', field: 'sell_count', width: 80 },
        { title: '创建时间', field: 'create_time', width: 135, formatter: 'unixTime' },
        { title: '操作', minWidth: 200, fixed: 'right', slots: { default: 'action' } },
      ],

      data: [],
      where: {
      },
    }
  },
  methods: {
    init () {
      this.refresh()
    },
    refresh () {
      this.loading = true
      getdevStoreInfos(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
        let ret = []
        data.forEach(function (val) {
          ret.push({
            type: val.type,
            id: val.id,
            store_name: val.store_name,
            status_desc: val.status_desc,
            create_time: val.create_time,
            store_info: val.todayInfoEx[0] ? val.todayInfoEx[0].store_info : null,
            sell_count: val.todayInfoEx[0] ? val.todayInfoEx[0].sell_count : null,
            store_feedback: val.todayInfoEx[0] ? val.todayInfoEx[0].store_feedback : null,
          })
        })
        this.data = ret
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
    tableDelete (id) {
      deleteDevStoreInfos(id).finally(() => {
        this.refresh()
      })
    },
    viewProduct (store_name) {
      this.$router.push({ name: 'product-index', params: { store_name: store_name } })
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
