<template>
  <div>
    <Dialog
      v-if="visible"
      title="编辑数据"
      :visible.sync="visible"
      width="80%"
      append-to-body
      :modal = true
      :before-close = "handleClose"
      :close-on-click-modal="false"
      class="cover_el-dialog__body">
        <div>
          <el-col :span="50">
            <el-menu
              ref="menu"
              default-active="1"
              class="el-menu-vertical-demo"
              @close="handleClose">
              <el-menu-item index="1" @click="scrollTo(0)" id="111">
                <i class="el-icon-caret-right"></i>
                <span slot="title">基础信息</span>
              </el-menu-item>
              <el-menu-item index="2" @click="scrollTo(1)">
                <i class="el-icon-caret-right"></i>
                <span slot="title">商品属性</span>
              </el-menu-item>
              <el-menu-item index="3" @click="scrollTo(2)">
                <i class="el-icon-caret-right"></i>
                <span slot="title">SKU信息</span>
              </el-menu-item>
              <el-menu-item index="4" @click="scrollTo(3)">
                <i class="el-icon-caret-right"></i>
                <span slot="title">商品图片</span>
              </el-menu-item>
              <el-menu-item index="5" @click="scrollTo(4)">
                <i class="el-icon-caret-right"></i>
                <span slot="title">来源链接</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </div>

      <div class="dialogHeight" id="abc">
        <el-form ref="form" :model="form" label-width="80px">
          <div><h2 style="padding-top: 1px;padding-bottom: 20px;padding-left: 5px;">基础信息</h2></div>
          <el-form-item label="商品标题:">
            <el-input v-model="form.title" maxlength="80" show-word-limit></el-input>
          </el-form-item>
          <el-form-item v-if="form.type !== 1" label="商品类型:">
            <el-radio-group v-model="form.type">
              <el-radio :label=0>固定价格</el-radio>
              <el-radio :label=2>拍卖</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="详细描述:">
            <span style="color: #999;">认领到eBay时，填充以下内容到产品描述部分。</span>
            <editor  v-model="form.notes" :init="init" style="z-index: 10;"></editor>
          </el-form-item>
          <div><h2 style="padding-top: 1px;padding-bottom: 20px;padding-left: 5px;">商品属性</h2></div>
          <el-form-item label="商品属性:">
            <div v-for="(value, index) in form.source_attrs" :key="index">
              <div class="el-col el-col-24 el-col-md-12" style="padding-top: 5px;padding-right: 5px;">
                <div class="el-col el-col-24 el-col-md-12">
                  <el-input size="small" v-model="form.source_attrs[index].key" maxlength="65" show-word-limit>
                    <template slot="prepend">{</template>
                    <template slot="append">}</template>
                  </el-input>
                </div>
                <div class="el-col el-col-24 el-col-md-12">
                  <el-input size="small" v-model="form.source_attrs[index].value" maxlength="65" show-word-limit>
                    <template slot="append">
                      <i style="cursor: pointer;" class="el-icon-delete" @click="form.source_attrs.splice(index, 1)"></i>
                    </template>
                  </el-input>
                </div>
              </div>
            </div>
            <div class="el-col el-col-24 el-col-md-12" style="padding-right: 5px;margin-bottom: 10px;">
              <el-button class="btn-add" type="info" plain size="small" @click="form.source_attrs.push({key:'',value:''})">
                <i class="el-icon-plus">
                  <span>新增属性</span>
                </i>
              </el-button>
            </div>
          </el-form-item>
          <div><h2 style="padding-top: 1px;padding-bottom: 20px;padding-left: 5px;">SKU信息</h2></div>
          <template v-if="form.type === 1">
            <template v-for="(value, index) in form.size_map">
              <el-form-item :label="Object.keys(value)[0]" :key="index">
                <div class="info-spec-box">
                  <div class="info-spec-item" v-for="(val, i) in form.size_map[index][Object.keys(value)]" :key="i">
                    <div style="padding-top: 5px;">
                      <el-input size="small" v-model="form.size_map[index][Object.keys(value)][i].value" @input="handTableData" maxlength="65" show-word-limit>
                        <template slot="append">
                          <i style="cursor: pointer;" class="el-icon-delete" @click="form.size_map[index][Object.keys(value)].splice(i, 1);handTableData()"></i>
                        </template>
                      </el-input>
                    </div>
                  </div>
                  <div class="info-spec-item">
                    <el-button class="btn-add" type="info" plain size="small" @click="form.size_map[index][Object.keys(value)].push({id:String(index+20),value:''});handTableData()">
                      <i class="el-icon-plus">
                        <span>新增</span>
                      </i>
                    </el-button>
                  </div>
                </div>
              </el-form-item>
            </template>
            <el-form-item label="SKU列表:">
              <vxe-grid
                ref="table"
                showOverflow="null"
                :data="data"
                :columns="columns"
                :edit-config="{trigger: 'click', mode: 'cell', activeMethod: activeCellMethod}"
              >
                <template v-slot:kucun="{ row }">
                  <SELECT sty="dxid" tag="选择" srcouse="/api/warehouse/goods/select" :dataForm='row.goods_id' v-model="row.goods_id"/>
                </template>
              </vxe-grid>
            </el-form-item>
          </template>
          <template v-else-if="form.type === 0">
            <el-form-item label="价钱:">
              <el-input v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="sku:">
              <el-input v-model="form.sku"></el-input>
            </el-form-item>
            <el-form-item label="库存:">
              <el-input v-model="form.qty"></el-input>
            </el-form-item>
            <el-form-item label="库存SKU:">
              <SELECT sty="dxid" tag="选择" srcouse="/api/warehouse/goods/select" :dataForm='sku_id' v-model="form.goods_id"/>
            </el-form-item>
          </template>
          <template v-else-if="form.type === 2">
            <el-form-item label="起拍价:">
              <el-input v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="sku:">
              <el-input v-model="form.sku"></el-input>
            </el-form-item>
            <el-form-item label="库存:">
              <el-input v-model="form.qty"></el-input>
            </el-form-item>
            <el-form-item label="库存SKU:">
              <SELECT sty="dxid" tag="选择" srcouse="/api/warehouse/goods/select" :dataForm='sku_id' v-model="form.goods_id"/>
            </el-form-item>
          </template>
          <div><h2 style="padding-top: 1px;padding-bottom: 20px;padding-left: 5px;">商品图片</h2></div>
          <el-form-item label="商品图片:">
            <el-upload-comm-img
              @change="picUpdate"
              :list="form.img_urls"
              :action="updataImg()"
            >
            </el-upload-comm-img>
          </el-form-item>
          <el-form-item label="SKU图片:">
            <el-uploa-skud-img
              @change="skuImgUpdate"
              :list="skuImg()"
              :action="updataImg()"
            >
            </el-uploa-skud-img>
          </el-form-item>
          <div><h2 style="padding-top: 1px;padding-bottom: 20px;padding-left: 5px;">来源链接</h2></div>
          <el-form-item label="来源URL:">
            <el-input v-model="form.source_url"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">保 存</el-button>
          <el-button @click="closePage">取 消</el-button>
      </div>

    </Dialog>
  </div>
