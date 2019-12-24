<template>
  <div style="display: flex;flex-direction: column; height: 100%;  box-sizing: border-box ; position: relative;">

    <el-row class="row" style="background-color: rgb(244,244,244);padding-top: 20px;padding-bottom: 20px;">
      <el-col :xs="24" :sm="16" :md="12" :lg="12" :xl="12">
        <div class="header">
          <div style="display: flex;flex-direction: row;">
            <el-avatar :size="50" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <div style="display: flex;flex-direction: column;align-items: flex-start;justify-content: space-between; margin:5px 5px;">
              <span class="title">{{photoDetail.displayName}}</span>
              <span class="uploader">uploaded by {{photoDetail.uploaderName}}</span>
            </div>
          </div>
          <el-button @click="onFavor" size="small" v-if="!isFavored" icon="el-icon-star-off">收藏</el-button>
          <el-button @click="onUnFavor" size="small" v-if="isFavored" type="warning" icon="el-icon-star-on">已收藏</el-button>
        </div>
      </el-col>
    </el-row>


    <el-row class="row" style="margin:20px 20px;">
      <el-col :xs="24" :sm="16" :md="12" :lg="12" :xl="12">
        <el-image :preview-src-list="photoDetail.srcList" fit="contain" :src="photoDetail.fileUrl" class="img">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </el-col>
    </el-row>

    <el-row :gutter="0" class="row-bottom" style="background-color: rgb(244,244,244);padding-top: 20px;padding-bottom: 20px;">
      <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
        <div class="bottom-icon">
          <div class="icon-and-text">
            <i class="el-icon-map-location" style="color: dimgray;font-weight: bold;"></i>
            <span class="desp-text">{{photoDetail.country}}</span>
          </div>
          <div class="icon-and-text">
            <i class="el-icon-time" style="color: dimgray;font-weight: bold;"></i>
            <span class="desp-text"> {{photoDetail.bjsTakePhoto}}</span>
          </div>
          <div class="icon-and-text">
            <i class="el-icon-c-scale-to-original" style="color: dimgray;font-weight: bold;"></i>
            <span class="desp-text"> {{photoDetail.scale}}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="0" :sm="8" :md="4" :lg="4" :xl="4">
        <el-button-group style="float:right;">
          <el-button @click="onEdit" :disabled="!checkPermission(['admin'])" icon="el-icon-edit"></el-button>
          <el-button @click="onDelete" :disabled="!checkPermission(['admin'])" icon="el-icon-delete"></el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <el-row :gutter="0" class="row-bottom" style="background-color: rgb(244,244,244);">
      <el-col :xs="24" :sm="0" :md="0" :lg="0" :xl="0">
        <el-button-group style="margin-left: 20px;">
          <el-button @click="onEdit" :disabled="!checkPermission(['admin'])" icon="el-icon-edit"></el-button>
          <el-button @click="onDelete" :disabled="!checkPermission(['admin'])" icon="el-icon-delete"></el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <el-row :gutter="0" class="row-bottom" style="padding-top: 10px; background-color: rgb(244,244,244);padding-bottom: 50px;height: 100%;">
      <el-col :xs="24" :sm="16" :md="12" :lg="12" :xl="12" style="margin-left: 20px;margin-right: 20px;">
        <div class="title" style="margin-bottom: 10px; color: black;">详细信息</div>
        <div class="detail">
          <div class="subtitle">国家：</div>
          <div class="detail-text">{{photoDetail.country}}</div>
        </div>
        <div class="detail">
          <div class="subtitle">地点：</div>
          <div class="detail-text">{{photoDetail.position}}</div>
        </div>
        <div class="detail" v-if="photoDetail.coordinates!=null&&photoDetail.coordinates!='null'">
          <div class="subtitle">坐标：</div>
          <div class="detail-text">{{photoDetail.coordinates}}</div>
        </div>
        <div class="detail" v-if="photoDetail.scale!=null&&photoDetail.scale!='undefined'">
          <div class="subtitle">比例尺：</div>
          <div class="detail-text">{{photoDetail.scale}}</div>
        </div>
        <div class="detail">
          <div class="subtitle">上传时间：</div>
          <div class="detail-text">{{photoDetail.bjsTakePhoto}}</div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {
    getPhotoDetail,
    deletePhoto
  } from '@/api/photo'
  import {
    favors
  } from '@/api/favor'
  import {
    mapGetters
  } from 'vuex'
  import checkPermission from '@/utils/permission' // 权限判断函数
  export default {
    data() {
      return {
        avatorUrl: null,
        photoId: null,
        photoDetail: {},
        isFavored: false,
        dialogFormVisible: false
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    mounted() {
      this.photoId = this.$route.params.photoId
      var data = {
        photoId: this.photoId,
        userName: this.name
      }
      getPhotoDetail(data).then(response => {
        var date = new Date(response.data['bjsTakePhoto']);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate();
        response.data['bjsTakePhoto'] = Y + M + D
        response.data['fileUrl'] = response.data.fileUrl + "?" + Math.random();
        response.data['srcList'] = [response.data.fileUrl]
        this.photoDetail = response.data
        this.isFavored = response.data.favorite
        this.avatorUrl = "http://106.54.82.79:8110/avator/avator.png"
      })
    },
    methods: {
      checkPermission,

      onFavor() {
        this.isFavored = true
        var data = {
          photoId: this.photoId,
          userName: this.name
        }
        favors(data).then(response => {})
      },

      onUnFavor() {
        this.isFavored = false
        var data = {
          photoId: this.photoId,
          userName: this.name
        }
        favors(data).then(response => {})
      },

      // 删除该图像
      onDelete() {
        var data = {
          photoId: this.photoId,
          userName: this.name
        }

        this.$confirm('此操作将永久删除该图像, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePhoto(data).then(response => {
            if (response.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.$router.push({
                name: 'All Photo'
              })
            }
          })
        }).catch(() => {});
      },

      //跳转修改
      onEdit() {
        this.$router.push({
          name: 'Edit',
          params: {
            photoId: this.photoId
          }
        })
      }
    }
  }
</script>

<style>
  .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
      font-size: 14px;
  }
  .detail {
    display: flex;
    flex-direction: row;
    margin-bottom: 2px;
  }

  .detail-text {
    font-size: 13px;
    color: gray;
  }

  .subtitle {
    font-size: 13px;
    color: dimgray;
    font-weight: bold;
  }

  .bottom-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
  }

  .icon-and-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 25px;
  }

  .desp-text {
    font-size: 10pt;
    color: darkgray;
    margin-left: 5px;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;

  }

  .row-bottom {
    display: flex;
    flex-direction: row;
    justify-content: center;

  }

  .header {
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .title {
    font-family: "微软雅黑";
    font-size: 16px;
    font-weight: bold;
  }

  .uploader {
    font-family: "微软雅黑";
    font-size: 13px;
    color: gray;
  }

  .img {
    margin-bottom: 30px;

    width: 100%;
    height: 100%;
  }
</style>
