<template>
  <div>
    <el-button type="success" @click="updateAuth">更新</el-button>
    <el-tree
        :data="MenuList"
        ref="trees"
        show-checkbox
        :default-expand-all="defaultExpandAll"
        node-key="id"
        :default-checked-keys="checkedKeys"
        :props="defaultProps">
    </el-tree>
  </div>
</template>

<script>
    export default {
      name: "Auth",
      props: ['modifiedUserId'],
      data() {
        return {
          defaultExpandAll: true,
          MenuList: [],
          checkedKeys: [],
          defaultProps: {
            children: 'children',
            label: 'label'
          }
        };
      },

      created() {
        this.getMenuList();
        this.getUserPermissionsList();
      },



      methods: {
        // 获取当前登录者所有的菜单
        async getMenuList() {
          this.axios({
            method: 'post',
            url: 'ms/user/userPermission/getUserPermissions',
            params: {userId: window.sessionStorage.getItem("userId")}
          }).then((res) => {
            if (res.data.success) {
              this.MenuList = res.data.data.tree;
            }
          })
        },


        // 获取当前登录者所有的菜单id
        async getUserPermissionsList() {
          this.axios({
            method: 'post',
            url: 'ms/user/userPermission/getUserPermissionsList',
            params: {userId: this.modifiedUserId}
          }).then((res) => {
            if (res.data.success) {
              this.checkedKeys = res.data.data.userPermissionId;
            }

          })
        },

        // 更新权限
        updateAuth() {
          console.log(this.$refs.trees.getCheckedKeys().concat(this.$refs.trees.getHalfCheckedKeys()).join(','))
          this.axios({
            method: 'post',
            url: 'ms/user/userPermission/updateUserPermissions',
            params: {
              userId: this.modifiedUserId,
              permissionsId: this.$refs.trees.getCheckedKeys().concat(this.$refs.trees.getHalfCheckedKeys()).join(',')
            }
          }).then((res) => {
            console.log(res)
          })
        }


      }
    }
</script>

<style scoped>

</style>