</template>

<script>
import { Dialog } from 'element-ui'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'

// 引入你需要的插件
import 'tinymce/icons/default/icons'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/fullscreen'
import { getBox, saveBox } from '@api/collection/box'
import { baseUrl } from '@/plugin/axios'
import ElUploadCommImg from '@/components/el-upload-comm-img/index'
import ElUploaSkudImg from '@/components/el-upload-sku-img/index'
import SELECT from '@/components/el-select-loadmore/index'
import { upimg } from '@api/sys'

export default {
  name: 'BoxEdit',
  components: {
    ElUploaSkudImg,
    ElUploadCommImg,
    SELECT,
    Dialog,
    Editor,
  },
  props: {
    // 传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table textcolor wordcount contextmenu fullscreen'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat fullscreen'
    }
  },
  data () {
    return {
      visible: false,
      sku_id: {},
      test_id: 0,
      init: {
        language_url: '/static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/ui/oxide',
        height: 300,
        branding: false,
        menubar: false,
        browser_spellcheck: true, // 拼写检查
        paste_data_images: true, // 允许粘贴图像
        toolbar: this.toolbar,
        plugins: this.plugins,
        images_upload_handler: this.images_upload_handler,
      },
      form: {
        title: '',
        name: '',
        easy_notes: '',
        notes: '',
        source_attrs: [],
        size_map: [],
        sku_map: [],
        img_urls: [],
        source_url: '',
        logistics_info: { weight: '', long: '', width: '', high: '' },
        goods_id: '',
      },
      columns: [
        { title: '信息', width: '25%', field: 'size', fixed: 'left' },
        { title: '价钱', width: '15%', field: 'price', fixed: 'left', editRender: { name: 'input' } },
        { title: 'SKU', width: '20%', field: 'sku', fixed: 'left', editRender: { name: 'input' } },
        { title: '库存', width: '15%', field: 'qty', fixed: 'left', editRender: { name: 'input' } },
        { title: '库存SKU', width: '22%', fixed: 'left', slots: { default: 'kucun' } },
      ],
      data: [],
    }
  },
  methods: {
    open (id = 0) {
      // 监听滚动事件
      window.addEventListener('scroll', this.onScroll, true)
      this.id = id
      // this.sku_id = {}
      this.loadData()
      this.visible = true
    },
    loadData () {
      this.loading = true
      Promise.all([
        getBox(this.id)
      ]).then(values => {
        this.form = values[0]
        this.sku_id = this.form.goods_id
        console.log(this.sku_id)
        this.handTableData()
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          // 必须移除监听器，不然当该vue组件被销毁了，监听器还在就会出错
          window.removeEventListener('scroll', this.onScroll, true)
          done()
        })
        .catch(_ => {})
    },
    closePage () {
      window.removeEventListener('scroll', this.onScroll, true)
      this.visible = false
    },
    submitForm () {
      const self = this
      if (self.form.type === 1) {
        (self.data).forEach(function (val) {
          if (self.form.sku_map.hasOwnProperty(val.id) === true) {
            console.log(val)
            self.form.sku_map[val.id].price = val.price
            self.form.sku_map[val.id].qty = val.qty
            self.form.sku_map[val.id].sku = val.sku
            self.form.sku_map[val.id].goods_id = val.goods_id
          } else {
            self.form.sku_map[val.id] = { price: val.price, qty: val.qty, sku: val.sku, goods_id: val.goods_id }
          }
        })
      }
      console.log(this.form)
      saveBox(this.id, this.form)
        .then(response => {
          this.visible = false
        }).finally(() => {
          this.loading = false
          this.$emit('on-submit')
        })
    },
    handTableData () {
      // 整合表格数据
      let tbale_data = []
      // 拆解数据
      let arr = []
      let map = this.form.size_map
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
        let sku = ''
        let qty = ''
        let goods_id = ''
        if (this.form.sku_map.hasOwnProperty(results[i])) {
          price = this.form.sku_map[results[i]].price
          sku = this.form.sku_map[results[i]].sku
          qty = this.form.sku_map[results[i]].qty
          goods_id = this.form.sku_map[results[i]].goods_id
          console.log(goods_id)
        }
        tbale_data.push({
          id: results[i],
          size: size_str,
          sku: sku,
          qty: qty,
          price: price,
          goods_id: goods_id
        })
        // console.log(size_str)
      }
      this.data = tbale_data
    },
    skuImg () {
      let map = this.form.size_map
      if (map === null) return
      for (let i = 0; i < map.length; i++) {
        let key = map[i][Object.keys(map[i])]
        for (let ii = 0; ii < key.length; ii++) {
          if (Object.keys(map[i])[0] === 'Color') {
            console.log(map[i][Object.keys(map[i])])
            return map[i][Object.keys(map[i])]
          }
        }
      }
    },
    activeCellMethod ({ column, columnIndex }) {
      if (columnIndex === 0) {
        return false
      }
      return true
    },
    picUpdate (list) {
      this.form.img_urls = list
    },
    skuImgUpdate (list) {
      let map = this.form.size_map
      for (let i = 0; i < map.length; i++) {
        let key = map[i][Object.keys(map[i])]
        for (let ii = 0; ii < key.length; ii++) {
          if (Object.keys(map[i])[0] === 'Color') {
            console.log(map[i][Object.keys(map[i])])
            map[i][Object.keys(map[i])] = list
          }
        }
      }
    },
    updataImg () {
      return '/upload/uploadImages'
      // return baseUrl + '/upload/uploadImages'
    },
    onScroll () {
      // 滚动监听器
      const navContents = document.querySelectorAll('.dialogHeight > form > div >h2')
      // console.log(navContents)
      // 所有锚点元素的 offsetTop
      const offsetTopArr = []
      navContents.forEach(item => {
        offsetTopArr.push(item.offsetTop)
      })
      // console.log(offsetTopArr)
      // 获取当前文档流的 scrollTop
      const element = document.getElementById('abc')
      const scrollTop = element.scrollTop + 500
      // console.log(scrollTop)
      // 定义当前点亮的导航下标
      let navIndex = 0
      for (let n = 0; n < offsetTopArr.length; n++) {
        // 如果 scrollTop 大于等于第n个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
        // 那么此时导航索引就应该是n了
        if (scrollTop >= offsetTopArr[n]) {
          navIndex = n
        }
      }
      // this.$refs.menu.activeIndex = navIndex
      this.$nextTick(() => { this.$refs.menu.activeIndex = (navIndex + 1).toString() })
      // this.active = navIndex
    },
    // 跳转到指定索引的元素
    scrollTo (index) {
      // 获取目标的 offsetTop
      // const targetOffsetTop = document.querySelector(`.dialogHeight > form > div >h2:nth-child(${index + 1})`)
      let targetOffsetTop = document.querySelectorAll('.dialogHeight > form > div >h2')
      targetOffsetTop = targetOffsetTop[index].offsetTop
      // console.log(targetOffsetTop)
      // 获取当前 offsetTop
      const element = document.getElementById('abc')
      let scrollTop = element.scrollTop
      // console.log(scrollTop)
      // let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 定义一次跳 50 个像素，数字越大跳得越快，但是会有掉帧得感觉，步子迈大了会扯到蛋
      const STEP = 50
      // 判断是往下滑还是往上滑
      if (scrollTop > targetOffsetTop) {
        // 往上滑
        smoothUp()
      } else {
        // 往下滑
        smoothDown()
      }
      // 定义往下滑函数
      function smoothDown () {
        // 如果当前 scrollTop 小于 targetOffsetTop 说明视口还没滑到指定位置
        if (scrollTop < targetOffsetTop) {
          // 如果和目标相差距离大于等于 STEP 就跳 STEP
          // 否则直接跳到目标点，目标是为了防止跳过了。
          if (targetOffsetTop - scrollTop >= STEP) {
            scrollTop += STEP
          } else {
            scrollTop = targetOffsetTop
          }
          (document.getElementById('abc')).scrollTop = scrollTop
          // 关于 requestAnimationFrame 可以自己查一下，在这种场景下，相比 setInterval 性价比更高
          requestAnimationFrame(smoothDown)
        }
      }
      // 定义往上滑函数
      function smoothUp () {
        if (scrollTop > targetOffsetTop) {
          if (scrollTop - targetOffsetTop >= STEP) {
            scrollTop -= STEP
          } else {
            scrollTop = targetOffsetTop
          }

          (document.getElementById('abc')).scrollTop = scrollTop
          requestAnimationFrame(smoothUp)
        }
      }
    },
    monitorSkuInfo () {
      this.handTableData()
    },
    recanshu (prame) {
      console.log(prame)
      this.form.goods_id = prame
    },
    images_upload_handler: function (blobInfo, success, failure) {
      let formData = new FormData()
      console.log(blobInfo.filename())
      formData.append('img', blobInfo.blob())
      upimg(formData)
        .then(function (res) {
          // console.log(res);
          // that.formData.dialogImageUrl = res.files.real_path
          // that.file_list[0] = { name: '01', url: res.files.real_path }
          // that.file_list[0]=res.data.data.img;
          success(res.img.real_path)
        })
    },
  },
  mounted () {
    tinymce.init({ })
  },
}
</script>

<style scoped>
.radius {
  border: 1px solid #d7dae2;
  border-radius: 4px;
  line-height: 1.5;
}
.dialogHeight {
  height: 600px;
  overflow: auto;
}

.cover_el-dialog__body >>> .el-dialog__body  {
  padding: 5px 1px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.btn-add {
  width: 100%;
  border-style: dashed;
}

.info-spec-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 5px;
  padding-top: 0;
  width: 50%;
}

.info-spec-box {
  /*margin: -5px;*/
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

</style>
