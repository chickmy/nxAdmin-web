<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading" @click="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button type="primary" @click="tableEdit()" icon="el-icon-plus">添加</el-button>
      <el-button type="primary" @click="dialogVisible=true;importType=1" icon="el-icon-plus">批量上传</el-button>
      <el-button type="primary" @click="dialogVisible=true;importType=2" icon="el-icon-plus">批量上传虚拟SKU</el-button>
      <el-button type="primary" @click="$router.push({ name: 'goods-class-index' })">分类管理</el-button>
      <el-button type="primary" @click="$router.push({ name: 'goods-location-index' })">位置管理</el-button>
      <el-cascader
          :options="classList"
          :props="props"
          collapse-tags
          v-model="class_id"
          clearable></el-cascader>
      <el-button type="primary" @click="filter" icon="el-icon-attract">筛选分类</el-button>
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
          <el-button type="info" size="small" @click="downloadMode">模 板</el-button>
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="small" @click="submitUpload">上 传</el-button>
        </span>
      </el-dialog>

      <div style="float:right;">
        <el-input placeholder="请输入搜索内容" v-model="selectData">
          <el-select style="width: 100px" v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="SKU编号" value="1"></el-option>
            <el-option label="虚拟SKU" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="selectInfo"></el-button>
        </el-input>
      </div>

    </div>
    <vxe-grid
      showOverflow="null"
      ref="table"
      row-id="id"
      :height="targetHeight"
      :loading="loading"
      :columns="columns"
      :data="data"
      :pager-config="tablePage"
      :scroll-y="{ gt:-1 }"
      :cellStyle="{ height: '110px' }"
      @page-change="handlePageChange"
    >
      <template v-slot:img="{ row }">
        <el-image
          style="width: 80px; height: 80px"
          :src="row.dialogImageUrl"
          :preview-src-list="[row.dialogImageUrl]"
        >
        </el-image>
      </template>
      <template v-slot:action="{ row }">
        <el-popover
          placement="right"
          width="500"
          trigger="click">
          <el-row>
            <el-col :span="12"><div class="grid-content bg-purple">
              <vxe-grid
                ref="table1"
                row-id="id"
                :height="targetHeight"
                :loading="loading"
                :columns="storeColumns"
                :data="storeData"
              >
                <template v-slot:url="{ row }">
                  <a :href="row.view_Item_url" target="_blank">点击访问</a>
                </template>
              </vxe-grid>
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">
              <vxe-grid
                ref="table2"
                row-id="id"
                showOverflow="null"
                :height="targetHeight"
                :loading="loading"
                :columns="collectionColumns"
                :data="collectionData"
                :scroll-y="{ gt:-1 }"
                :cellStyle="{ height: '120px' }"
              >
                <template v-slot:price="{ row }">
                  <span>今天：{{ row.today.price }}</span><br>
                  <span>昨天：{{ row.yesterday.price }}</span><br>
                </template>
                <template v-slot:sold="{ row }">
                  <span>今天：{{ row.today.sold }}</span><br>
                  <span>昨天：{{ row.yesterday.sold }}</span><br>
                </template>

              </vxe-grid>
<!--              <template v-slot:url="{ row }">-->
<!--                <span>{{ row.todayInfoEx[0]}}</span>-->
<!--              </template>-->
            </div></el-col>
          </el-row>

          <el-button type="primary" size="mini" slot="reference" @click="getStoreInfo(row.id)">登刊链接</el-button>
        </el-popover>
        <el-button type="primary" size="mini" @click="addEbaySku(row.id)" style="margin-left: 10px;">提取SKU</el-button>
<!--        <el-button type="primary" size="mini" @click="tableEdit(row.id)">登刊链接</el-button>-->
        <el-button type="primary" size="mini" @click="tableEdit(row.id)" style="margin-left: 10px;">编辑</el-button>
        <el-button type="primary" size="mini" @click="parity(row.id)" style="margin-left: 10px;">比价</el-button>
        <el-popconfirm title="确认删除?" @confirm="tableDelete(row.id)" style="margin-left: 10px">
          <el-button type="danger" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </vxe-grid>
    <goodEdit ref="edit" @on-submit="refresh"></goodEdit>
  </d2-container>
