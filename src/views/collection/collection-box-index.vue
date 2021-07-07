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

</style>
<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" size="small" icon="el-icon-refresh" :loading="loading" @click="refresh">刷新数据</el-button>
      <el-button type="danger" size="small" icon="el-icon-delete" :loading="loading" @click="BoxDelete">批量删除</el-button>
    </div>
    <div class="tab-content fliter-box">
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="5" v-if="isSuper">
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
            <el-form-item label="审核状态">
              <el-select v-model="where.review_status" filterable placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="审核中" value=0></el-option>
                <el-option label="审核成功" value=1></el-option>
                <el-option label="审核失败" value=2></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
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
      :scroll-y="{ gt:-1 }"
      :cellStyle="{ height: '90px' }"
      @page-change="handlePageChange"
    >
      <template v-slot:product="{ row }">
        <div class="list-goods-item goods-item">
          <div class="list-goods-item-side">
            <span class="goods-img">
              <div>
                <img v-if="row.img_urls" :src="row.img_urls[0]" style="width: 100px;"/>
                <span v-else>无</span>
              </div>
            </span>
          </div>
          <div class="goods-info">
            <span class="item-title">{{ row.title }}</span>
            <div class="goods-item-info">
              <span>来源：</span>
              <a :href="row.source_url" target="_blank">{{ row.source }}</a>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:status="{ row }">
        <div align="center"><span>{{ row.create_time }}</span></div>
        <div align="center">
          <span v-if="row.status === 0" style="color:red">{{ row.status_desc }}</span>
          <span v-else-if="row.status === 1" style="color:green">{{ row.status_desc }}</span>
        </div>
      </template>
      <template v-slot:review_status="{ row }">
        <div align="center">
          <span v-if="row.review_status == 0" style="color:#f38107">审核中</span>
          <span v-if="row.review_status == 1" style="color:green">审核成功</span>
          <span v-if="row.review_status == 2" style="color:red">审核驳回</span>
        </div>
      </template>
      <template v-slot:action="{ row }">
        <div style="margin-bottom: 10px">
          <el-button size="mini" class="w85" @click="BoxEditPage(row.id)">编辑</el-button>
          <el-button size="mini" class="w85" @click="BoxDelete(row.id)">删除</el-button>
<!--          <el-button v-if="row.review_info" is-dot size="mini" class="w85" @click="">查看错误</el-button>-->
          <el-badge v-if="row.review_info" is-dot class="w85" >
            <el-button style="margin-left: 10px;" size="mini" class="w85" @click="viewErrot(row.review_info)">查看错误</el-button>
          </el-badge>
        </div>
        <div style="margin-bottom: 10px">
          <el-button size="mini" class="w85" @click="dialogFormVisible = true; id = row.id">上架登刊</el-button>
          <el-popover
            placement="right"
            width="400"
            trigger="click">
            <el-table :data="historyData">
              <el-table-column width="150" property="date" label="日期"></el-table-column>
              <el-table-column width="100" property="ebay_name" label="店铺"></el-table-column>
              <el-table-column width="300" property="status" label="状态"></el-table-column>
            </el-table>
            <el-button size="mini" class="w85" style="margin-left: 10px;" slot="reference" @click="history(row.id)">上架历史</el-button>
          </el-popover>
        </div>
      </template>
    </vxe-grid>
    <box-edit ref="edit" @on-submit="refresh"></box-edit>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="店铺名称"  prop="store_id">
          <el-select v-model="ruleForm.store_id" filterable placeholder="请选择店铺">
            <el-option
              v-for="item in storeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否包邮" prop="isFree">
          <template>
            <el-radio-group v-model="ruleForm.isFree" @change="shipFree = !shipFree">
              <el-radio :label="0">包邮</el-radio>
              <el-radio :label="1">不包邮</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item v-if="!shipFree" label="邮费设置" prop="shipPrice">
          <el-input v-model="ruleForm.shipPrice" placeholder="请输入邮费"></el-input>
        </el-form-item>
        <el-form-item label="运输方式" prop="shipService">
          <el-select v-model="ruleForm.shipService">
            <el-option value="0" label="USPSParcel"/>
            <el-option value="1" label="USPSFirstClass"/>
          </el-select>
        </el-form-item>
        <el-form-item label="处理时间" prop="handle_time">
          <el-select v-model="ruleForm.handle_time">
            <el-option value="0" label="同一工作日"/>
            <el-option value="1" label="1工作日"/>
            <el-option value="2" label="2工作日"/>
            <el-option value="3" label="3工作日"/>
            <el-option value="4" label="4工作日"/>
            <el-option value="5" label="5工作日"/>
            <el-option value="6" label="10工作日"/>
            <el-option value="7" label="15工作日"/>
            <el-option value="8" label="20工作日"/>
            <el-option value="9" label="30工作日"/>
          </el-select>
        </el-form-item>
        <el-form-item label="退货周期" prop="ret_time">
          <el-select v-model="ruleForm.ret_time">
            <el-option value="0" label="30日"/>
            <el-option value="1" label="60日"/>
          </el-select>
        </el-form-item>
        <el-form-item label="物品位置" prop="location_id">
          <el-select v-model="ruleForm.location_id" placeholder="请选择位置">
            <el-option v-for="item in locationList" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item>
