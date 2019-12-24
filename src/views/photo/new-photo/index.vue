<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="图像名称" prop="name">
        <el-input v-model="form.name" placeholder="天安门" />
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-input v-model="form.country" placeholder="中国" />
      </el-form-item>
      <el-form-item label="地点" prop="position">
        <el-input v-model="form.position" placeholder="北京市" />
      </el-form-item>
      <el-form-item label="经纬度" prop="coordinates">
        <el-input v-model="form.coordinates" placeholder="37.73110235N 22.75551516E(经度纬度之间用空格分隔)" />
      </el-form-item>
      <el-form-item label="比例尺" prop="scale">
        <el-input v-model="form.scale" placeholder="1:50000" />
      </el-form-item>
      <el-form-item label="上传图片">
        <input type="file" value="" id="file" @change="onPicChange">
        <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过1张</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  const TokenKey = 'j2ee_token'
  import {
    mapGetters
  } from 'vuex'
  export default {
    data() {
      return {
        form: {
          name: '',
          country: null,
          position: null,
          coordinates: null,
          scale: null,
        },
        rules: {
          name: [{
            required: true,
            message: '请输入图像名称',
            trigger: 'blur'
          }],
          country: [{
            required: true,
            message: '请输入国家',
            trigger: 'change'
          }],
          position: [{
            required: true,
            message: '请输入地点',
            trigger: 'change'
          }]
        }
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    methods: {

      onSubmit() {
        var isValid = false
        this.$refs.form.validate(valid => {
          if (valid) {
            if (!this.picFile) {
              this.$message({
                message: '请上传图片',
                type: 'error'
              })
              return false;
            } else {
              isValid = true
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
        event.preventDefault();
        let formData = new FormData();
        formData.append('displayName', this.form.name);
        formData.append('country', this.form.country);
        formData.append('position', this.form.position);
        formData.append('coordinates', this.form.coordinates);
        formData.append('scale', this.form.scale);
        formData.append('uploaderName', this.name);
        formData.append('cover', this.picFile);
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Token': Cookies.get(TokenKey)
          }
        }; //添加请求头

        var that = this

        if (isValid) {
          console.log('ok')
          this.$axios.post('http://106.54.82.79:8080/photo/new_photo', formData, config)
            .then(response => {
              let r = response.data
              if (r.code == 200) {
                this.$message({
                  message: '新建图像成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: r.message,
                  type: 'error'
                })
              }
            })
            .catch(function(error) { // 请求失败处理
              that.$message({
                message: '网络错误，请重试',
                type: 'error'
              })
            });
        }
      },

      onPicChange(e) {
        this.picFile = e.target.files[0];
      }

    },

  }
</script>

<style>
</style>
