<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading" @click="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button type="primary" @click="tableEdit()" icon="el-icon-plus">添加</el-button>
      <el-button type="primary" @click="dialogVisible=true;" icon="el-icon-plus">批量导入商品ID</el-button>
      <el-button type="primary" @click="$refs.config.open()" icon="el-icon-plus">商品采集配置</el-button>
    </div>
    <div class="tab-content fliter-box">
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="销量排序">
              <el-select v-model="where.sole_sort" filterable placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="昨天增量最高" value=1></el-option>
                <el-option label="上周增量最高" value=2></el-option>
                <el-option label="上月整量最高" value=3></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" style="margin-left: 25px;" @click="refresh">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <vxe-grid
      ref="table"
      row-id="id"
      showOverflow="null"
      :height="targetHeight"
      :loading="loading"
      :columns="columns"
      :data="data"
      :pager-config="tablePage"
      :sort-config="{remote: true}"
      :scroll-y="{ gt:-1 }"
      :cellStyle="{ height: '150px' }"
      @page-change="handlePageChange"
      @sort-change="sortMethod"
    >
      <template v-slot:product="{ row }">
        <div class="list-goods-item goods-item">
          <div class="list-goods-item-side">
            <span class="goods-img">
              <div>
                <img v-if="row.imgs" :src="row.imgs[0]" style="width: 100px;"/>
                <span v-else>无</span>
              </div>
            </span>
          </div>
          <div class="goods-info">
            <span class="item-title">{{ row.title }}</span>
            <div class="goods-item-info">
              <span>来源：</span>
              <a :href="'https://www.ebay.com/itm/' + row.commodity_id" target="_blank">{{ row.commodity_id }}</a>
            </div>
          </div>
        </div>
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
          <el-button type="primary" size="mini" slot="reference" @click="getManyInfo(row.id)">查看属性数据</el-button>
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
          <el-button type="primary" size="mini" slot="reference" @click="getauction(row.id)">查看数据</el-button>
        </el-popover>
        <el-button v-if="row.attention === 1" disabled type="primary" size="mini" style="margin-left: 10px">采集店铺</el-button>
        <el-button v-else-if="row.status !== 1" disabled type="primary" size="mini" style="margin-left: 10px">采集店铺</el-button>
        <el-button v-else type="primary" size="mini" @click="inattention(row.id)" style="margin-left: 10px">采集店铺</el-button>
        <el-button type="primary" size="mini" slot="reference" @click="listHistory(row.id)">历史数据</el-button>
        <el-popconfirm title="确认删除?" @confirm="tableDelete(row.id)" style="margin-left: 10px">
          <el-button type="danger" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </vxe-grid>
    <el-dialog
      title="批量上传"
      :visible.sync="dialogVisible"
      width="30%">
      <el-upload ref="upload"
                 accept=".xls,.xlsx"
                 action="#"
                 :auto-upload="false"
                 :multiple="false"
                 :file-list="fileList"
                 :before-upload="beforeUpload"
                 :http-request="uploadHttpRequest"
                 :on-remove="fileRemove"
                 :on-change="fileChange">
        <el-button size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">一次只能上传一个xls/xlsx文件，且不超过20M</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
<!--          <el-button type="info" size="small" @click="downloadMode">模 板</el-button>-->
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="small" @click="submitUpload">上 传</el-button>
        </span>
    </el-dialog>
    <productEdit ref="edit" @on-submit="refresh"></productEdit>
    <productConfig ref="config"></productConfig>
  </d2-container>
</template>

