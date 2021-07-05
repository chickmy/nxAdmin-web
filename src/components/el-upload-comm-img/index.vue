<style lang="scss">
@import './index.scss';
</style>

<template>
  <div class="upload-queue">
    <el-row>
      <el-button type="primary" @click="allChenckBox()" >全选/反全选</el-button>
    </el-row>
    <span style="color: #999;">图片格式：JPG, JPEG, PNG; 图片大小不能超过3M；图片建议尺寸：800x800；可拖拽移动图片；最多支持11张图片<br></span>
    <draggable v-model="imgList" @start="drag=true" @end="drag=false" @update="updateList(imgList)"
               class="el-upload-list el-upload-list--picture-card">
      <div class="el-upload-list__item" v-for="(item, index) in imgList" :key="index">
        <div v-on:click="changeList(item)" :class="{imgCheckBox: isCheckbox.includes(item)}">
          <img :src="item" class="el-upload-list__item-thumbnail transparent">
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click.stop="handlePreview(item)">
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
    </draggable>
    <div class="el-upload el-upload--picture-card" @click="uploadPage()">
      <i class="el-icon-plus"></i>
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
import draggable from "vuedraggable"
import MyUpload from '@/components/my-upload/index'

export default {
  name: 'ElUploadCommImg',
  components: { MyUpload, draggable },
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
      drag: false,
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      },
      dialogImageUrl: "",
      dialogVisible: false,
      uploadPageVisible: false,
      isCheckbox: [],
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
    handleSuccess (res, file) {
      if (!res.status) {
        this.$message.error("上传失败!")
        return
      }
      let url = res.file.real_path
      if (this.tempImgId === -1) {
        this.imgList.push(url)
      } else {
        this.imgList[this.tempImgId] = url
      }
      this.$emit('change', this.imgList)
      this.tempImgId = -1
      this.uploadPageVisible = false
    },
    handleRemove (file, index) {
      let i = this.isCheckbox.indexOf(file)
      this.isCheckbox.splice(i, 1)
      this.imgList.splice(index, 1)
      this.$emit('change', this.imgList)
    },

    handlePreview (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },

    handAgainUp (file, index) {
      this.uploadPageVisible = true
      this.tempImgId = index
      console.log(this.tempImgId)
    },

    changeList (url) {
      let i = this.isCheckbox.indexOf(url)
      if (i === -1) {
        this.isCheckbox.push(url)
      } else {
        this.isCheckbox.splice(i, 1)
      }
    },

    allChenckBox () {
      if (this.isCheckbox.length === this.imgList.length) {
        this.isCheckbox = []
      } else {
        this.isCheckbox = this.imgList
      }
    },

    uploadPage () {
      this.tempImgId = -1

      this.uploadPageVisible = true
    }
  }
}
</script>
