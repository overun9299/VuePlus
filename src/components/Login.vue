<template>
  <div class="login_container">
      <div class="login_box">
          <!-- 头像区域 -->
          <div class="avatar_box">
              <img src="../assets/logo.png" alt="">
          </div>
          <!-- 登录表单区域 -->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
              <!-- 用户名 -->
              <el-form-item prop="phoneNum">
                  <el-input v-model="loginForm.phoneNum" prefix-icon="iconfont icon-user"></el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item prop="password">
                  <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
              </el-form-item>
              <!-- 按钮区域 -->
              <el-form-item class="btns">
                  <el-button type="success" class="wechatLogin" circle  @click="wechatLoginDialogVisible = true">
                    <i class="iconfont icon-weixindenglu"></i>
                  </el-button>
                  <el-button type="primary" @click="login">登录</el-button>
                  <el-button type="info" @click="resetLoginForm">重置</el-button>
              </el-form-item>
          </el-form>
      </div>

    <!-- 微信登录弹出框 -->
    <el-dialog title="微信扫码登录" :visible.sync="wechatLoginDialogVisible" width="30%" :before-close="wechatLoginHandleClose">

      <wxlogin :appid="'wx7287a60bb700fd21'" :scope="'snsapi_login'"  :redirect_uri="encodeURIComponent('http://localhost:9299/#/login')" ></wxlogin>

    </el-dialog>
  </div>

</template>

<script>

import "@/assets/iconfont/iconfont.css"
import wxlogin from 'vue-wxlogin';

export default {
  components: {wxlogin},
        data() {
            return {
              // 微信登录弹出框
              wechatLoginDialogVisible: false,
                // 这是登录表单的数据绑定对象
                loginForm: {
                    phoneNum: '',
                    password: ''
                },
                // 这是表单的验证规则对象
                loginFormRules: {
                    // 验证用户名是否合法
                    phoneNum: [
                        { required: true, message: '请输入登录名称', trigger: 'blur' },
                        { min: 11, max: 11, message: '长度在11个字符', trigger: 'blur' }
                    ],
                    // 验证密码是否合法
                    password: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },


    created () {

      // 微信登录
      if (this.$route.query.code) {
        this.axios({
          method: 'post',
          url: 'ms/user/user/WxCallback',
          params: {code:this.$route.query.code}
        }).then((res) => {
          if (res.data.success) {
            this.$message.success("登陆成功")
            // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
            console.log(res.data);
            window.sessionStorage.setItem('token', res.data.token)
            window.sessionStorage.setItem('userId', res.data.data.id)
            // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
            this.$router.push('/home')
          } else {
            return this.$message.error(res.data.msg)
          }
        }).catch((err) => {
          console.log(err)
        })

      }
      // if (this.$route.query.code) {
      //   this.code = this.$route.query.code
      //   let params = {}
      //   params.appid = this.appid
      //   params.secret = this.secret
      //   params.code = this.code
      //   params.grant_type = 'authorization_code'
      //   getAccessToken(params).then((res) => {
      //     if (res.code === 0) {
      //       this.$cookie.set('token', res.token)
      //       this.$router.replace({ name: 'home' })
      //     } else if (res.code === 500) {
      //       this.dialogVisible4 = true
      //       this.openId = res.openId
      //     } else {
      //       this.$message({
      //         message: res.msg,
      //         type: 'error'
      //       })
      //     }
      //   })
      // }

  },


  methods: {
            // 点击重置按钮，重置登录表单
            resetLoginForm() {
                // console.log(this);
                this.$refs.loginFormRef.resetFields()
            },

            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid){ return } {
                        this.axios({
                            method: 'post',
                            url: 'ms/user/user/accredit',
                            params: this.loginForm
                        }).then((res) => {
                            if (res.data.success) {
                                this.$message.success("登陆成功")
                                // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
                              window.sessionStorage.setItem('token', res.data.token)
                              window.sessionStorage.setItem('userId', res.data.data.id)
                                // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                                this.$router.push('/home')
                            } else {
                                return this.$message.error(res.data.msg)
                            }
                        }).catch((err) => {
                          console.log(err)
                        })
                    }
                    //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                    //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
                    //

                    //
                })
            },
          // 微信登录弹出框关闭
          wechatLoginHandleClose(done) {
            done();
          },
        }
    }
</script>

<style lang="less" scoped>


    .wechatLogin {
      position: absolute;
      left: -252px;
    }
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        /** 设置圆角 **/
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        /** 相对居中 **/
        transform: translate(-50%, -50%);

        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            /*设置扩散*/
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            /** 相对居中 **/
            transform: translate(-50%, -50%);
            background-color: #fff;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>
