<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading" @click="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button :loading="loading" @click="loadOrders" icon="el-icon-refresh">载入订单</el-button>
      <el-dropdown @command="ShipCommand" trigger="click" style="margin-left: 10px;">
        <el-button type="primary" icon="el-icon-s-promotion">
          批量发货<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <template v-for="(item,index) in locationList">
            <el-dropdown-item :key="index" :command="{ location_id: item.value, lable: item.label }">{{ item.label }}</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="warning" @click="blacklist(0)" icon="el-icon-scissors" style="margin-left: 10px;">批量忽略</el-button>
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
      :cellStyle="{ height: '90px' }"
      :tooltip-config="{contentMethod: showTooltipMethod, showAll: true}"
      @page-change="handlePageChange"
    >
      <template v-slot:title="{ row }">
        <span class="text-shenglue" v-for="item in row.orders" :key="item.id">{{ item.quantity }}X {{ item.title }}<br></span>
      </template>
      <template v-slot:sku="{ row }">
        <span class="text-shenglue" v-for="item in row.orders" :key="item.id">{{ item.quantity }}X {{ item.sku }}<br></span>
      </template>
      <template v-slot:action="{ row }">
        <div style="margin-bottom: 10px">
          <el-dropdown @command="ShipCommand" trigger="click">
            <el-button size="mini" type="primary">
              发货<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-for="(item,index) in locationList">
                <el-dropdown-item :key="index" :command="{ id:row.id, location_id: item.value, lable: item.label }">{{ item.label }}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="warning" class="w85" style="margin-left: 10px;" size="mini" slot="reference">编辑</el-button>
        </div>
        <div style="margin-bottom: 10px">
          <el-popconfirm title="确认忽略订单?" @confirm="blacklist(row.id)" style="margin-left: 10px">
            <el-button type="warning" class="w85" size="mini" slot="reference">忽略</el-button>
          </el-popconfirm>
        </div>
      </template>
      <template v-slot:action="{ row }">
        <div style="margin-bottom: 10px">
          <el-dropdown @command="ShipCommand" trigger="click">
            <el-button size="mini"  class="w85" type="primary">发 货<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-for="(item,index) in locationList">
                <el-dropdown-item :key="index" :command="{ id:row.id, location_id: item.value, lable: item.label }">{{ item.label }}</el-dropdown-item>
              </template>
              <el-dropdown-item :command="{ id:row.id, location_id: -1, lable: '手动发货' }">手动发货</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="warning" class="w85" style="margin-left: 10px;" size="mini" @click="tableEdit(row.id)">编辑</el-button>
        </div>
        <div style="margin-bottom: 10px">
          <el-button type="danger" class="w85" size="mini" @click="blacklist(row.id)">忽略</el-button>
          <el-button type="danger" size="mini" class="w85" @click="refund(row.order_id)">退款订单</el-button>
        </div>
      </template>
    </vxe-grid>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form label-width="80px">
        <el-form-item label="运营商">
          <el-select v-model="GmanualShip.operator" placeholder="请选择">
            <el-option label="USPS" :value="0"></el-option>
            <el-option label="UPS" :value="1"></el-option>
            <el-option label="FedEx" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="追踪号">
          <el-input v-model="GmanualShip.tracking" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="manualShip()">确 定</el-button>
      </span>
    </el-dialog>
    <EbayOrderEdit ref="edit" @on-submit="refresh"></EbayOrderEdit>
    <EbayOrderRefund ref="refund" @on-submit="refresh"></EbayOrderRefund>
  </d2-container>
</template>

<script>
import pageOption from '@/mixin/page-option'
import { getEbayOreders, createShiping, loadOrder, pushBlackList, ship } from '@api/ebay/ebayOrder'
import { getGoodsLocationSelect } from '@api/warehouse/goodsLocation'
import ContainerResize from '@/mixin/container-resize'
import EbayOrderEdit from './ebay-order-edit'
import EbayOrderRefund from './ebay-order-refund'

