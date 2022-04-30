<template>
    <div id="shopping_cart">
        <el-container>
            <el-header>
                <Preamble :index="index"></Preamble>
            </el-header>
            <el-main>
                <div class="cart" v-if="id == 0">
                    <el-table
                        :data="this.$store.state.cart"
                        border
                        style="width: 100%"
                        :header-cell-style="headClass"
                    >
                        <el-table-column label="封面" align="center">
                            <template slot-scope="scope">
                                <img
                                    :src="scope.row.good[0].feimg"
                                    :alt="scope.row.good[0].name"
                                    :style="{ width: '500px', height: '200px' }"
                                    @click="getDetail(scope.row.good[0].id)"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="名称" align="center" width="180">
                            <template slot-scope="scope">
                                <span>{{ scope.row.good[0].name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            width="180"
                            label="单价"
                            align="center"
                        ></el-table-column>
                        <el-table-column label="总价" align="center" width="180">
                            <template slot-scope="scope">
                                <span>{{ scope.row.num * scope.row.price }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" align="center" width="210">
                            <template slot-scope="scope">
                                <el-input-number
                                    v-model="scope.row.num"
                                    @change="(val, oval) => handleChange(val, oval, scope.row)"
                                    :min="1"
                                    :max="1000"
                                ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="160">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.row)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="table_below">
                        <span>
                            共
                            <span class="total">{{ this.$store.state.cart.length }}</span>
                            件商品,
                        </span>
                        <span>
                            总价格为:￥
                            <span class="price">{{ this.$store.getters.total }}</span>
                        </span>
                        <el-button type="danger" @click="makeOrder()">生成订单</el-button>
                    </div>
                </div>
                <div v-else>
                    <Detail :id="id"></Detail>
                </div>
            </el-main>
            <el-footer>
                <Bottom></Bottom>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import Preamble from '../components/Preamble.vue';
import Bottom from '../components/Bottom.vue';
import Detail from '../components/Detail.vue';
import { checkLogin } from '../plugins/ckeckLogin.js';
export default {
    name: 'Shopping_cart',
    components: {
        Preamble,
        Bottom,
        Detail,
    },
    data() {
        return {
            index: '/shopping_cart',
            id: 0,
        };
    },
    methods: {
        // 删除商品
        handleDelete(item) {
            let iduser = this.$store.state.uid;
            let token = sessionStorage.getItem('token');
            let gid = item.gid;
            const obj = {
                iduser,
                token,
                gid,
            };
            this.$store.dispatch('delete', obj);
        },
        // 增加或减少商品(注意传值的方法)
        handleChange(val, oval, item) {
            console.log(val, oval, item);
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
            if (val < oval) {
                this.$store.dispatch('reduce', obj);
            } else {
                this.$store.dispatch('add', obj);
            }
        },
        // 商品详情页
        getDetail(id) {
            this.id = id;
        },
        // 商品详情
        setId() {
            this.id = 0;
        },
        // 生成订单
        makeOrder() {
            if (checkLogin) {
                let iduser = this.$store.state.uid;
                let token = sessionStorage.getItem('token');
                const obj = {
                    iduser,
                    token,
                };
                this.$store.dispatch('order', obj);
                this.$message.success('商城订单成功');
            } else {
                this.$message.warning('请先登录');
            }
        },
        headClass() {
            //表头居中显示
            return 'text-align:center';
        },
    },
    mounted() {
        this.$bus.$on('setId', this.setId);
    },
    beforeDestroy() {
        this.$bus.$off('setId');
    },
};
</script>

<style scoped>
.descriptions {
    text-align: center;
}
.table_below {
    width: 90%;
    height: 40px;
    line-height: 40px;
    margin: 10px 0px;
}
.table_below button {
    position: absolute;
    right: 20px;
}
.total,
.price {
    color: red;
}
</style>