<script>
import productEdit from './product-edit'
import productConfig from './product-config'
import pageOption from '@/mixin/page-option'
import { getdevProductInfos, deleteDevProductInfos, importProductId, getProductExData, attention } from '@api/dev/product'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'product-index',
  components: {
    productEdit,
    productConfig
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { title: 'id', field: 'id', width: 80 },
        { title: '商品信息', width: '40%', slots: { default: 'product' } },
        // { title: '商品id', field: 'commodity_id', width: 80 },
        { title: '状态', field: 'status_desc', width: 80 },
        // { title: '标题', field: 'title', width: 80, showOverflow: true },
        { title: '好评', field: 'positive', width: 50 },
        { title: '中评', field: 'neutral', width: 50 },
        { title: '差评', field: 'negative', width: 50 },
        { title: '店铺名称', field: 'store_name', width: 80, sortable: true },
        { title: '分类名称', field: 'class_name', width: 80 },
        { title: '类型', field: 'type_desc', width: 80 },
        { title: '价格', field: 'price', width: 80 },
        { title: '销售量', field: 'sold_count', width: 80 },
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
      sortConfig: {

        remote: true
      },
      where: {
        sole_sort: ''
      },
      sort: [],
      fileList: [],
      dialogVisible: false,
      pending: [],
    }
  },
  methods: {
    init () {
      if (this.$route.params.store_name) {
        this.where.store_name = this.$route.params.store_name
      }
      this.refresh()
    },
    sortMethod (data, column, property, order, sortBy, sortList) {
      this.sort = data.property + ':' + data.order
      console.log(this.sort)
      this.refresh()
      // console.log(property, order)
    },
    refresh () {
      this.loading = true
      getdevProductInfos(this.tablePage.currentPage, this.tablePage.pageSize, this.where, this.sort).then(({ data, count }) => {
        let ret = []
        data.forEach(function (val) {
          ret.push({
            type: val.type,
            id: val.id,
            commodity_id: val.commodity_id,
            create_time: val.create_time,
            type_desc: val.type_desc,
            status_desc: val.status_desc,
            status: val.status,
            attention: val.attention,
            positive: val.positive,
            neutral: val.neutral,
            negative: val.negative,
            title: val.todayInfoEx[0] ? val.todayInfoEx[0].title : '',
            store_name: val.todayInfoEx[0] ? val.todayInfoEx[0].store_name : '',
            price: val.todayInfoEx[0] ? val.todayInfoEx[0].price : '',
            class_name: val.todayInfoEx[0] ? val.todayInfoEx[0].class_name : '',
            sold_count: val.todayInfoEx[0] ? val.todayInfoEx[0].sold_count : '',
            added_time: val.todayInfoEx[0] ? val.todayInfoEx[0].added_time : '',
            sold_end: val.todayInfoEx[0] ? val.todayInfoEx[0].sold_end : '',
            imgs: val.todayInfoEx[0] ? val.todayInfoEx[0].imgs : [],
          })
        })
        console.log(ret)
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
      deleteDevProductInfos(id).finally(() => {
        this.refresh()
      })
    },
    beforeUpload (file) {
      const isType = file.type === 'application/vnd.ms-excel'
      const isTypeComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const fileType = isType || isTypeComputer
      if (!fileType) {
        this.$message.error('上传文件只能是xls/xlsx格式！')
      }

      // 文件大小限制为20M
      const fileLimit = file.size / 1024 / 1024 < 20
      if (!fileLimit) {
        this.$message.error('上传文件大小不超过20M！')
      }
      return fileType && fileLimit
    },
    uploadHttpRequest (param) {
      const formData = new FormData() // FormData对象，添加参数只能通过append('key', value)的形式添加
      formData.append('file', param.file) // 添加文件对象
      // formData.append('uploadType', this.rulesType)
      console.log(this.importType)
      importProductId(formData)
        .then(res => {
          this.refresh()
          this.dialogVisible = false
          this.$message.success('成功')
        })
        .catch(err => {
          console.log('失败', err)
        })
    },
    // 点击上传：手动上传到服务器，此时会触发组件的http-request
    submitUpload () {
      this.$refs.upload.submit()
    },
    // 文件发生改变
    fileChange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 展示最后一次选择的文件
      }
    },
    // 移除选择的文件
    fileRemove (file, fileList) {
      if (fileList.length < 1) {
        this.uploadDisabled = true
      }
    },
    // 取消
    closeDialog () {
      this.$refs.upload.clearFiles() // 清除上传文件对象
      this.fileList = [] // 清空选择的文件列表
      this.dialogVisible = false
    },
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
    listHistory (id) {
      this.$router.push({ name: 'product-history', params: { product_id: id } })
    }
  },
  mounted () {

  },
  activated () {
    this.init()
  },
  beforeDestroy () {
  }
}
</script>

<style type="text/css">
.list-goods-item {
  display: flex;
  padding-top: 5px;
}
.goods-item .goods-img {
  width: 80px;
  height: 80px;
}
.list-goods-item .goods-info {
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  margin-left: 10px;
  line-height: 1.5;
  font-size: 13px;
  flex-shrink: 0;
  position: relative;
}
.list-goods-item .goods-info .item-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
.w85 {
  width: 85px!important;
}

.tab-content {
  background-color: #fff;
  padding: 16px 12px;
  position: relative;
  -webkit-box-shadow: 1px 0 10px 1px rgb(0 0 0 / 30%);
  box-shadow: 1px 0 5px 1px rgb(0 0 0 / 30%);
}

</style>
