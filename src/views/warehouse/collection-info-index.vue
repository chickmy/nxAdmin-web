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
      <template v-slot:action="{ row }">
        <el-button type="primary" size="mini" @click="tableEdit(row.id)">编辑</el-button>
        <el-popconfirm title="确认删除?" @confirm="tableDelete(row.id)" style="margin-left: 10px">
          <el-button type="danger" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </vxe-grid>
    <collectionInfoEdit ref="edit" @on-submit="refresh"></collectionInfoEdit>
  </d2-container>
</template>

<script>
import collectionInfoEdit from './collecion-info-edit'
import pageOption from '@/mixin/page-option'
import { getEbayCollectionInfos, deleteEbayCollectionInfos } from '@api/warehouse/collectionInfo'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'collection-info-index',
  components: {
    collectionInfoEdit,
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { title: 'id', field: 'id', width: 80, fixed: 'left' },
        { title: '分类名称', field: 'url', width: 80 },
        { title: '操作', minWidth: 200, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        goods_id: ''
      },
    }
  },
  methods: {
    init () {
      if (!this.$route.params.id) {
        this.$router.go(-1)
        return
      }
      this.id = this.$route.params.id
      console.log(this.id)
      this.where.goods_id = this.id
      this.refresh()
    },
    refresh () {
      this.loading = true
      getEbayCollectionInfos(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
      this.$refs.edit.open(id, this.id)
    },
    tableDelete (id) {
      deleteEbayCollectionInfos(id).finally(() => {
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
