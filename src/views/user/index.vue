<template>
  <div class="app-container">

    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="name" label="用户ID">
      </el-table-column>
      <el-table-column :filters="[{ text: 'admin', value: 'admin' }, { text: 'editor', value: 'editor' }]"
        :filter-method="filterTag" prop="role" label="角色">
        <template slot-scope="scope">
          <el-tag :type="ASSET_STATUS[scope.row.role].type">
            {{ASSET_STATUS[scope.row.role].status}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable prop="gmtCreate" label="创建时间">
      </el-table-column>
      <el-table-column sortable prop="gmtModify" label="修改时间">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.role=='editor'" @click="onPreUpdate(scope.row)" type="text" size="small">提升权限</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  Date.prototype.format = function(fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  import {
    updateUserRole,
    getUserList
  } from '@/api/user'
  import {
    mapGetters
  } from 'vuex'

  export default {
    data() {
      return {
        ASSET_STATUS: {
          'editor': {
            'status': 'editor',
            'type': ''
          },
          'admin': {
            'status': 'admin',
            'type': 'warning'
          }
        },
        userList: []
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },

    mounted() {

      getUserList().then(response => {
        var userList = response.data
        for (var i = 0, len = userList.length; i < len; i++) {
          var time1 = new Date(userList[i]['gmtCreate']).format("yyyy-MM-dd hh:mm:ss");
          userList[i]['gmtCreate'] = time1
          var time2 = new Date(userList[i]['gmtModify']).format("yyyy-MM-dd hh:mm:ss");
          userList[i]['gmtModify'] = time2
        }
        this.userList = userList
      })
    },
    methods: {
      filterTag(value, row) {
        return row.role === value;
      },
      onPreUpdate(e) {
        this.$confirm('是否提升用户' + e.name + '权限至admin?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var data = {
            name: e.name,
            operator:this.name
          }
          updateUserRole(data).then(response => {
            if (response.code == 200) {
              this.$message({
                type: 'success',
                message: '提升权限成功!'
              });
              getUserList().then(response => {
                var userList = response.data
                for (var i = 0, len = userList.length; i < len; i++) {
                  var time1 = new Date(userList[i]['gmtCreate']).format("yyyy-MM-dd hh:mm:ss");
                  userList[i]['gmtCreate'] = time1
                  var time2 = new Date(userList[i]['gmtModify']).format("yyyy-MM-dd hh:mm:ss");
                  userList[i]['gmtModify'] = time2
                }
                this.userList = userList
              })
            } else {
              this.$message.error(response.message);
            }
          })

        }).catch(() => {});
      }
    }
  }
</script>

<style>

</style>
