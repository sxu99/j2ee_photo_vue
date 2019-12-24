<template>
  <div class="app-container">
    <div class="card-container">

      <el-alert title="暂无收藏图片" type="warning" description="快去逛逛吧!" show-icon v-if="photoList.length==0">
      </el-alert>
      <el-card v-for="(item,i) in photoList" class="card" shadow="hover" :body-style="{ padding: '0px' }">
        <el-image :preview-src-list="item.srcList" fit="cover" :src="item.fileUrl" class="image"></el-image>
        <div style="padding: 14px;">
          <span>{{item.displayName}}</span>

          <div class="bottom clearfix">
            <span style="font-size: 8pt;color: gray;">{{item.country}}</span>
            <span style="font-size: 8pt;color: gray;">{{item.position}}</span>
            <el-dropdown class="button" @command="handleCommand">
              <span @click="onClickDropdown(item)" class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="detail">详情</el-dropdown-item>
                <el-dropdown-item command="edit" v-if="checkPermission(['admin'])">修改</el-dropdown-item>
                <el-dropdown-item command="delete" divided style="color: red;" v-if="checkPermission(['admin'])">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-card>
    </div>



  </div>
</template>

<script>
  import {
    getFavorList
  } from '@/api/favor'
  import {
    mapGetters
  } from 'vuex'
  import checkPermission from '@/utils/permission' // 权限判断函数
  export default {
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    data() {
      return {
        scaleList: [],
        countryList: [],
        photoList: [],
        tempPhotoId: null,
      }
    },
    methods: {
      checkPermission,

      onClickDropdown(e) {
        this.tempPhotoId = e.id
      },

      handleCommand(e) {
        switch (e) {
          case "detail":
            this.$router.push({
              name: "Detail",
              params: {
                photoId: this.tempPhotoId
              }
            })
            break;
          case "edit":

            break;
          case "delete":

            break;
          default:
            console.log("err")
        }
      }

    },
    mounted() {
      var data = {
        userName: this.name
      }
      getFavorList(data).then(response => {
        var list = response.data
        for (var i = 0, len = list.length; i < len; i++) {
          var date = new Date(response.data['bjsTakePhoto']);
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          var D = date.getDate();
          response.data['bjsTakePhoto'] = Y + M + D
          list[i]['srcList'] = [list[i].fileUrl]
        }
        this.photoList = list
      })
    }
  }
</script>

<style>
  .card-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

  }

  .card {
    width: 310px;
    height: 100%;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 30px;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 310px;
    height: 180px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
