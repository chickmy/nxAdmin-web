<template>
  <el-dialog :visible.sync="uploadPageVisible" :before-close="handleClose" title="上传/替换图片" append-to-body>
    <div style="width: 380px; margin: 0px auto;">
      <div class="panel panel-default m-t">
        <div class="panel-heading">
          <i class="el-icon-caret-right"></i>
          方式一: 上传本地图片
          <span>(支持多图)</span>
        </div>
        <div class="panel-body mt_10 text-center">
          <el-upload
            :multiple="multiple"
            :action="action"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeUpload">
            <el-button size="small" type="primary">本地上传</el-button>
          </el-upload>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "MyUpload",
  props: {
    uploadPageVisible: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    handleClose () {
      this.$emit('dialog-cancel')
    },
    beforeUpload (file) {
      const isValidFormat = ['image/jpeg', 'image/png'].indexOf(file.type) > -1
      const isLt2M = file.size / 1024 / 1024 < 2 // 2M

      if (!isValidFormat) {
        this.$message.error('图片只能是 JPG或PNG 格式!')
      } else if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isValidFormat && isLt2M
    },

    handleSuccess (res, file) {
      this.$emit('change', res)
    },

    handleError (err, file, fileList) {
      console.log(err)
      this.$message.error('上传失败!')
    },
  }
}
</script>
