<template>
    <div id="register">
        <div id="loginForm">
            <div id="image_box"></div>
            <el-form
                :model="loginForm"
                :rules="loginFormRules"
                ref="loginForm"
                label-width="0px"
                class="login_form"
            >
                <el-form-item prop="user_name">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.user_name"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        prefix-icon="el-icon-lock"
                        v-model="loginForm.password"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input prefix-icon="el-icon-mobile" v-model="loginForm.phone"></el-input>
                </el-form-item>
                <el-form-item prop="address">
                    <el-input
                        prefix-icon="el-icon-location-outline"
                        v-model="loginForm.address"
                    ></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="register()">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Register',
    data() {
        // 自定义校验规则
        var checkPhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('不允许为空'));
            } else {
                var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!myreg.test(value)) {
                    callback(new Error('手机号格式不正确'));
                } else {
                    callback();
                }
            }
        };
        return {
            loginForm: {
                user_name: '',
                password: '',
                phone: '',
                address: '',
            },
            loginFormRules: {
                user_name: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    {
                        min: 5,
                        max: 16,
                        message: '用户名,以字母开头,允许5-16字节,允许字母数字下划线,不可重复',
                        trigger: 'blur',
                    },
                ],
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 18,
                        message: '密码,以字母开头,长度在6~18之间,只能包含字母、数字和下划线',
                        trigger: 'blur',
                    },
                ],
                phone: [{ validator: checkPhone, trigger: 'blur' }],
                address: [{ required: true, message: '请输入用户收货地址', trigger: 'blur' }],
            },
        };
    },
    methods: {
        // 注册并登录
        register() {
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    const { data: res } = await this.$http.get('/user/register', {
                        params: {
                            user_name: this.loginForm.user_name,
                            password: this.loginForm.password,
                            phone: this.loginForm.phone,
                            address: this.loginForm.address,
                        },
                    });
                    if (res.code == 0) {
                        this.$message.success('注册成功');
                        this.$router.push('/homepage');
                    } else {
                        this.$message.error('信息出现错误');
                        console.log(res);
                    }
                } else {
                    this.$message.warning('请正确填写相关用户信息!');
                }
            });
        },
    },
};
</script>

<style scoped>
#register {
    width: 100vw;
    height: 100vh;
    background-color: aqua;
}
#loginForm {
    width: 500px;
    height: 400px;
    background-color: whitesmoke;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
#image_box {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url(../assets/el.png);
    background-size: 100px 100px;
}
.login_form {
    position: absolute;
    top: 70px;
    bottom: 10px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: space-between;
}
</style>