export default {
  name: 'ebay-order-index',
  components: {
    EbayOrderEdit,
    EbayOrderRefund
  },
  mixins: [pageOption, ContainerResize],
  watch: {
  },
  data () {
    return {
      loading: false,
      columns: [
        { type: 'checkbox', width: '60', fixed: 'left' },
        { title: 'id', field: 'id', width: 50, fixed: 'left' },
        { title: 'ebay账号', field: 'ebay_name', width: 90, fixed: 'left' },
        { title: '订单ID', field: 'order_id', width: 120, fixed: 'left' },
        { title: '订单时间', field: 'createddate', width: 130, formatter: 'unixTime' },
        { title: '商品标题', field: 'title', width: 180, slots: { default: 'title' } },
        { title: 'sku编号', width: 130, slots: { default: 'sku' } },
        { title: 'name', field: 'name', width: 135 },
        { title: '地址1', field: 'Street1', width: 135 },
        { title: '地址2', field: 'Street2', width: 135 },
        { title: '城市', field: 'CityName', width: 135 },
        { title: '州', field: 'StateOrProvince', width: 60 },
        { title: '国家', field: 'Country', width: 50 },
        { title: '邮政编码', field: 'PostalCode', width: 120 },
        { title: '电话', field: 'Phone', width: 100 },
        { title: '电子邮箱', field: 'Email', width: 145 },
        { title: '操作', minWidth: 210, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
      },
      locationList: [],
      locationId: '',
      dialogVisible: false,
      GmanualShip: {
        id: '',
        operator: '',
        tracking: '',
      }
    }
  },
  methods: {
    showTooltipMethod ({ type, column, row, items, _columnIndex }) {
      // 重写默认的提示内容
      if (column.property === 'title') {
        let str = ''
        row.orders.forEach(function (val) {
          str += val.quantity + 'X ' + val.title + '\r\n'
        })
        return str
      }
    },
    init () {
      this.refresh()
      getGoodsLocationSelect().then(values => {
        this.locationList = values
      })
    },
    refresh () {
      this.loading = true
      getEbayOreders(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    async ShipCommand (command) {
      const id = command.id ?? 0
      const location_id = command.location_id
      const lable = command.lable
      if (location_id === -1) {
        this.GmanualShip.id = id
        this.dialogVisible = true
        return
      }

      this.$prompt('此操作将选择"' + lable + '为发货地址, 是否继续?请填下面的备注信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(({ value }) => {
        console.log(value)
        this.ship(id, location_id, value)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发货'
        })
      })
    },
    async ship (id, location_id, value) {
      const id_arr = []
      if (id === 0) {
        const selectRecords = this.$refs.table.getCheckboxRecords()
        if (selectRecords.length === 0) {
          this.$message({ message: '请选择订单', type: 'error' })
          return false
        }
        if (await this.$confirm('是否发货？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '发货',
          cancelButtonText: '取消'
        }).catch(() => {}) !== 'confirm') {
          return
        }
        selectRecords.forEach(function (val) {
          id_arr.push(val.id)
        })
      } else {
        id_arr.push(id)
      }
      this.loading = true
      createShiping(id_arr, location_id, value).then(response => {
        if (response.code === 0) {
          this.$alert(response.msg, '出错', {
            confirmButtonText: '确定'
          })
          return false
        }
        this.$message({ message: '提交成功', type: 'success' })
        this.refresh()
      }).catch(() => {
        // this.$message({ message: '操作失败', type: 'error' })
      }).finally(() => {
        this.loading = false
      })
    },
    async loadOrders () {
      if (await this.$confirm('是否要加载订单？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(() => {}) !== 'confirm') {
        return
      }
      this.loading = true
      loadOrder().then(response => {
        this.$message({ message: '操作成功，由于是异步操作，请等几分钟再来刷新该页面查看数据', type: 'success' })
        this.refresh()
      }).catch(() => {
        this.$message({ message: '操作失败', type: 'error' })
      }).finally(() => {
        this.loading = false
      })
    },
    async blacklist (id) {
      if (await this.$confirm('是否忽略订单？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).catch(() => {}) !== 'confirm') {
        return
      }
      const id_arr = []
      if (id === 0) {
        const selectRecords = this.$refs.table.getCheckboxRecords()
        if (selectRecords.length === 0) {
          this.$message({ message: '请选择导出订单', type: 'error' })
          return false
        }
        selectRecords.forEach(function (val) {
          id_arr.push(val.id)
        })
      } else {
        id_arr.push(id)
      }
      pushBlackList(id_arr).then(response => {
        this.$message({ message: '操作成功', type: 'success' })
        this.refresh()
      }).catch(() => {
        this.$message({ message: '操作失败', type: 'error' })
      })
    },
    refund (id = 0) {
      this.$refs.refund.open(id)
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    manualShip () {
      ship(this.GmanualShip).then(response => {
        this.refresh()
        this.dialogVisible = false
      }).catch(() => {
        this.$message({ message: '操作失败', type: 'error' })
      }).finally(() => {
        this.loading = false
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
.text-shenglue{
  display:block;
  word-break:keep-all;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  -icab-text-overflow:ellipsis;
  -khtml-text-overflow:ellipsis;
  -moz-text-overflow: ellipsis;
  -webkit-text-overflow:ellipsis;
}
.w85 {
  width: 85px!important;
}
</style>
