<template>
    <div class="personal_center">
        <el-container>
            <el-header>
                <Preamble :index="index"></Preamble>
            </el-header>
            <el-main>
                <div class="personal" v-if="this.$store.state.username != '' && id == 0">
                    <div class="personal_top">
                        <div class="personal_top_div activeDiv" @click="showDiv(0)">
                            <i class="el-icon-user el-icon--right">个人主页</i>
                        </div>
                        <div class="personal_top_div" @click="showDiv(1)">
                            <i class="el-icon-goods el-icon--right">我的订单</i>
                        </div>
                        <div class="personal_top_div" @click="showDiv(2)">
                            <i class="el-icon-lock el-icon--right">密码修改</i>
                        </div>
                        <div class="personal_top_div" @click="showDiv(3)">
                            <i class="el-icon-edit el-icon--right">信息修改</i>
                        </div>
                    </div>
                    <div class="personal_middle">
                        <div class="personal_middle_div active">
                            <el-form label-width="80px" class="form1">
                                <el-form-item label="用户名称">
                                    <el-input
                                        v-model="this.$store.state.username"
                                        prefix-icon="el-icon-user"
                                        readonly
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="收货地址">
                                    <el-input
                                        v-model="this.$store.state.address"
                                        prefix-icon="el-icon-location-outline"
                                        readonly
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="用户电话">
                                    <el-input
                                        v-model="this.$store.state.phone"
                                        prefix-icon="el-icon-mobile-phone"
                                        readonly
                                    ></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="personal_middle_div">
                            <div class="ordertop">
                                <div><i class="el-icon-box">订单号</i></div>
                                <div><i class="el-icon-timer">时间</i></div>
                                <div><i class="el-icon-turn-off">状态</i></div>
                                <div><i class="el-icon-coin">总价格</i></div>
                                <div><i class="el-icon-edit-outline">操作</i></div>
                            </div>
                            <div class="orderlist" v-for="item in order" :key="item.idorder">
                                <span>{{ item.idorder }}</span>
                                <span>{{ item.pldate }}</span>
                                <span>{{ item.type }}</span>
                                <span>￥{{ item.toprice }}</span>
                                <span>
                                    <el-button
                                        type="danger"
                                        v-show="item.type !== '已支付'"
                                        @click="payOrder(item)"
                                    >
                                        订单支付
                                    </el-button>
                                    <el-button v-show="item.type == '已支付'">已支付</el-button>
                                </span>
                            </div>
                            <div class="block">
                                <el-pagination
                                    @current-change="handleCurrentChange"
                                    :current-page.sync="page"
                                    :page-size="3"
                                    :total="total"
                                    layout="total, prev, pager, next"
                                ></el-pagination>
                            </div>
                        </div>
                        <div class="personal_middle_div">
                            <el-form
                                :model="form3"
                                :rules="form3rules"
                                ref="form3"
                                label-width="80px"
                                class="form3"
                            >
                                <el-form-item label="用户电话" prop="phone">
                                    <el-input v-model="form3.phone"></el-input>
                                </el-form-item>
                                <el-form-item label="旧密码" prop="keyword">
                                    <el-input type="password" v-model="form3.keyword"></el-input>
                                </el-form-item>
                                <el-form-item label="新密码" prop="newpassword">
                                    <el-input
                                        type="password"
                                        v-model="form3.newpassword"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="updatePassword()">
                                        确认修改
                                    </el-button>
                                    <el-button @click="resetForm('form3')">重置</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="personal_middle_div">
                            <el-form ref="form4" label-width="80px" class="form4">
                                <el-form-item label="用户名称">
                                    <el-input
                                        v-model="user_name"
                                        prefix-icon="el-icon-user"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="用户电话">
                                    <el-input
                                        v-model="phone"
                                        prefix-icon="el-icon-mobile-phone"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="用户地址">
                                    <el-input
                                        v-model="address"
                                        prefix-icon="el-icon-location-outline"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="updateUserInfor()">
                                        确认修改
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <!-- 详情页没有用到 -->
                <div class="detail" v-else-if="this.$store.state.username != '' && id != 0">
                    <Detail :id="id"></Detail>
                </div>
                <div class="noLogin" v-else>请先登录...</div>
            </el-main>
            <el-footer>
                <Foot></Foot>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import Preamble from '../components/Preamble.vue';
