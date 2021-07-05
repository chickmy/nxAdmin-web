<style lang="scss">
@import './index.scss';
</style>

<template>
  <div class="upload-queue">
    <el-row>
      <el-button type="primary" @click="allRemove">全部删除</el-button>
    </el-row>
    <span style="color: #999;">图片格式：JPG, JPEG, PNG; 图片大小不能超过3M；图片建议尺寸：800x800；<br></span>
    <div class="el-upload-list el-upload-list--picture-card">
      <div class="el-upload-list__item" v-for="(item, index) in imgList" :key="index">
        <div>
          <img v-if="item.img === ''" src="./img/null.png" class="el-upload-list__item-thumbnail transparent">
          <img v-else :src="item.img" class="el-upload-list__item-thumbnail transparent">
          <div v-if="item.img === ''" style="position: absolute;top: 35%; left: 25%;">请上传图片</div>
          <div class="img-text">{{ item.value }}</div>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click.stop="handlePreview(item.img)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span @click.stop="handAgainUp(item, index)">
              <i class="el-icon-upload2"></i>
            </span>
            <span class="el-upload-list__item-delete" @click.stop="handleRemove(item, index)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
    <my-upload
      @change="handleSuccess"
      @dialog-cancel="uploadPageVisible=false"
      :action="action"
      :upload-page-visible="uploadPageVisible"
      :multiple="true"
    >
    </my-upload>
  </div>
</template>

<script>

import MyUpload from '@/components/my-upload/index'
export default {
  name: 'ElUploaSkudImg',
  components: { MyUpload },
  props: {
    action: {
      type: String,
      default: 'https://jsonplaceholder.typicode.com/posts/'
    },
    list: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      imgList: this.list,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadPageVisible: false,
      tempImgId: -1,
    }
  },
  watch: {
    list: function () {
      this.imgList = this.list
    }
  },
  methods: {
    updateList (list) {
      this.$emit('change', list)
    },
    handleSuccess (res) {
      if (!res.status) {
        this.$message.error('上传失败!')
        return
      }
      let url = res.file.real_path
      this.imgList[this.tempImgId].img = url
      this.$emit('change', this.imgList)
      this.tempImgId = -1
      this.uploadPageVisible = false
    },

    handleRemove (file, index) {
      this.imgList[index].img = ''
      this.$emit('change', this.imgList)
    },

    handlePreview (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },

    handAgainUp (file, index) {
      this.uploadPageVisible = true
      this.tempImgId = index
    },

    uploadPage () {
      this.uploadPageVisible = true
    },

    allRemove () {
      (this.imgList).forEach(function (val) {
        val.img = ''
      })
    },
  }
}
</script>
