<template>
  <div class="dashboard-container">
    <el-alert v-if="checkPermission(['editor'])" title="您现在权限有限" type="warning" description="请使用管理员账户登录,以展示更多功能.在登录页找到相关信息(点击右上角头像可登出)"
      show-icon>
    </el-alert>
    <el-alert title="欢迎使用卫星图像管理系统！" type="success" show-icon>
    </el-alert>
    <div style="margin-top: 10px;font-size: 16pt;">{{ name }}你好！
      <br />
      你的权限为:
      <span v-for="role in roles" :key="role">{{ role }}</span>
    </div>

  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import checkPermission from '@/utils/permission' // 权限判断函数

  export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    methods: {
      checkPermission
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