import Bottom from '../components/Bottom.vue';
import Detail from '../components/Detail.vue';
export default {
    name: 'Personal_center',
    components: {
        Preamble,
        Bottom,
        Detail,
    },
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
            id: 0,
            index: '/personal_center',
            page: 1,
            limit: 3,
            total: 0,
            order: [],
            form3: {
                phone: '',
                keyword: '',
                newpassword: '',
            },
            form3rules: {
                phone: [{ required: true, message: '请输入用户电话', trigger: 'blur' }],
                keyword: [
                    { required: true, message: '请输入用户旧密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 18,
                        message: '密码,以字母开头,长度在6~18之间,只能包含字母、数字和下划线',
                        trigger: 'blur',
                    },
                ],
                newpassword: [
                    { required: true, message: '请输入用户旧密码', trigger: 'blur' },
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
    // 计算属性双向绑定vuex中的值
    computed: {
        user_name: {
            get() {
                return this.$store.state._username;
            },
            set(value) {
                this.$store.dispatch('set_Name', value);
            },
        },
        phone: {
            get() {
                return this.$store.state._phone;
            },
            set(value) {
                this.$store.dispatch('set_Phone', value);
            },
        },
        address: {
            get() {
                return this.$store.state._address;
            },
            set(value) {
                this.$store.dispatch('set_Address', value);
            },
        },
    },
    methods: {
        // 修改密码
        updatePassword() {
            this.$refs['form3'].validate(async valid => {
                if (valid) {
                    alert('submit!');
                    const obj = {
                        iduser: this.$store.state.uid,
                        token: sessionStorage.token,
                        phone: this.form3.phone,
                        password: this.form3.newpassword,
                    };
                    const res = await this.updata(obj);
                    console.log(res);
                    if (res.code == 0) {
                        this.$message.warning('请重新登录');
                        this.$store.dispatch('setName', '');
                        this.$store.dispatch('setUid', 0);
                        this.$store.dispatch('setPhone', '');
                        this.$store.dispatch('setAddress', '');
                        this.$store.commit('setCart', '');
                        this.$router.push('/');
                    } else {
                        this.$message.error('修改密码失败');
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 修改用户信息
        updateUserInfor() {
            const obj = {
                iduser: this.$store.state.uid,
                token: sessionStorage.token,
                user_name: this.user_name,
                phone: this.phone,
                address: this.address,
            };
            // console.log(obj);
            this.$store.dispatch('update', obj);
        },
        // 表单重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 更新信息
        async updata(obj) {
            const { data: res } = await this.$http.post('/user/update', obj);
            if (res.code == 0) {
                this.$message.success('修改密码成功');
                return res;
            }
        },
        // 点击选择展示的div
        showDiv(i) {
            let clickDiv = document.getElementsByClassName('personal_top_div');
            let showDiv = document.getElementsByClassName('personal_middle_div');
            console.log(i);
            for (let j = 0; j < showDiv.length; j++) {
                clickDiv[j].className = 'personal_top_div';
                showDiv[j].className = 'personal_middle_div';
            }
            clickDiv[i].className = 'personal_top_div activeDiv';
            showDiv[i].className = 'personal_middle_div active';
            if (i == 1 && this.$store.state.user_name != '') {
                this.getAllOrder();
                this.getTotal();
            }
        },
        // 获取所有的订单
        async getAllOrder() {
            let iduser = this.$store.state.uid;
            let token = sessionStorage.token;
            const { data: res } = await this.$http.post('/order/getAllOrder', {
                iduser,
                token,
                page: this.page,
                limit: this.limit,
            });
            if (res.code == 0) {
                console.log(res);
                this.order = res.data.order_details;
                this.order = this.order.reverse();
                // const arr1 = [];
                // const arr2 = [];
                // for (let i = 0; i < this.order.length; i++) {
                //     if (this.order[i].type == '未支付') {
                //         arr1.push(this.order[i]);
                //     } else {
                //         arr2.push(this.order[i]);
                //     }
                // }
                // console.log(arr1, arr2);
                // this.$message.success('获取所有订单成功');
            } else {
                this.$message.error('获取所有订单失败');
            }
        },
        // 改变订单页
        handleCurrentChange(val) {
            this.page = val;
            this.getAllOrder();
        },
        // 初始化total
        async getTotal() {
            const { data: res } = await this.$http.post('/order/GetOrdersNum', {
                iduser: this.$store.state.uid,
            });
            if (res.code == 0) {
                console.log(res);
                this.total = res.data.num;
            } else {
                console.log('未获取到total');
            }
        },
        // 支付订单
        async payOrder(item) {
            if (item.type == '已支付') {
                this.$message.warning('此订单已支付');
                return false;
            }
            const { data: res } = await this.$http.post('/order/PayOrder', {
                iduser: this.$store.state.uid,
                token: sessionStorage.token,
                idorder: item.idorder,
            });
            if (res.code == 0) {
                console.log(res);
                this.$message.success('支付订单成功');
                this.getAllOrder();
                this.getTotal();
            } else {
                this.$message.error('支付订单失败');
            }
        },
    },
    mounted() {
        if (this.$store.state.user_name != '') {
            this.getAllOrder();
            this.getTotal();
        }
    },
};
</script>

<style scoped>
.personal {
    width: 80%;
    height: 80vh;
    margin: 0px auto;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.personal_top {
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: space-between;
    /* border: 1px solid red; */
    margin: 35px 0px 0px 0px;
}
.personal_top div {
    width: 24%;
    height: 100%;
    text-align: center;
    line-height: 58px;
    /* border: 1px solid red; */
}
.personal_top_div:hover {
    color: aqua;
}
.personal_middle {
    width: 100%;
    height: 80%;
    /* border: 1px solid red; */
}
.personal_middle_div {
    width: 100%;
    height: 100%;
    display: none;
    /* border: 1px solid red; */
}
.active {
    display: block;
}
.activeDiv {
    border-bottom: 2px solid aqua;
    color: aqua;
}
.form1,
.form3,
.form4 {
    margin: 12% 0px;
}
.noLogin {
    text-align: center;
    margin: 30px auto;
    color: aqua;
}
.ordertop {
    width: 100%;
    height: 20px;
    line-height: 20px;
    margin: 20px 0px;
    display: flex;
    justify-content: space-between;
}
.ordertop div {
    width: 24%;
    height: 20px;
    line-height: 20px;
    text-align: center;
}
.ordertop div:hover {
    color: aqua;
}
.orderlist {
    width: 99%;
    height: 25%;
    margin: 22px auto;
    border: 1px solid aqua;
    border-radius: 5px;
    /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
}
.orderlist span {
    display: inline-block;
    width: 20%;
    height: 110px;
    text-align: center;
    line-height: 110px;
}
.block {
    position: absolute;
    bottom: 55px;
}
</style>
