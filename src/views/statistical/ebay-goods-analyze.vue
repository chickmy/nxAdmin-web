<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <div>
        <el-form label-width="80px" :inline="true">
          <el-form-item label="库存SKU:">
            <SELECT sty="dxid" tag="选择" srcouse="/api/warehouse/goods/select"  v-model="where.goods_id"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="selectsku()">确认筛选</el-button>
          </el-form-item>
        </el-form>
<!--        <el-button slot="append" icon="el-icon-search" @click="selectInfo"></el-button>-->
        <el-button @click="sendPrice()">发布指定价格</el-button>
      </div>
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
      :scroll-y="{ gt:-1 }"
      :cellStyle="{ height: '110px' }"
      @page-change="handlePageChange"
    >
      <template v-slot:product="{ row }">
        <div class="list-goods-item goods-item">
          <div class="list-goods-item-side">
            <span class="goods-img">
              <div>
                <el-image
                  style="width: 80px; height: 80px;"
                  :src="row.img"
                >
                </el-image>
              </div>
            </span>
          </div>
          <div class="goods-info">
            <span class="item-title">{{ row.title }}</span>
            <div class="goods-item-info">
              <span class="item-title">商品ID：{{ row.item_id }}</span>
            </div>
            <div class="goods-item-info">
              <span>商品链接：</span>
              <a :href="row.view_Item_url" target="_blank">点击访问</a>
            </div>

          </div>
        </div>
      </template>
      <template v-slot:price="{ row }">
        <span>当前价格：{{ row.now_price }}</span><br>
        <span>指定价格：{{ row.future_price }}</span><br>
      </template>
      <template v-slot:sku="{ row }">
        <span>ebaySKU：{{ row.ebay_sku }}</span><br>
        <span>SKU编号：{{ row.sku }}</span><br>
      </template>
      <template v-slot:reserve="{ row }">
        <span>在线库存：{{ row.quantity_available }}</span><br>
        <span v-if="row.goods_id !== null">本地库存：{{ row.qty }}</span>
        <span v-else>本地库存：未选</span><br>
      </template>
      <template v-slot:sold="{ row }">
        <span>总：{{ row.sold_count }}</span><br>
        <span>今天：{{ row.today_sold_count }}</span><br>
        <span>昨天：{{ row.yesterday_sold_count }}</span><br>
      </template>
      <template v-slot:hit="{ row }">
        <span>总：{{ row.hit_count }}</span><br>
        <span>今天：{{ row.today_hit_count }}</span><br>
        <span>昨天：{{ row.yesterday_hit_count }}</span><br>
      </template>
      <template v-slot:watch="{ row }">
        <span>总：{{ row.watch_count }}</span><br>
        <span>今天：{{ row.today_watch_count }}</span><br>
        <span>昨天：{{ row.yesterday_watch_count }}</span><br>
      </template>
    </vxe-grid>
  </d2-container>
</template>

<script>
import { getAnlyzeData, sendFuturePrice } from '@/api/statistical/ebayGoodsAnalyze'
import { getGoodsSelect } from '@/api/warehouse/goods'
import pageOption from '@/mixin/page-option'
import ContainerResize from '@/mixin/container-resize'
import SELECT from '@/components/el-select-loadmore/index'
import ElUploaSkudImg from '@/components/el-upload-sku-img'
import ElUploadCommImg from '@/components/el-upload-comm-img'
import { Dialog } from 'element-ui'
import Editor from '@tinymce/tinymce-vue'

export default {
  name: "ebay-goods-analyze",
  components: {
    SELECT,
  },
  mixins: [pageOption, ContainerResize],
  data () {
    return {
      loading: false,
      columns: [
        { title: '商品信息', width: 400, fixed: 'left', slots: { default: 'product' } },
        { title: '价格', field: 'now_price', width: 120, slots: { default: 'price' } },
        { title: 'SKU', width: 160, slots: { default: 'sku' } },
        { title: '库存', width: '130', slots: { default: 'reserve' } },
        { title: '销量', width: '80', slots: { default: 'sold' } },
        { title: '访问量', width: '80', slots: { default: 'hit' } },
        { title: '收藏量', width: '80', slots: { default: 'watch' } },
        { title: '上架时间', field: 'start_time', width: 135, formatter: 'unixTime' },
      ],
      data: [],
      where: {
        goods_id: 0,
      },
      selectData: '',
      restaurants: [],
      state: '',
      timeout: null,
    }
  },
  methods: {
    info () {
      getGoodsSelect().then(values => {
        this.restaurants = values
      })
    },
    refresh () {
      this.loading = true
      getAnlyzeData(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    querySearchAsync (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 100 * Math.random())
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      this.where.goods_id = item.goods_id
      this.refresh()
    },
    sendPrice () {
      if (this.where.goods_id === 0) {
        this.$message({
          type: 'info',
          message: '没有此SKU的任何信息，请确认后再搜搜'
        })
        return false
      }
      this.$prompt('', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[+-]?[0-9]+(\.[0-9]{1,4})?$/,
        inputErrorMessage: '输入内容不正确'
      }).then(({ value }) => {
        sendFuturePrice(this.where.goods_id, value).then(() => {
          this.$message({
            type: 'success',
            message: '你发布的价钱是: ' + value
          })
          this.refresh()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    selectsku () {
      this.refresh()
    }
  },
  mounted () {
    this.info()
  }
}
</script>

<style scoped>
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
</style>
