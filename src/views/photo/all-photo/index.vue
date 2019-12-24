<template>
  <div class="app-container">
    <div style="margin-top: 10px;">
      <el-input style="width: 200px;margin-top: 10px;" placeholder="图片名称" v-model="sortName" clearable>
      </el-input>
      <!--      <el-select v-model="base" placeholder="选择基地">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <el-select clearable style="margin-left: 5px;margin-top: 10px;" v-model="sortCountry" placeholder="选择国家">
        <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select clearable style="margin-left: 5px;margin-top: 10px;" v-model="sortScale" placeholder="选择比例尺">
        <el-option v-for="item in scaleList" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
      style="margin-left: 5px;margin-top: 10px;width: 400px;"
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>

      <el-button @click="onFilter" type="primary" style="margin-left: 20px;">查询</el-button>
    </div>

    <el-divider></el-divider>
    <div class="card-container">

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
    deletePhoto,
    getPhotoList,
    getScaleList,
    getCountryList,
    getSortedPhoto
  } from '@/api/photo'
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
        sortName: '',
        sortScale: '',
        sortCountry: '',
        dateRange:null
      }
    },
    methods: {
      checkPermission,

      onFilter() {
        if(this.dateRange){
        var dateBegin= this.dateRange[0]
        var dateEnd= this.dateRange[1]
        var data = {
          country: this.sortCountry,
          displayName: this.sortName,
          scale: this.sortScale,
          dateBegin:dateBegin,
          dateEnd:dateEnd
        }
        }else{
          var data = {
            country: this.sortCountry,
            displayName: this.sortName,
            scale: this.sortScale,
            dateBegin:null,
            dateEnd:null
          }
        }
        getSortedPhoto(data).then(response => {
          var list = response.data.list
          for (var i = 0, len = list.length; i < len; i++) {
            list[i]['srcList'] = [list[i].fileUrl]
          }
          this.photoList = list
        })
      },
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
            this.$router.push({
              name: 'Edit',
              params: {
                photoId: this.tempPhotoId
              }
            })
            break;
          case "delete":
            var data = {
              photoId: this.tempPhotoId,
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
                  getPhotoList().then(response => {
                    var list = response.data.list
                    for (var i = 0, len = list.length; i < len; i++) {
                      var date = new Date(response.data['bjsTakePhoto']);
                      var Y = date.getFullYear() + '-';
                      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
                        '-';
                      var D = date.getDate();
                      response.data['bjsTakePhoto'] = Y + M + D
                      list[i]['srcList'] = [list[i].fileUrl]
                    }
                    this.photoList = list
                  })
                }
              })
            }).catch(() => {});
            break;
          default:
            console.log("err")
        }
      }

    },
    mounted() {
      getPhotoList().then(response => {
        var list = response.data.list
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
      getScaleList().then(response => {
        this.scaleList = response.data
      })
      getCountryList().then(response => {
        this.countryList = response.data
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
