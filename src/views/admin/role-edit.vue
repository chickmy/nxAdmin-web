<template>
    <el-dialog :visible.sync="visible" @close="onClose" title="角色编辑" width="500px" footer-hide :styles="{top: '20px'}">
      <el-form ref="form" :model="formData" :rules="rules" label-width="80px" v-loading="loading">
        <el-form-item label="类型" prop="genre" v-show="!id">
          <el-select v-model="formDataGenre" placeholder="请选择角色类型">
            <el-option v-for="item in rolesGenre" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-checkbox v-model="formDataStatus"><span style="padding-left: 4px">启用</span></el-checkbox>
        </el-form-item>
        <el-form-item label="权限">
          <div class="radius">
            <el-tree ref="tree"
                     show-checkbox
                     highlight-current
                     :render-content="renderContent"
                     node-key="name"
                     :data="treeData"
                     :props="{children: 'children',label: 'name'}"
            ></el-tree>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import { saveRole, getRole, getPermissions } from '@api/admin/admin'
import { ADMIN_ROLES_GENRE, ADMIN_USER_ROLE_MAPPING, toLabelValue } from '@/store/constant'
import store from '@/store'

export default {
  name: 'RoleEdit',
  data () {
    return {
      id: 0,
      rolesGenre: toLabelValue(ADMIN_ROLES_GENRE).filter(d => {
        const genre = store.state.d2admin.user.info.user.genre
        return d.value >= ADMIN_USER_ROLE_MAPPING[genre]
      }),
      visible: false,
      loading: false,
      formData: {
        genre: ADMIN_USER_ROLE_MAPPING[store.state.d2admin.user.info.user.genre],
        name: '',
        status: 0,
        ext: {
          permission: [],
        },
      },
      rules: {
        genre: [
          { type: 'number', min: 1, message: '请选择一个项目', required: true },
        ],
        name: [
          { type: 'string', min: 2, message: '请填写角色名称（最少两个字符）', required: true },
        ],
      },
      treeData: [],
      treeCheckedKeys: [],
    }
  },
  computed: {
    formDataStatus: {
      get: function () {
        return this.formData.status === 0
      },
      set: function (newValue) {
        this.formData.status = newValue ? 0 : 1
      },
    },
    formDataGenre: {
      get: function () {
        return this.formData.genre === 0 ? null : this.formData.genre
      },
      set: function (newValue) {
        this.formData.genre = newValue || 0
      },
    },
  },
  methods: {
    open (id = 0) {
      this.id = id
      this.render()
      this.visible = true
    },
    onClose () {
      this.$refs.form.resetFields()
    },
    renderContent (h, { data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%',
        },
      }, `${data.name} (${data.desc ? data.desc : 'null'})`)
    },
    render () {
      this.loading = true
      Promise.all([getRole(this.id), getPermissions()]).then(async values => {
        const role = values[0]
        if (role) {
          if (Array.isArray(role.ext)) {
            role.ext = {}
          }
          this.formData = role
          if (Array.isArray(role.ext.permission)) {
            this.treeCheckedKeys = role.ext.permission
          }
        }
        this.treeData = values[1]
        await this.$nextTick()
        this.$refs.tree.setCheckedKeys(this.treeCheckedKeys.filter(key => {
          const node = this.$refs.tree.getNode(key)
          if (!node) {
            return false
          }
          return node.isLeaf
        }))
      }).finally(() => {
        this.loading = false
      })
    },
    submit () {
      this.treeCheckedKeys = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.formData.ext.permission = this.treeCheckedKeys
          saveRole(this.id, this.formData)
            .then(() => {
              this.visible = false
            }).finally(() => {
              this.loading = false
              this.$emit('on-submit')
            })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style scoped>
  .radius {
    border: 1px solid #d7dae2;
    border-radius: 4px;
    line-height: 1.5;
  }
</style>
