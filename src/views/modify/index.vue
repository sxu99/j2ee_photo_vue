<template>
  <div class="app-container">

    <el-radio-group v-model="typeRadio" @change="onChangeType">
      <el-radio-button label="图片相关"></el-radio-button>
      <el-radio-button label="用户相关"></el-radio-button>
    </el-radio-group>

    <el-table v-if="typeRadio=='图片相关'" border ref="list" :data="list" style="width: 100%; margin-top: 25px;">
      <el-table-column sortable prop="bjsOperate" label="操作时间">
      </el-table-column>
      <el-table-column prop="userId" label="操作用户">
      </el-table-column>
      <el-table-column prop="operation" label="操作内容">
      </el-table-column>
      <el-table-column prop="photoId" label="对应图像">
      </el-table-column>
    </el-table>

    <el-table v-if="typeRadio=='用户相关'" border ref="list" :data="list" style="width: 100%; margin-top: 25px;">
      <el-table-column sortable prop="bjsOperate" label="操作时间">
      </el-table-column>
      <el-table-column prop="userId" label="操作用户">
      </el-table-column>
      <el-table-column prop="operation" label="操作内容">
      </el-table-column>
      <el-table-column prop="userId" label="对应用户">
      </el-table-column>
    </el-table>

    <div style="text-align:right; margin-top: 5px;">
      <el-pagination :pager-count="5" @size-change="onChangePageSize" :page-sizes="[5, 10, 15]"
      :page-size="pageSize" @current-change="onChangePage" :current-page.sync="page" style="float:right;" layout="sizes, prev, pager, next"
        :page-count="totalPageNum">
      </el-pagination>
    </div>

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
    getUserLogList,
    getPhotoLogList
  } from '@/api/log'

  export default {
    data() {
      return {
        typeRadio: '图片相关',
        list: [],
        totalPageNum: 1,
        page: 1,
        pageSize:5
      }
    },
    methods: {
      // 调整分页大小
      onChangePageSize(e){
        this.pageSize=e
        var data={
          page:this.page,
          size:this.pageSize
        }

        if (this.typeRadio == '图片相关') {
          getPhotoLogList(data).then(response => {
            var list = response.data.list
            for (var i = 0, len = list.length; i < len; i++) {
              var time = new Date(list[i]['bjsOperate']).format("yyyy-MM-dd hh:mm:ss");
              list[i]['bjsOperate'] = time
            }
            this.totalPageNum = response.data.pages
            this.list = list
          })
        } else {
          getUserLogList(data).then(response => {
            var list = response.data.list
            for (var i = 0, len = list.length; i < len; i++) {
              var time = new Date(list[i]['bjsOperate']).format("yyyy-MM-dd hh:mm:ss");
              list[i]['bjsOperate'] = time
            }
            this.totalPageNum = response.data.pages
            this.list = list
          })
        }
      },

      // 页面切换
      onChangePage(e) {
        this.page = e
        this.$refs.list.clearSort()
        this.$refs.list.clearFilter()
        var data={
          page:e,
          size:this.pageSize
        }

        if (this.typeRadio == '图片相关') {
          getPhotoLogList(data).then(response => {
            var list = response.data.list
            for (var i = 0, len = list.length; i < len; i++) {
              var time = new Date(list[i]['bjsOperate']).format("yyyy-MM-dd hh:mm:ss");
              list[i]['bjsOperate'] = time
            }
            this.totalPageNum = response.data.pages
            this.list = list
          })
        } else {
          getUserLogList(data).then(response => {
            var list = response.data.list
            for (var i = 0, len = list.length; i < len; i++) {
              var time = new Date(list[i]['bjsOperate']).format("yyyy-MM-dd hh:mm:ss");
              list[i]['bjsOperate'] = time
            }
            this.totalPageNum = response.data.pages
            this.list = list
          })
        }
      },

      // 处理详情页跳转
      handleClick(e) {
        this.$router.push({
          name: '课程详情',
          params: {
            courseId: e.id
          }
        })
      },

      // 类型切换
      onChangeType(e) {
        this.$refs.list.clearSort()
        this.$refs.list.clearFilter()
        this.typeRadio = e
        if (e == '图片相关') {
          getPhotoLogList().then(response => {
            var list = response.data.list
            for (var i = 0, len = list.length; i < len; i++) {
              var time = new Date(list[i]['bjsOperate']).format("yyyy-MM-dd hh:mm:ss");
              list[i]['bjsOperate'] = time
            }
            this.totalPageNum = response.data.pages
            this.list = list
          })
        } else {
          getUserLogList().then(response => {
            var list = response.data.list
            for (var i = 0, len = list.length; i < len; i++) {
              var time = new Date(list[i]['bjsOperate']).format("yyyy-MM-dd hh:mm:ss");
              list[i]['bjsOperate'] = time
            }
            this.totalPageNum = response.data.pages
            this.list = list
          })
        }
      },

    },

    mounted() {
      var that = this

      getPhotoLogList().then(response => {
        var list = response.data.list
        for (var i = 0, len = list.length; i < len; i++) {
          var time = new Date(list[i]['bjsOperate']).format("yyyy-MM-dd hh:mm:ss");
          list[i]['bjsOperate'] = time
        }
        this.totalPageNum = response.data.pages
        this.list = list
      })

    }
  }
</script>
