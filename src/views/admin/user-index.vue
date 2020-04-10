<template>
  <d2-container>
    <div style="margin-bottom: 10px">
      <i-button type="primary" icon="md-refresh" :loading="loading" @click="refresh">刷新</i-button>
      <user-edit @on-submit="refresh">
        <i-button type="primary" icon="md-add">添加</i-button>
      </user-edit>
    </div>
    <i-page-table :columns="columns" :data="data" :loading="loading" row-key="id" border
                  v-model="page" @page-change="refresh"
    >
      <template v-slot:formatTime="{ row, column }">
        {{ dayjs.unix(row[column.key]).format('YYYY-MM-DD HH:mm') }}
      </template>
      <template v-slot:action="{ row }">
        <user-edit :id="row.id" @on-submit="refresh">
          <i-button type="primary" size="small">编辑</i-button>
        </user-edit>
        <poptip confirm transfer placement="top-end" title="确认删除?" @on-ok="tableDelete(row.id)">
          <i-button type="error" size="small">删除</i-button>
        </poptip>
      </template>
    </i-page-table>
  </d2-container>
</template>

<script>
  import iButton from '@ivu/button'
  import Poptip from '@ivu/poptip'
  import iPageTable from '@/components/common/i-page-table'
  import UserEdit from './user-edit'
  import pageOption from '@/mixin/page-option'
  import { deleteUser, getRolesSelect, getUsers } from '@api/admin/admin'
  import dayjs from 'dayjs'
  import { ADMIN_USERS_GENRE, toLabelValue } from '@/store/constant'

  export default {
    name: 'UserIndex',
    components: {
      iButton,
      iPageTable,
      Poptip,
      UserEdit
    },
    mixins: [ pageOption ],
    data () {
      return {
        dayjs,
        loading: false,
        columns: [
          { title: 'id', key: 'id', width: 80 },
          { title: '类型',
            key: 'genre_desc',
            width: 120,
            filters: toLabelValue(ADMIN_USERS_GENRE),
            filterMultiple: false,
            filterRemote: this.filterRemote,
          },
          { title: '角色',
            key: 'role_name',
            width: 120,
            filters: getRolesSelect(),
            filterMultiple: false,
            filterRemote: this.filterRemote,
          },
          { title: '账号', key: 'username' },
          { title: '昵称', key: 'nickname' },
          { title: '邮箱', key: 'email' },
          { title: '状态', key: 'status_desc', width: 70 },
          { title: '创建时间', key: 'create_time', slot: 'formatTime', width: 135 },
          { title: '更新时间', key: 'update_time', slot: 'formatTime', width: 135 },
          { title: '操作', slot: 'action', width: 200 },
        ],
        data: [],
        where: {
          genre: 0,
          role_id: 0,
        },
      }
    },
    methods: {
      refresh () {
        this.loading = true
        getUsers(this.page.current, this.page.size, this.where).then(({ data, count }) => {
          this.data = data
          this.page.total = count
        }).finally(() => {
          this.loading = false
        })
      },
      searchSubmit () {
        this.page.current = 1
        this.refresh()
      },
      filterRemote (values, key) {
        switch (key) {
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
      tableDelete (id) {
        deleteUser(id).finally(() => {
          this.refresh()
        })
      },
    },
    mounted () {
      this.refresh()
    },
    comments: {
    },
    watch: {
    },
  }
</script>

<style scoped>

</style>