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
      :sort-config="{remote: true}"
      @page-change="handlePageChange"
    >
      <template v-slot:sole_count="{ row }">
<!--        <span>+{{ sole_count(row) }}</span>-->
        开发中
      </template>
      <template v-slot:action="{ row }">
        <el-popover
          v-if="row.type === 1"
          placement="right"
          width="500"
          trigger="click">
          <vxe-grid
            ref="table1"
            :height="targetHeight"
            :loading="loading"
            :data="data1"
            :columns="columns1"
          >
          </vxe-grid>
          <el-button type="primary" size="mini" slot="reference" @click="getManyInfo(row.product_id)">查看属性数据</el-button>
        </el-popover>
        <el-popover
          v-if="row.type === 2"
          placement="right"
          width="500"
          trigger="click">
          <vxe-grid
            ref="table2"
            :height="targetHeight"
            :loading="loading"
            :data="data2"
            :columns="columns2"
          >
          </vxe-grid>
          <el-button type="primary" size="mini" slot="reference" @click="getauction(row.product_id)">查看数据</el-button>
        </el-popover>
        <el-popconfirm title="确认删除?" @confirm="tableDelete(row.id)" style="margin-left: 10px">
          <el-button type="danger" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </vxe-grid>
  </d2-container>
</template>

<script>
import pageOption from '@/mixin/page-option'
import { getExData, getProductExData, attention } from '@api/dev/product'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'product-history',
  components: {
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { title: 'id', field: 'id', width: 80 },
        { title: '标题', field: 'title', width: 80, showOverflow: true },
        { title: '店铺名称', field: 'store_name', width: 80, sortable: true },
        { title: '分类名称', field: 'class_name', width: 80 },
        { title: '类型', field: 'type_desc', width: 80 },
        { title: '价格', field: 'price', width: 80 },
        { title: '销售量', field: 'sold_count', width: 80 },
        { title: '销售增量', width: 80, slots: { default: 'sole_count' } },
        { title: '第一次出货价钱', field: 'sold_end.price', width: 80 },
        { title: '第一次出货时间', field: 'sold_end.date', width: 135, formatter: 'unixTime' },
        { title: '上货时间', field: 'added_time', width: 135, formatter: 'unixTime' },
        { title: '创建时间', field: 'create_time', width: 135, formatter: 'unixTime' },
        { title: '操作', minWidth: 300, slots: { default: 'action' } },
      ],
      columns1: [
        { title: '信息', width: '80%', field: 'size' },
        { title: '价钱', width: '15%', field: 'price' },
      ],
      columns2: [
        { title: '用户', width: '80%', field: 'user' },
        { title: '价钱', width: '15%', field: 'price' },
        { title: '时间', width: '80%', field: 'date', formatter: 'unixTime' },
      ],
      data: [],
      data1: [],
      data2: [],
      where: {},
      fileList: [],
      dialogVisible: false,
      pending: [],
      tmp_i: 0,
    }
  },
  methods: {
    init () {
      if (this.$route.params.product_id) {
        this.where.product_id = this.$route.params.product_id
        this.refresh()
      } else {
        this.$router.go(-1)
      }
    },
    refresh () {
      this.loading = true
      getExData(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    // tableDelete (id) {
    //   deleteDevProductInfos(id).finally(() => {
    //     this.refresh()
    //   })
    // },
    getManyInfo (id = 0) {
      // console.log(id)
      Promise.all([
        getProductExData(id)
      ]).then(values => {
        this.pending = values[0]
        this.handTableData()
        // console.log(this.pending)
      })
      // getProductExData(id).then(values => {
      //   this.handTableData()
      // })
    },
    getauction (id = 0) {
      Promise.all([
        getProductExData(id)
      ]).then(values => {
        this.data2 = values[0].auction_price
        // console.log(this.pending)
      })
    },
    handTableData () {
      // 整合表格数据
      let tbale_data = []
      // 拆解数据
      let arr = []
      let map = this.pending.size_map
      console.log(map)
      if (map === null) {
        return
      }
      // console.log(map)
      for (let i = 0; i < map.length; i++) {
        let tmp = []
        let key = map[i][Object.keys(map[i])]
        for (let ii = 0; ii < key.length; ii++) {
          tmp.push(key[ii].id)
        }
        arr.push(tmp)
      }
      // 数组排序
      let results = []
      let result = []
      doExchange(arr, 0)
      function doExchange (arr, index) {
        for (let i = 0; i < arr[index].length; i++) {
          result[index] = arr[index][i]
          if (index !== arr.length - 1) {
            doExchange(arr, index + 1)
          } else {
            results.push(result.join(','))
          }
        }
      }
      // 组合数据
      // console.log(results)
      for (let i = 0; i < results.length; i++) {
        let tmp_id = (results[i]).split(',')
        let size_str = ''
        for (let ii = 0; ii < tmp_id.length; ii++) {
          let key = map[ii][Object.keys(map[ii])]
          for (let iii = 0; iii < key.length; iii++) {
            // console.log([tmp_id[ii], key[iii].id])
            if (tmp_id[ii] === key[iii].id) {
              // console.log(key[iii].value)
              size_str += key[iii].value + '----'
            }
          }
        }
        size_str = size_str.substr(0, size_str.length - 4)
        let price = ''
        if (this.pending.sku_map.hasOwnProperty(results[i])) {
          price = this.pending.sku_map[results[i]].price
        }
        tbale_data.push({
          id: results[i],
          size: size_str,
          price: price,
        })
        // console.log(size_str)
      }
      // console.log(tbale_data)
      this.data1 = tbale_data
    },
    inattention (id) {
      attention(id).finally(() => {
        this.refresh()
      })
    },
    sole_count (row) {
      let i = row.sold_count - this.tmp_i
      this.tmp_i = row.sold_count
      return i
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
  }
}
</script>

<style type="text/css">
</style>
