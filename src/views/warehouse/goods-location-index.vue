<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <div></div>
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
      <template v-slot:img="{ row }">
        <img v-if="row.dialogImageUrl" :src="row.dialogImageUrl" style="width: 80px;height: 80px">
        <span v-else>无</span>
      </template>
      <template v-slot:action="{ row }">
        <el-button type="primary" size="mini" @click="tableEdit(row.id)">编辑</el-button>
        <el-popconfirm title="确认删除?" @confirm="tableDelete(row.id)" style="margin-left: 10px">
          <el-button type="danger" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </vxe-grid>
    <LocationEdit ref="edit" @on-submit="refresh"></LocationEdit>
  </d2-container>
</template>

<script>
import LocationEdit from './goods-location-edit'
import pageOption from '@/mixin/page-option'
import { getGoodsLocations, deleteGoodsLocation } from '@api/warehouse/goodsLocation'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'goods-location-index',
  components: {
    LocationEdit,
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { title: 'id', field: 'id', width: 80, fixed: 'left' },
        { title: '位置名称', field: 'remarks', width: 80 },
        { title: '发货人', field: 'name', width: 80 },
        { title: '地址1', field: 'street1', width: 80 },
        { title: '地址2', field: 'street2', width: 80 },
        { title: '城市', field: 'city', width: 80 },
        { title: '州', field: 'state', width: 80 },
        { title: '邮政编码', field: 'zip', width: 80 },
        { title: '手机', field: 'phone', width: 80 },
        { title: '操作', minWidth: 200, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        name: ''
      },
    }
  },
  methods: {
    init () {
      this.refresh()
    },
    refresh () {
      this.loading = true
      getGoodsLocations(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    tableDelete (id) {
      deleteGoodsLocation(id).finally(() => {
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