<!--          <div slot="footer" class="dialog-footer">-->
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="additem('ruleForm')">确 定</el-button>
<!--          </div>-->
        </el-form-item>
      </el-form>
    </el-dialog>
  </d2-container>
</template>

<script>
import pageOption from '@/mixin/page-option'
import ContainerResize from '@/mixin/container-resize'
import BoxEdit from './collection-box-edit'
import { getBoxs, deleteBox, createltem, getLtemHistory } from '@api/collection/box'
import { getStoreSelect } from '@/api/ebay/ebayStore'
import { getGoodsLocationSelect } from '@/api/warehouse/goodsLocation'
import { getAdminUserSelect } from '@api/ebay/ebayAccount'
import { mapGetters } from 'vuex'

export default {
  name: 'collection-box-index',
  components: {
    BoxEdit
  },
  mixins: [pageOption, ContainerResize],
  data () {
    return {
      id: 0,
      loading: false,
      columns: [
        { type: 'checkbox', width: '60', fixed: 'left' },
        { title: 'id', field: 'id', width: 20, fixed: 'left', visible: false },
        { title: '商品信息', width: '40%', fixed: 'left', slots: { default: 'product' } },
        { title: '采集时间/状态', width: '13%', fixed: 'left', slots: { default: 'status' } },
        { title: '审核状态', width: '13%', fixed: 'left', slots: { default: 'review_status' } },
        { title: '操作', minWidth: 200, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        genre: 0,
      },
      checkList: [],
      storeSelect: [],
      dialogFormVisible: false,
      locationList: [],
      options: [],
      historyData: [],
      shipFree: true,
      ruleForm: {
        store_id: '',
        location_id: '',
        isFree: 0,
        handle_time: '3',
        shipPrice: '',
        shipService: '0',
        ret_time: '0',
      },
      rules: {
        store_id: [
          { required: true, message: '请选择商铺', trigger: 'blur' },
        ],
        location_id: [
          { required: true, message: '请选发货位置', trigger: 'blur' },
        ],
        handle_time: [
          { required: true, message: '请选择处理时间', trigger: 'blur' },
        ],
        shipPrice: [
          { required: true, message: '请输入运费', trigger: 'blur' },
        ],
        shipService: [
          { required: true, message: '请选择运输服务', trigger: 'blur' },
        ],
        ret_time: [
          { required: true, message: '请退货时间', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters('d2admin/user', [
      'isSuper',
    ])
  },
  methods: {
    init () {
      this.refresh()
      getStoreSelect().then(values => {
        this.storeSelect = values
      })
      getGoodsLocationSelect().then(values => {
        this.locationList = values
      })
      getAdminUserSelect().then(values => {
        this.options = values
      })
    },
    refresh () {
      this.loading = true
      getBoxs(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
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
    // handleFilterChange ({ property, values }) {
    //   switch (property) {
    //     case 'genre_desc':
    //       this.where.genre = values[0]
    //       break
    //     default:
    //       break
    //   }
    //   this.searchSubmit()
    // },
    BoxEditPage (id = 0) {
      this.$refs.edit.open(id)
    },
    BoxDelete (id) {
      this.$confirm('此操作将删除该商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteBox(id).then(() => {
          this.refresh()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    additem (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.loading = true
          createltem(
            this.id,
            this.ruleForm.store_id,
            this.ruleForm.location_id,
            this.ruleForm.isFree,
            this.ruleForm.handle_time,
            this.ruleForm.shipPrice,
            this.ruleForm.shipService,
            this.ruleForm.ret_time,
          ).then(response => {
            if (response.code === 1) {
              if (response.msg.Errors) {
                let str = ''
                str = response.msg.Errors.LongMessage
                for (let i = 0; i < response.msg.Errors.length; i++) {
                  str += '问题' + (i + 1) + '：' + response.msg.Errors[i].LongMessage + '\r\n'
                  console.log(i)
                }
                str = str.replace(/</, "&lt;")
                str = str.replace(/>/, "&gt;")
                this.$alert(str, '错误', {
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: '确定',
                })
              }
            } else {
              this.$message({ message: '提交成功', type: 'success' })
            }
          }).catch(() => {
          }).finally(() => {
            this.loading = false
          })
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    history (id) {
      getLtemHistory(id).then(response => {
        this.historyData = response.history
      })
    },
    viewErrot (data) {
      let str = ''
      data = data[0]
      if (data.msg.error) {
        str = data.msg.error.Errors.LongMessage
        for (let i = 0; i < data.msg.error.Errors.length; i++) {
          str += '问题' + (i + 1) + '：' + data.msg.error.Errors[i].LongMessage + '\r\n'
          console.log(i)
        }
        str = str.replace(/</, "&lt;")
        str = str.replace(/>/, "&gt;")
      } else {
        str = '驳回原因：' + data.msg
      }

      this.$alert(str, '错误', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
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
