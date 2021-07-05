<template>
  <el-dialog :visible.sync="visible" @close="onClose" title="用户编辑" width="450px" footer-hide :styles="{top: '20px'}">
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="分类" prop="class_id">
        <el-select v-model="formData.class_id" placeholder="请选择分类">
          <el-option v-for="item in classList" :key="item.value" :value="item.value" :label="item.label"/>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库位置" prop="location_id">
        <el-select v-model="formData.location_id" placeholder="请选择位置">
          <el-option v-for="item in locationList" :key="item.value" :value="item.value" :label="item.label"/>
        </el-select>
      </el-form-item>
      <el-form-item label="SKU编号" prop="sku">
        <el-input name="sku"  v-model.trim="formData.sku"></el-input>
      </el-form-item>
      <el-form-item label="虚拟SKU" prop="ebay_sku">
        <el-input type="textarea" name="ebay_sku" v-model.trim="formData.ebay_sku"></el-input>
        <el-button type="primary"  icon="el-icon-circle-plus-outline" @click="createEbaySku"></el-button>
      </el-form-item>
      <el-form-item label="库存数量" prop="qty">
        <el-input name="qty" v-model.trim="formData.qty"></el-input>
      </el-form-item>
      <el-form-item label="减库规则" prop="rule">
        <el-input name="rule" placeholder="例：规则填2,出一张订单，库存减2" v-model.trim="formData.rule"></el-input>
      </el-form-item>
      <el-form-item label="个数重量" prop="weight">
        <el-input name="weight" placeholder="单位OZ" v-model.trim="formData.weight"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input name="name" v-model.trim="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="货架号" prop="mark">
        <el-input name="mark" v-model.trim="formData.mark"></el-input>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          class="avatar-uploader"
          ref="upload_img"
          action=""
          accept="image/jpeg,image/jpg,image/png"
          list-type="picture-card"
          :name="upload_name"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :limit="1"
          :file-list="file_list"
          :http-request="uploadSectionFile">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpeg、jpg、png 格式的图片，图片大小在2M以内。</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getGoods, saveGoods } from '@api/warehouse/goods'
import { getGoodsClassSelect } from '@api/warehouse/goodsClass'
import { getGoodsLocationSelect } from '@api/warehouse/goodsLocation'
import { upimg } from '@api/sys'
import { cloneDeep } from 'lodash'

export default {
  name: 'goodEdit',
  data () {
    return {
      upload_name: 'files',
      file_list: [],
      classList: [],
      locationList: [],
      id: 0,
      visible: false,
      loading: false,
      formData: {
        sku: '',
        ebay_sku: '',
        qty: '',
        rule: '',
        weight: '',
        name: '',
        dialogImageUrl: '',
        class_id: '',
        location_id: '',
        shelf_position: '',
        mark: '',
      },
      rules: {
        sku: [
          { required: true },
        ],
        qty: [
          { required: true },
        ],
        weight: [
          { required: true },
        ],
        name: [
          { required: true },
        ],
        rule: [
          { required: true },
        ],
        location_id: [
          { required: true },
        ],
        class_id: [
          { required: true },
        ],
        mark: [
          { required: true },
        ],
      },
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    handleExceed: function () {
      this.$alert('图片最多上传一张，请删除再重新上传！', '', {
        showConfirmButton: false,
        callback: action => {}
      });
    },
    // 文件列表移除文件时的钩子
    handleRemove: function (file, fileList) {
      this.dialogImageUrl = ''
    },
    // 这个方法主要对图片的类型和大小进行一个判断
    uploadSectionFile: function (params) {
      // 自定义上传方法
      let that = this,
        file = params.file,//   获取上传的文件
        fileType = file.type,//   获取文件类型
        isImage = fileType.indexOf('image') != -1,//  判断是否是图片类型
        file_url = that.$refs.upload_img.uploadFiles[0].url
      let isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) { // 判断大小
        alert('上传图片的大小不能超过 2MB!')
        that.$refs.upload_img.uploadFiles = []
        return;
      }
      if (!isImage) {
        alert('请选择图片文件！')
        that.$refs.upload_img.uploadFiles = []
        return;
      }
      if (isImage) {
        var img = new Image()
        img.src = file_url
        img.onload = function () {
          //  一切验证通过后调用上传方法
          that.uploadFile(file)
        }
      }
    },
    uploadFile: function (file) {
      let that = this,
        formData = new FormData()
      formData.append(that.upload_name, file)
      upimg(formData)
        .then(function (res) {
          // console.log(res);
          that.formData.dialogImageUrl = res.files.real_path
          that.file_list[0] = { name: '01', url: res.files.real_path }
          // that.file_list[0]=res.data.data.img;
        })
    },
    open (id = 0) {
      this.id = id
      this.visible = true
      this.$nextTick(() => {
        this.loadData()
      })
    },
    onClose () {
      this.$refs.form.resetFields()
    },
    loadData () {
      this.loading = true
      this.file_list = []
      Promise.all([
        getGoodsClassSelect(),
        getGoodsLocationSelect(),
        getGoods(this.id),
      ]).then(values => {
        this.$refs.form.resetFields()
        this.classList = values[0]
        this.locationList = values[1]
        if (values[2]) {
          this.formData = values[2]
          if (this.formData.dialogImageUrl !== null) {
            console.log(this.formData.dialogImageUrl)
            this.file_list = [
              {
                name: '01',
                url: this.formData.dialogImageUrl
              }
            ]
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const data = cloneDeep(this.formData)
          console.log(data)
          saveGoods(this.id, data).then(() => {
            this.visible = false
          }).finally(() => {
            this.loading = false
            this.$emit('on-submit')
          })
        } else {
          this.$message.error('请输入正确的表单')
        }
      })
    },
    createEbaySku () {
      this.formData.ebay_sku += ',' + this.randomString(Math.floor(Math.random() * 12 + 5))
    },
    randomString (e) {
      e = e || 32
      var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var a = t.length
      var n = ''
      for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
      return n
    },
  },
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>
