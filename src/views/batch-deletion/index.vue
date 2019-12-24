<template>
  <div class="app-container">
    <el-table :border="true" ref="multipleTable" :data="photoList" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="ID" width="120">
      </el-table-column>
      <el-table-column prop="displayName" label="名称">
      </el-table-column>
      <el-table-column prop="uploaderName" label="上传者">
      </el-table-column>
      <el-table-column prop="bjsTakePhoto" label="上传时间">
      </el-table-column>
      <el-table-column prop="country" label="国家">
      </el-table-column>
      <el-table-column prop="position" label="地点">
      </el-table-column>
      <el-table-column prop="scale" label="比例尺">
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button type="danger" @click="onDelete">批量删除</el-button>
    </div>
  </div>
</template>

<script>
  import {
    getPhotoList,
    getScaleList,
    getCountryList,
    getSortedPhoto,
    deletePhotoList
  } from '@/api/photo'
  import {
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    data() {
      return {
        photoList: [],
        multipleSelection: []
      }
    },

    methods: {
      onDelete() {
        var ml = this.multipleSelection
        var list = []
        for (var i in ml) {
          list.push(ml[i].id)
        }
        console.log(list)
        var data = {
          photoIdList: list,
          userName: this.name
        }

        this.$confirm('此操作将永久删除这些图像, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePhotoList(data).then(response => {
            if (response.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              getPhotoList().then(response => {
                var list = response.data.list
                for (var i = 0, len = list.length; i < len; i++) {
                  var date = new Date(list[i]['bjsTakePhoto']);
                  var Y = date.getFullYear() + '-';
                  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
                    '-';
                  var D = date.getDate();
                  list[i]['bjsTakePhoto'] = Y + M + D
                  list[i]['srcList'] = [list[i].fileUrl]
                }
                this.photoList = list
              })
            }
          })
        }).catch(() => {});
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },

    mounted() {
      getPhotoList().then(response => {
        var list = response.data.list
        for (var i = 0, len = list.length; i < len; i++) {
          var date = new Date(list[i]['bjsTakePhoto']);
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          var D = date.getDate();
          list[i]['bjsTakePhoto'] = Y + M + D
          list[i]['srcList'] = [list[i].fileUrl]
        }
        this.photoList = list
      })
    }
  }
</script>