</template>

<script>
import goodEdit from './goods-edit'
import pageOption from '@/mixin/page-option'
import { getGoodsS, deleteGoods, importGoods, importGoodsEbaySku, getStoreInfo, getEbaycollectionInfoEx, addEbaySku } from '@api/warehouse/goods'
import { getGoodsClassSelect } from '@api/warehouse/goodsClass'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'goods-index',
  components: {
    goodEdit,
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      importType: 0,
      fileList: [],
      props: { multiple: true },
      classList: [],
      class_id: [],
      select: '',
      selectData: '',
      columns: [
        { title: 'id', field: 'id', width: 80, fixed: 'left' },
        { title: '分类', field: 'class_name', width: 80 },
        { title: '货架号', field: 'mark', width: 80 },
        { title: '产品图片', field: 'createddate', width: 100, slots: { default: 'img' } },
        { title: '商品名称', field: 'name', width: 80 },
        { title: 'SKU编号', field: 'sku', width: 110, fixed: 'left' },
        { title: '虚拟SKU', field: 'ebay_sku', width: 110, showOverflow: true },
        { title: '库存数量', field: 'qty', width: 80 },
        { title: '减库规则', field: 'rule', width: 80 },
        { title: '个数重量', field: 'weight', width: 80 },
        { title: '创建时间', field: 'create_time', width: 135, formatter: 'unixTime' },
        { title: '更新时间', field: 'update_time', width: 135, formatter: 'unixTime' },
        { title: '操作', minWidth: 200, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        sku: '',
        ebay_sku: '',
        class_id: '',
      },
      storeColumns: [
        { title: '价格', field: 'now_price', width: 80 },
        { title: '链接', field: 'view_Item_url', width: 80, slots: { default: 'url' } },
      ],
      storeData: [],
      collectionColumns: [
        { title: '价格', width: 100, slots: { default: 'price' } },
        { title: '销售量', width: 100, slots: { default: 'sold' } },
      ],
      collectionData: [],
    }
  },
  methods: {
    init () {
      this.refresh()
      getGoodsClassSelect().then(values => {
        this.classList = values
      })
    },
    refresh () {
      this.loading = true
      getGoodsS(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
      deleteGoods(id).finally(() => {
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
      if (this.importType === 1) {
        importGoods(formData)
          .then(res => {
            this.refresh()
            this.dialogVisible = false
            this.$message.success('成功')
          })
          .catch(err => {
            console.log('失败', err)
          })
      }
      if (this.importType === 2) {
        importGoodsEbaySku(formData)
          .then(res => {
            this.refresh()
            this.dialogVisible = false
            this.$message.success('成功')
          })
          .catch(err => {
            console.log('失败', err)
          })
      }
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
    downloadMode () {
      window.location.href = '/xlsxMode/BgeCWLfFHQwC6Hfc.xlsx'
    },
    filter () {
      this.where.class_id = this.class_id.toString()
      this.refresh()
    },
    selectInfo () {
      if (this.select === '1') {
        this.where.ebay_sku = ''
        this.where.sku = this.selectData
        this.refresh()
        return
      }
      if (this.select === '2') {
        this.where.sku = ''
        this.where.ebay_sku = this.selectData
        this.refresh()
        return
      }
      this.$message('请选择搜索类型')
    },
    getStoreInfo (id) {
      getStoreInfo(id).then(res => {
        this.storeData = res
      })
      getEbaycollectionInfoEx(id).then(res => {
        console.log(res)
        this.collectionData = res
      })
    },
    parity (id = 0) {
      this.$router.push({ name: 'collection-info-index', params: { id: id } })
    },
    addEbaySku (id = 0) {
      addEbaySku(id).then(res => {
        this.$alert(res.ebaySku, '添加成功', {
          confirmButtonText: '确定',
        })
      })
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

</style>
