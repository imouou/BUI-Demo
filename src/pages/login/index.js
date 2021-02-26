/**
 * 通用登录模板,包含输入交互,提交需要自己绑定验证
 * 默认模块名: pages/login/login
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define({
    template: function() {
        return `<style type="text/css">
        .login-page main {
            background: #fff url(images/login/login-bg.png) center bottom no-repeat;
            background-size: 100% auto;
        }
        
        .login-page .logo h1 {
            font-size: .82rem;
            padding-left: .3rem;
        }
        
        .login-page .logo {
            height: 2rem;
            margin: 1.2rem auto 1rem auto;
            text-align: center;
        }
        
        .login-page .logo img {
            height: 1rem;
        }
        
        .login-page .login-form {
            padding-left: .6rem;
            padding-right: .6rem;
        }
        
        .login-page .login-form .bui-list {
            border-top: none;
            margin-bottom: .7rem;
        }
        
        .login-page .login-form>.bui-btn {
            margin-bottom: .3rem;
        }
        
        .login-page .login-form .bui-btn-text {
            margin-bottom: .2rem;
        }
        
        .login-page .bui-list>[class*=bui-btn]:last-child {}
        
        .login-page .login-form .bui-label {
            width: 0.5rem;
            margin-right: .2rem;
        }
        
        .login-page .login-form .icon-face,
        .login-page .login-form .icon-lock {
            font-size: 0.48rem;
        }
        
        .login-page .login-form .bui-input {
            height: .6rem;
            background: none;
        }
        
        .login-page .login-form .bui-btn-text {
            text-align: center;
            color: #666666;
            font-size: 0.2rem;
        }
        
        .login-page .copyright {
            font-size: 0.17rem;
            color: #999999;
            width: 100%;
            text-align: center;
            background-color: #ffffff;
            padding-bottom: 0.25rem;
        }
        
        .login-page .icon-eye:before {
            content: "\e680"
        }
        
        .login-page .icon-eye.active:before {
            content: "\e67f"
        }
    </style>
    <div class="bui-page bui-box-vertical login-page">
        <main>
            <div class="logo bui-box-center">
                <img src="images/applogo.png" alt="">
                <h1>BUI</h1>
            </div>
            <div class="login-form">
                <ul class="bui-list">
                    <li class="bui-btn bui-box clearactive">
                        <label class="bui-label" for="user"><i class="icon-face"></i></label>
                        <div class="span1">
                            <div class="bui-input user-input">
                                <input id="user" b-value="login.form.user" type="text" placeholder="用户名">
                            </div>
                        </div>
                    </li>
                    <li class="bui-btn bui-box clearactive">
                        <label class="bui-label" for="password"><i class="icon-lock"></i></label>
                        <div class="span1">
                            <div class="bui-input password-input">
                                <input id="password" b-value="login.form.password" type="password" placeholder="密码">
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="bui-btn round primary" b-click="login.checkLogin">登录</div>
                <div class="bui-btn-text">注册</div>
                <div class="bui-btn-text">忘记密码</div>
            </div>
        </main>
    </div>`
    },
    loaded: function(require, exports, module) {

        var userInput = null,
            passwordInput = null;

        // 初始化数据行为存储
        var bs = bui.store({
            scope: "login",
            data: {
                form: {
                    user: "",
                    password: ""
                }
            },
            methods: {
                checkLogin: function() {
                    // 读取用 $data
                    var username = this.$data.form.user;
                    if (!username) {
                        bui.hint("帐号不能为空");
                        return false;
                    }
                    // console.log(username);
                    // 把用户信息传给登录窗口
                    bui.trigger("loginsuccess", this.$data.form);
                }
            },
            mounted: function() {
                var that = this;
                // 数据解析后执行
                // 手机号,帐号是同个样式名, 获取值的时候,取的是最后一个focus的值
                userInput = bui.input({
                    id: ".user-input",
                    onBlur: function() {
                        that.form.user = this.value();
                    },
                    callback: function(e) {
                        // 清空数据
                        this.empty();
                    }
                })

                // 密码显示或者隐藏
                passwordInput = bui.input({
                    id: ".password-input",
                    iconClass: ".icon-eye",
                    onBlur: function(e) {
                        if (e.target.value == '') { return false; }
                        // 注册的时候校验只能4-18位密码
                        var rule = /^[a-zA-Z0-9_-]{4,18}$/;
                        if (!rule.test(e.target.value)) {
                            bui.hint("密码只能由4-18位字母或者数字上下横杠组成");
                            return false;
                        }
                        // 跟设置同步
                        that.form.password = this.value();
                        return true;
                    },
                    callback: function(e) {
                        //切换类型
                        this.toggleType();
                        //
                        $(e.target).toggleClass("active")
                    }
                })

            }
        })

        // 输出模块
        return bs;
    }
})