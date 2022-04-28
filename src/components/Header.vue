<template>
    <div id="head">
        <div class="img" @click="toHome()"></div>
        <div class="txt">欢迎来到花花的世界</div>
        <el-menu
            :default-active="index"
            active-text-color="#000"
            class="el-menu-demo"
            mode="horizontal"
            router
        >
            <el-menu-item index="/homepage">首页</el-menu-item>
            <el-menu-item index="/shopping_centre">商城</el-menu-item>
            <el-menu-item class="user">
                <span>用户</span>
                <div class="userMsg">
                    <div class="T" v-if="name == ''">
                        <p>没有任何用户信息</p>
                        <p class="login">
                            <span class="fspan" @click="dialogVisible = true">登录</span>
                            |
                            <span class="espan" @click="register()">注册</span>
                        </p>
                    </div>
                    <div class="F" v-else>
                        <p>用户名称:{{ name }}</p>
                        <p class="quit">
                            <span type="danger" @click="quit()">退出登录</span>
                        </p>
                    </div>
                </div>
            </el-menu-item>
            <el-menu-item class="cart" index="/shopping_cart">
                <span>购物车</span>
                <div class="cartMsg" v-if="this.$store.state.cart.length != 0">
                    <div
                        class="cart_div"
                        v-for="item in this.$store.state.cart"
                        :key="item.good[0].id"
                    >
                        <div class="cart_div_left">
                            <img :src="item.good[0].feimg" :alt="item.good[0].name" />
                        </div>
                        <div class="cart_div_right">
                            <p>{{ item.good[0].name }}</p>
                            <p>
                                ￥{{ item.good[0].price }}|数量:{{ item.num }}
                                <button @click.stop="reduce(item)">-</button>
                                <button @click.stop="add(item)">+</button>
                            </p>
                        </div>
                    </div>
                </div>
            </el-menu-item>
            <el-menu-item index="/personal_center">个人中心</el-menu-item>
        </el-menu>
        <!-- 登录框 -->
        <el-dialog title="登录" :visible.sync="dialogVisible" width="30%">
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="login()">登录</el-button>
                <el-button type="danger" @click="dialogVisible = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'header',
    props: ['index'],
    data() {
        return {
            //用户未登录
            name: this.$store.state.username || '',
            dialogVisible: false,
            loginForm: {
                user_name: 'luoxijie',
                password: 'a174634',
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
            },
        };
    },
    methods: {
        register() {
            this.$router.push('/register');
        },
        // 登录
        async login() {
            const { data: res_login } = await this.$http.post('/user/login', {
                user_name: this.loginForm.user_name,
                password: this.loginForm.password,
            });
            if (res_login.code == 0) {
                // 保存token和uid
                sessionStorage.setItem('token', res_login.data.token);
                this.$message.success('登录成功');
                this.$store.dispatch('setUid', res_login.data.user[0].iduser);
                this.$store.dispatch('setName', res_login.data.user[0].user_name);
                this.$store.dispatch('setPhone', res_login.data.user[0].phone);
                this.$store.dispatch('setAddress', res_login.data.user[0].address);
                const obj = {
                    iduser: res_login.data.user[0].iduser,
                    token: res_login.data.token,
                };
                this.$store.dispatch('setCart', obj);
                this.name = this.$store.state.username;
                this.dialogVisible = false;
                console.log(res_login);
            } else {
                this.$message.error('登录失败');
                console.log(res_login);
            }
        },
        // 退出登录
        quit() {
            this.$store.dispatch('setName', '');
            this.$store.dispatch('setUid', 0);
            this.$store.dispatch('setPhone', '');
            this.$store.dispatch('setAddress', '');
            this.$store.commit('setCart', '');
            this.name = this.$store.state.username;
            sessionStorage.clear();
            if (sessionStorage.getItem('token') == undefined && this.$store.state.username == '') {
                this.$message.warning('退出登录');
            }
        },
        // 减少商品
        reduce(item) {
            let iduser = this.$store.state.uid;
            let token = sessionStorage.getItem('token');
            let num = 1;
            let gid = item.gid;
            const obj = {
                iduser,
                token,
                num,
                gid,
            };
            this.$store.dispatch('reduce', obj);
        },
        // 添加商品
        add(item) {
            let iduser = this.$store.state.uid;
            let token = sessionStorage.getItem('token');
            let num = 1;
            let gid = item.gid;
            const obj = {
                iduser,
                token,
                num,
                gid,
            };
            this.$store.dispatch('add', obj);
        },
        showLogin() {
            this.dialogVisible = true;
        },
        toHome() {
            this.$router.push('/homepage');
        },
    },
    mounted() {
        this.$bus.$on('showLogin', this.showLogin);
    },
    beforeDestroy() {
        this.$bus.$off('showLogin');
    },
};
</script>

<style scoped>
#head {
    display: flex;
    background-color: aqua;
    justify-content: space-between;
    width: 100%;
}
.img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-size: 50px 50px;
    background-image: url(../assets/el.png);
    position: relative;
    top: 33px;
    transform: translate(0%, -50%);
}
.txt {
    line-height: 60px;
    text-align: center;
}
.el-menu-demo {
    background-color: aqua;
}
.userMsg {
    display: none;
    width: 150px;
    height: 120px;
    position: absolute;
    top: 60px;
    right: -40px;
    border: 2px solid aqua;
    border-radius: 10px;
    z-index: 10;
    background-color: white;
}
.userMsg p {
    text-align: center;
    height: 35px;
    line-height: 35px;
}
.user:hover .userMsg {
    display: block;
}
.cartMsg {
    display: none;
    width: 350px;
    height: auto;
    position: absolute;
    top: 60px;
    right: -90px;
    border: 2px solid aqua;
    border-radius: 10px;
    background-color: white;
    z-index: 10;
}
.cartMsg p {
    text-align: center;
}
.cart:hover .cartMsg {
    display: block;
}
.fspan:hover {
    color: aqua;
}
.espan:hover {
    color: red;
}
.quit:hover {
    color: red;
}
.cart_div {
    width: 100%;
    height: 50px;
    display: flex;
    flex-wrap: wrap;
    margin: 3px 0px;
}
.cart_div:hover {
    background-color: whitesmoke;
}
.cart_div_left {
    width: 50%;
    height: 100%;
}
.cart_div_left img {
    width: 100%;
    height: 100%;
    position: relative;
    top: -6px;
}
.cart_div_right {
    width: 50%;
    height: 100%;
}
.cart_div_right p {
    width: 100%;
    height: 28px;
    line-height: 28px;
    margin: 0px;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.cart_div_right button {
    text-align: center;
    vertical-align: middle;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    line-height: 18px;
    position: relative;
    right: -5px;
    margin: 0px 5px;
    top: -3px;
    border: none;
    background-color: aqua;
}
.cart_div_right:hover p {
    color: aqua;
}
</style>
