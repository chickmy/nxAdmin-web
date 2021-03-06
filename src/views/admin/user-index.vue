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
      @filter-change="handleFilterChange"
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
        <el-button type="primary" size="mini" @click="tableEdit(row.id)">编辑</el-button>
        <el-popconfirm title="确认删除?" @confirm="tableDelete(row.id)" style="margin-left: 10px">
          <el-button type="danger" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </vxe-grid>
    <user-edit ref="edit" @on-submit="refresh"></user-edit>
  </d2-container>
</template>

<script>
import UserEdit from './user-edit'
import pageOption from '@/mixin/page-option'
import { deleteUser, getRolesSelect, getUsers } from '@api/admin/admin'
import { ADMIN_USERS_GENRE, toLabelValue } from '@/store/constant'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'admin-user-index',
  components: {
    UserEdit,
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { title: 'id', field: 'id', width: 80, fixed: 'left' },
        { title: '账号', field: 'username', width: 180, fixed: 'left' },
        { title: '昵称', field: 'nickname', width: 180 },
        { title: '类型',
          field: 'genre_desc',
          width: 120,
          align: 'center',
          slots: { default: 'genre' },
          filters: toLabelValue(ADMIN_USERS_GENRE),
          filterMultiple: false
        },
        { title: '角色', field: 'role_name', width: 120, filters: [], filterMultiple: false },
        // { title: '邮箱', field: 'email', width: 180 },
        { title: '状态', field: 'status_desc', width: 70, align: 'center' },
        { title: '创建时间', field: 'create_time', width: 135, formatter: 'unixTime' },
        { title: '更新时间', field: 'update_time', width: 135, formatter: 'unixTime' },
        { title: '登录时间', field: 'last_login_time', width: 135, formatter: 'unixTime' },
        { title: '登录IP', field: 'last_login_ip', width: 135 },
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
      getRolesSelect().then(data => {
        const table = this.$refs.table
        const column = table.getColumnByField('role_name')
        table.setFilter(column, data)
        table.updateData()
      })

      this.refresh()
    },
    refresh () {
      this.loading = true
      getUsers(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    handleFilterChange ({ property, values }) {
      switch (property) {
        case 'genre_desc':
          this.where.genre = values[0]
          break
        case 'role_name':
          this.where.role_id = values[0]
          break
        default:
          break
      }
      this.searchSubmit()
    },
    tableEdit (id = 0) {
      this.$refs.edit.open(id)
    },
    tableDelete (id) {
      deleteUser(id).finally(() => {
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
