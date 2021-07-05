<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading" @click="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button type="primary" @click="$refs.select.open(0)" icon="el-icon-thumb">分配操作人</el-button>
      <el-button type="primary" @click="$refs.select.open(1)" icon="el-icon-thumb">分配客服</el-button>
      <el-button type="primary" @click="$refs.select.open(2)" icon="el-icon-thumb">分配给用户</el-button>
    </div>
    <div class="tab-content fliter-box">
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="操作人">
              <el-select v-model="where.user_id" filterable placeholder="请选择操作人">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="账号状态">
              <el-select v-model="where.status" filterable placeholder="请选择状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="授权正常" value="0"></el-option>
                <el-option label="授权失败" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" style="margin-left: 25px;" @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
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
      <template v-slot:sum_count="{ row }">
        <span>{{ row.one_price_sum_count }} / {{ row.auction_sum_count }}</span>
      </template>
      <template v-slot:feedback="{ row }">
        <span>{{ row.positive }} / {{ row.neutral }} / {{ row.negative }}</span>
      </template>
      <template v-slot:status="{ row }">
        <nx-tag
          :mapping-values="[0, 1]"
          :color="['#67c23a', '#de1010']"
          :value="row.status"
          :label="row.status_desc"
        >
        </nx-tag>
      </template>
      <template v-slot:action="{ row }">
<!--        <el-button type="success" size="mini" @click="enStore(row.id, row.dev_id)">店铺管理</el-button>-->
        <el-button type="primary" size="mini" @click="tableEdit(row.id)">编辑</el-button>
        <el-popconfirm title="确认删除?" @confirm="tableDelete(row.id)" style="margin-left: 10px">
          <el-button type="danger" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </vxe-grid>
    <EbayAccountEdit ref="edit" @on-submit="refresh"></EbayAccountEdit>
    <ClientSelect ref="select" @on-submit="refresh"></ClientSelect>
  </d2-container>
</template>

<script>
import EbayAccountEdit from './ebay-account-edit'
import ClientSelect from './ebay-account-client-select'
import pageOption from '@/mixin/page-option'
import { getEbayAccounts, deleteEbayAccount, getAdminUserSelect } from '@api/ebay/ebayAccount'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'ebay-account-index',
  components: {
    EbayAccountEdit,
    ClientSelect,
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
        { title: '操作人', field: 'user_name', width: 80 },
        { title: '客服', field: 'waiter_name', width: 80 },
        { title: '客户', field: 'client_name', width: 80 },
        { title: '关联开发者ID', field: 'dev_id', width: 50, fixed: 'left' },
        { title: '店铺名称', field: 'name', width: 150, fixed: 'left' },
        { title: '昵称', field: 'as_name', width: 150 },
        { title: '在线链接数/拍卖链接数', width: 160, slots: { default: 'sum_count' } },
        { title: '好评/中评/差评', width: 160, slots: { default: 'feedback' } },
        { title: '账号状态',
          field: 'status_desc',
          width: 120,
          align: 'center',
          slots: { default: 'status' },
          filterMultiple: false
        },
        { title: '授权到期时间', field: 'end_time', width: 135, formatter: 'unixTime' },
        { title: '封号时间', field: 'ban_time', width: 135, formatter: 'unixTime' },
        { title: '创建时间', field: 'create_time', width: 135, formatter: 'unixTime' },
        { title: '更新时间', field: 'update_time', width: 135, formatter: 'unixTime' },
        { title: '操作', minWidth: 250, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        genre: 0,
        role_id: 0,
        user_id: '',
        status: '',
      },
      options: [],
      user_id: '',
    }
  },
  methods: {
    init () {
      this.refresh()
      getAdminUserSelect().then(values => {
        this.options = values
      })
    },
    refresh () {
      this.loading = true
      getEbayAccounts(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    enStore (id = 0, dev_id = 0) {
      this.$router.push({ name: 'ebay-store-index', params: { id: id, dev_id: dev_id } })
    },
    tableDelete (id) {
      deleteEbayAccount(id).finally(() => {
        this.refresh()
      })
    },
    selectUser (user_id) {
      this.$refs.select.open(0)
      // if (user_id === '') {
      //   this.$message('没有选择操作人')
      //   return
      // }
      // const ids = this.$refs.table.getCheckboxRecords()
      // if (ids.length === 0) {
      //   this.$message('没有选择要分配的店铺')
      //   return
      // }
      // const id_arr = []
      // ids.forEach(function (val) {
      //   id_arr.push(val.id)
      // })
      // ebayAccountSelectUser(user_id, id_arr).then(response => {
      //   this.$message({ message: '操作成功', type: 'success' })
      //   this.refresh()
      // }).catch(() => {
      //   this.$message({ message: '操作失败', type: 'error' })
      // })
    },
    search () {
      this.refresh()
    },
    clientSelect () {
      this.$refs.select.open(2)
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
.tab-content {
  background-color: #fff;
  padding: 16px 12px;
  position: relative;
  -webkit-box-shadow: 1px 0 10px 1px rgb(0 0 0 / 30%);
  box-shadow: 1px 0 5px 1px rgb(0 0 0 / 30%);
}
</style>
