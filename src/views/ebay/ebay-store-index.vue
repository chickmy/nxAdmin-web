<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button type="primary" @click="loadData()" icon="el-icon-plus">载入数据</el-button>
    </div>
    <div class="tab-content fliter-box">
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="3">
            <el-form-item label="操作人">
              <el-select v-model="where.user_id" filterable placeholder="请选择操作人">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in adminUserSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="店铺名">
              <el-select v-model="where.store_id" filterable placeholder="请选择店铺名">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in storeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="上架时间">
              <el-date-picker
                value-format="timestamp"
                v-model="where.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="商品名称">
              <el-input v-model="where.title" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" style="margin-left: 25px;" @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="margin-bottom: 10px">
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
        :cellStyle="{ height: '120px' }"
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
                <span class="item-title">商品类型：{{ row.list_ing_type_desc }}</span>
              </div>
              <div class="goods-item-info">
                <span>商品链接：</span>
                <a :href="row.view_Item_url" target="_blank">点击访问</a>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:price="{ row }">
          <span v-if="row.listing_type === 'Chinese'">当前价格：{{ row.current_price }}</span>
          <span v-else>当前价格：{{ row.now_price }}</span><br>
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
        <template v-slot:action="{ row }">
          <div style="margin-bottom: 10px">
            <el-dropdown @command="optType" trigger="click">
              <el-button size="mini" type="primary">
                选库存<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ type:0, id:row.item_id }">本地仓库</el-dropdown-item>
                <el-dropdown-item :command="{ type:1, id:row.item_id }" :disabled="true">虚拟仓库</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-if="row.listing_type!=='FixedPriceItem'" size="mini" class="w85" style="margin-left: 10px;" disabled>改价钱</el-button>
            <el-button v-else size="mini" class="w85" style="margin-left: 10px;" @click="priceEdit(row.item_id)">改价钱</el-button>
          </div>
          <div style="margin-bottom: 10px">
            <el-button v-if="row.listing_type!=='FixedPriceItem'" size="mini" class="w85" disabled>改库存</el-button>
            <el-button v-else size="mini" class="w85" @click="qtyEdit(row.item_id, row.qty)">改库存</el-button>
            <el-button size="mini" class="w85">开发中</el-button>
          </div>
        </template>
      </vxe-grid>
    </div>
  </d2-container>
</template>

<script>
import { getEbayStores, loadData, optGoodsType, qtyOrPriceEdit, getStoreSelect } from '@/api/ebay/ebayStore'
import pageOption from '@/mixin/page-option'
import ContainerResize from '@/mixin/container-resize'
import { getAdminUserSelect } from '@/api/ebay/ebayAccount'

export default {
  name: "ebay-store-index",
  mixins: [pageOption, ContainerResize],
  data () {
    return {
      id: 0,
      dev_id: 0,
      loading: false,
      columns: [
        { title: '商品信息', width: 400, fixed: 'left', slots: { default: 'product' } },
        { title: '商铺名称', field: 'store_name', width: 100, fixed: 'left' },
        { title: '操作人', field: 'user_name', width: 100, fixed: 'left' },
        { title: '价格', field: 'now_price', width: 120, slots: { default: 'price' } },
        { title: 'SKU', width: 160, slots: { default: 'sku' } },
        { title: '销量', width: '80', slots: { default: 'sold' } },
        { title: '访问量', width: '80', slots: { default: 'hit' } },
        { title: '收藏量', width: '80', slots: { default: 'watch' } },
        { title: '库存', width: '130', slots: { default: 'reserve' } },
        { title: '上架时间', field: 'start_time', width: 135, formatter: 'unixTime' },
        { title: '操作', minWidth: 200, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        // ebay_id: 0,
        user_id: '',
        store_id: '',
        time: [],
      },
      adminUserSelect: [],
      storeSelect: [],
    }
  },
  methods: {
    init () {
      // if (!this.$route.params.id && !this.$route.params.dev_id) {
      //   this.$router.go(-1)
      //   return
      // }
      // this.id = this.$route.params.id
      // this.dev_id = this.$route.params.dev_id
      // this.where.ebay_id = this.$route.params.id
      getAdminUserSelect().then(values => {
        this.adminUserSelect = values
      })
      getStoreSelect().then(values => {
        this.storeSelect = values
      })
      this.refresh()
    },
    refresh () {
      this.loading = true
      getEbayStores(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    loadData () {
      loadData(this.id, this.dev_id).then(({ data }) => {
        this.refresh()
      })
    },
    optType (command) {
      optGoodsType(command.type, command.id).then(() => {
        this.$message({ message: '绑定仓库成功', type: 'success' })
        this.refresh()
      })
    },
    priceEdit (item_id) {
      this.$prompt('请输入价格', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[+-]?[0-9]+(\.[0-9]{1,4})?$/,
        inputErrorMessage: '输入内容不正确'
      }).then(({ value }) => {
        qtyOrPriceEdit(this.id, this.dev_id, item_id, 0, value).then(() => {
          this.$message({
            type: 'success',
            message: '你修改的价钱是: ' + value
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
    qtyEdit (item_id, qty) {
      console.log(qty)
      if (!qty) {
        this.$message({
          type: 'info',
          message: '该商品未选择库存'
        })
        return false
      }
      this.$prompt('请输入库存', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[+]{0,1}(\d+)$/,
        inputErrorMessage: '输入内容不正确'
      }).then(({ value }) => {
        qtyOrPriceEdit(this.id, this.dev_id, item_id, value, 0).then(() => {
          this.$message({
            type: 'success',
            message: '你修改的库存是: ' + value
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
    search () {
      this.refresh()
    }
  },
  mounted () {
    this.init()
  },
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

.tab-content {
  background-color: #fff;
  padding: 16px 12px;
  position: relative;
  -webkit-box-shadow: 1px 0 10px 1px rgb(0 0 0 / 30%);
  box-shadow: 1px 0 5px 1px rgb(0 0 0 / 30%);
}
</style>
