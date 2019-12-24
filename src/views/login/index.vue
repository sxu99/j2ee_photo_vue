<template>
  <div style="height: 100%;  box-sizing: border-box ; position: relative;">
    <div v-bind:style="{background: 'url(' + bgImg + ')'}" class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
        label-position="left">

        <div class="title-container">
          <h3 class="title">欢迎使用卫星图像管理系统</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text"
            tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="Password"
            name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <div style="display: flex;flex-direction: row;justify-content: space-between;">
          <el-button style="width:47%;margin-bottom:30px;" @click="dialogFormVisible=true">注册</el-button>
          <el-button :loading="loading" type="primary" style="width:47%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
        </div>

        <div class="tips">
          <span style="margin-right:20px;">管理员账号: admin</span>
          <span> 密码: password</span>
        </div>
        <div class="tips">
          <span style="margin-right:20px;">普通账号: editor</span>
          <span> 密码: epassword</span>
        </div>
      </el-form>

    </div>


    <el-dialog title="注册" :visible.sync="dialogFormVisible" width="350px">
      <el-form style="background-color: white;" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item style="background-color: white;" label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="background-color: white;" label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item style="display: flex;flex-wrap: wrap;">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import {
    validUsername
  } from '@/utils/validate'
  import {
    regerister
  } from '@/api/user'

  export default {
    name: 'Login',
    data() {
      // 注册时的校验
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            if (value.length < 8) {
              callback(new Error('密码需大于7位'));
            } else
              this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('请输入正确用户名'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 8) {
          callback(new Error('密码需大于7位'))
        } else {
          callback()
        }
      }
      return {
        bgImg: 'http://106.54.82.79:8110/image/bg/1.jpg',
        // 注册用表单
        ruleForm: {
          pass: '',
          checkPass: '',
          username: ''
        },
        rules: {
          pass: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur'
          }],
          username: [{
            required: true,
            trigger: 'blur',
            message: "请输入用户名"
          }],
        },
        dialogFormVisible: false,
        loginForm: {
          username: 'admin',
          password: '111111'
        },
        loginRules: {
          username: [{
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      // 提交注册表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = {
              name: this.ruleForm.username,
              password: this.ruleForm.pass
            }
            regerister(data).then(response => {
              if (response.code == 200) {
                this.$message({
                  message: "注册成功",
                  type: "success"
                })
                this.dialogFormVisible = false
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置注册表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$router.push({
                path: this.redirect || '/'
              })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    mounted() {
      var bgList = ["http://106.54.82.79:8110/image/bg/1.jpg", "http://106.54.82.79:8110/image/bg/2.jpg",
        "http://106.54.82.79:8110/image/bg/3.jpg", "http://106.54.82.79:8110/image/bg/4.jpg",
        "http://106.54.82.79:8110/image/bg/5.jpg", "http://106.54.82.79:8110/image/bg/6.jpg",
        "http://106.54.82.79:8110/image/bg/7.jpg",
      ]
      var r = Math.floor(Math.random() * 7 + 1)
      console.log(r)
      this.bgImg = bgList[r - 1]
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {

    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;



      input {
        background: transparent;
        background-color: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        //         &:-webkit-autofill {
        //
        //           input:-webkit-autofill:hover,
        //           input:-webkit-autofill:focus,
        //           input:-webkit-autofill:active {
        //             -webkit-transition-delay: 99999s;
        //             -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
        //           }
        //
        //           // background-color: rgba(0, 0, 0,0.5) !important;
        //           // box-shadow: 0 0 0px 1000px rgba(0, 0, 0,0.5) inset !important;
        //           // -webkit-text-fill-color: $cursor !important;
        //         }
      }

      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-transition-delay: 99999s;
        -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
      }

    }


    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-size: cover;

    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      // padding: 160px 35px 0;
      margin: 160px auto;
      padding: 25px 25px;
      border-radius: 10px;
      overflow: hidden;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
