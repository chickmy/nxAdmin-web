<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading" @click="refresh" icon="el-icon-refresh">刷新</el-button>
    </div>
    <div class="tab-content fliter-box">
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="客户">
              <el-select v-model="where.client_id" filterable placeholder="请选择操作人">
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
      <template v-slot:zx="{ row }">
        <span>{{ row.one_price_sum_count }} / {{ row.client_info === null ? 0 : row.client_info.zx.claim }} / {{ row.client_info === null ? 0 : row.client_info.zx.date }}</span>
      </template>
      <template v-slot:pm="{ row }">
        <span>{{ row.auction_sum_count }} / {{ row.client_info === null ? 0 : row.client_info.pm.claim }} / {{ row.client_info === null ? 0 : row.client_info.pm.date }}</span>
      </template>
      <template v-slot:xs="{ row }">
        <span>{{ -1 }} / {{ row.client_info === null ? 0 : row.client_info.xs.claim }} / {{ row.client_info === null ? 0 : row.client_info.xs.date }}</span>
      </template>
<!--      <template v-slot:js="{ row }">-->
<!--        <span>{{ -1 }} / {{ row.client_info === null ? 0 : row.client_info.js.claim }} / {{ row.client_info === null ? 0 : row.client_info.js.date }}</span>-->
<!--      </template>-->
      <template v-slot:ed="{ row }">
        <span>{{ -1 }} / {{ row.client_info === null ? 0 : row.client_info.ed.claim }} / {{ row.client_info === null ? 0 : row.client_info.ed.date }}</span>
      </template>
      <template v-slot:shp="{ row }">
        <span>{{ row.client_info === null ? 0 : row.client_info.shp.now }} / {{ row.client_info === null ? 0 : row.client_info.shp.claim }} / {{ row.client_info === null ? 0 : row.client_info.shp.date }}</span>
      </template>
      <template v-slot:hp="{ row }">
        <span>{{ row.positive }} / {{ row.client_info === null ? 0 : row.client_info.hp.claim }} / {{ row.client_info === null ? 0 : row.client_info.hp.date }}</span>
      </template>
      <template v-slot:zscd="{ row }">
        <span>{{ row.order_count }} / {{ row.client_info === null ? 0 : row.client_info.zscd.claim }} / {{ row.client_info === null ? 0 : row.client_info.zscd.date }}</span>
      </template>
      <template v-slot:sd="{ row }">
        <span>{{ row.client_info === null ? 0 : row.client_info.sd.now }} / {{ row.client_info === null ? 0 : row.client_info.sd.claim }} / {{ row.client_info === null ? 0 : row.client_info.sd.date }}</span>
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
      </template>
    </vxe-grid>
    <InfoEdit ref="edit" @on-submit="refresh"></InfoEdit>
  </d2-container>
</template>

<script>
import InfoEdit from './client-edit'
import pageOption from '@/mixin/page-option'
import { getClientEbayAccounts } from '@api/client/index'
import ContainerResize from '@/mixin/container-resize'
import { getAdminUserSelect } from '@/api/ebay/ebayAccount'

export default {
  name: 'client-index',
  components: {
    InfoEdit,
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { type: 'checkbox', width: '60', fixed: 'left' },
        // { title: 'id', field: 'id', width: 80, fixed: 'left' },
        // { title: '店铺名称', field: 'name', width: 150, fixed: 'left' },
        { title: '昵称', field: 'as_name', width: 150 },
        { title: '在线链接数/要求链接数/要求完成时间', width: 160, slots: { default: 'zx' } },
        { title: '拍卖链接数/要求链接数/要求完成时间', width: 160, slots: { default: 'pm' } },
        { title: '销售件数/要求件数/要求完成时间', width: 160, slots: { default: 'xs' } },
        // { title: '账户件数/要求件数/要求完成时间', width: 160, slots: { default: 'js' } },
        { title: '账户额度/要求额度/要求完成时间', width: 160, slots: { default: 'ed' } },
        { title: '刷好评数/要求刷好评数/要求完成时间', width: 160, slots: { default: 'shp' } }, // 需要手填
        { title: '好评数/要求好评数/要求完成时间', width: 160, slots: { default: 'hp' } }, // 需要手填
        { title: '真实出单数/要求真实出单数/要求完成时间', width: 160, slots: { default: 'zscd' } }, // 需要手填
        { title: '刷单数/要求刷单数/要求完成时间', width: 160, slots: { default: 'sd' } }, // 需要手填
        // { title: '好评/中评/差评', width: 160, slots: { default: 'feedback' } },
        { title: '账号状态',
          field: 'status_desc',
          width: 120,
          align: 'center',
          slots: { default: 'status' },
          filterMultiple: false
        },
        // { title: '创建时间', field: 'create_time', width: 135, formatter: 'unixTime' },
        // { title: '更新时间', field: 'update_time', width: 135, formatter: 'unixTime' },
        { title: '操作', minWidth: 150, fixed: 'right', slots: { default: 'action' } },
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
      getAdminUserSelect().then(values => {
        this.options = values
      })
      this.refresh()
    },
    refresh () {
      this.loading = true
      getClientEbayAccounts(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    search () {
      this.refresh()
    },
    clientSelect () {
      this.$refs.select.open()
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
