<template>
  <el-select
    v-model="value"
    :placeholder="tag"
    clearable
    filterable
    v-el-select-loadmore="loadmore"
    remote
    @focus="handlefocus"
    @change="slechange"
    :remote-method="remoteMethod"
    :loading="loading"
    size="mini"
    style="width:90px;display:inline;"
    class="select"
  >
    <el-option
      v-for="(option, index) in obj"
      :key="tag+index"
      v-bind:value="option.value"
      v-bind:label="option.label"
    ></el-option>
  </el-select>
</template>

<script>
import require from '@/plugin/axios'

export default {
  // 滑动加载更多时，判断下拉框是否触底决定是否加载更多
  directives: {
    'el-select-loadmore': {
      bind (el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  data () {
    return {
      formData: {
        page: 1,
        limit: 20,
      },
      obj: [],
      loading: false,
      value: {},
      canshu: {}
    }
  },
  created () {
    this.value = this.dataForm// Object.assign({}, this.dataForm)
  },
  beforeMount () {
    this.$nextTick(() => {
      this.value = this.dataForm // Object.assign({}, this.dataForm) // 表单数据到组件显示的过渡
      this.formData = { page: 1, limit: 20 }
      this.formData.dxid = this.dataForm// [this.sty] // 设定表单需要值为dxid,由dxid反查dxmc进行回显
      this.getArrs(this.formData) // 数据进行回显（dxid---label的显示）
    })
  },
  props: {
    tag: { type: String },
    sty: { type: String },
    srcouse: { type: String }, // 下拉框接口对应的代表字符串(类似key-value中的key)
    dataForm: { type: Number },
    goods_id: { type: Number },
  },
  model: {
    prop: 'goods_id',
    event: 'cc',
  },
  watch: {
    dataForm: function () {
      this.value = this.dataForm // Object.assign({}, this.dataForm) // 表单数据到组件显示的过渡
      this.formData = { page: 1, limit: 20 }
      this.formData.dxid = this.dataForm// [this.sty] // 设定表单需要值为dxid,由dxid反查dxmc进行回显
      this.getArrs(this.formData) // 数据进行回显（dxid---label的显示）
    }
  },
  methods: {
    // 选择值时给父组件传值
    slechange () {
      // var prame = {}
      // prame[this.sty] = this.value[this.sty]
      // this.$emit('recanshu', this.value)
      this.$emit('cc', this.value)
      // console.log(this.goods_id)
    },
    // 相当于翻页查询
    loadmore (val) {
      this.formData.page++
      this.getArrs(this.formData)
    },
    // 查询接口
    getArrs (data) {
      Promise.all([
        require.get(this.srcouse, { params: data })
      ]).then(values => {
        values[0].forEach((item) => {
          this.obj.push({
            label: item.value, // 假定接口返回数据形式为{ dxid: '', dxmc: '' }形式，具体情况具体变化
            value: item.goods_id
          })
        })
      })
    },
    // 点击-初始化下拉框
    handlefocus () {
      this.formData.dxid = ''
      this.formData.page = 1
      this.obj = []
      this.getArrs(this.formData)
    },
    // 条件搜索
    remoteMethod (query) {
      this.formData.dxmc = query
      this.obj = []
      this.getArrs(this.formData)
    }
  }
}
</script>
