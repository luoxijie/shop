<template>
    <div id="homepage">
        <el-container>
            <el-header>
                <Preamble :index="index"></Preamble>
            </el-header>
            <el-main>
                <div class="home" v-show="id == 0">
                    <div class="search">
                        <el-input
                            placeholder="请输入内容"
                            v-model="keyword"
                            class="input-with-select"
                            @keyup.enter.native="search"
                        ></el-input>
                        <el-button
                            icon="el-icon-search"
                            class="searchbtn"
                            @click="search"
                            @keyup.enter.native="search"
                        ></el-button>
                    </div>
                    <div class="list">
                        <el-card
                            :body-style="{ padding: '0px', height: '280px' }"
                            shadow="hover"
                            v-for="item in list"
                            :key="item.id"
                            class="thing"
                        >
                            <img :src="item.feimg" class="image" @click="getDetail(item.id)" />
                            <div style="padding: 14px">
                                <span>{{ item.name }}</span>
                                <div class="bottom clearfix">
                                    <span class="price">￥{{ item.price }}</span>
                                    <el-button class="button" @click="add(item)">
                                        添加到购物车
                                    </el-button>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <div class="more" v-if="more">
                        <el-link type="primary" @click="getMore()">加载更多</el-link>
                    </div>
                    <div class="more" v-else>
                        <el-link disabled>没有了</el-link>
                    </div>
                </div>
                <div class="detail" v-if="id != 0">
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
export default {
    name: 'Homepage',
    components: {
        Preamble,
        Bottom,
        Detail,
    },
    data() {
        return {
            index: '/homepage',
            page: 1,
            limit: 8,
            list: [],
            keyword: '',
            more: true,
            // 商品id
            id: 0,
            detailForm: {
                brand: '',
                country: '',
                explain: '',
                type: '',
                effect: '',
                name: '',
                price: '',
            },
        };
    },
    methods: {
        // 获取商品
        async getGoodsList() {
            const res = await this.getList();
            if (res.code == 0) {
                this.$message.success('获取首页商品成功');
                this.list = res.data;
            } else {
                this.$message.error('获取商品列表失败');
            }
        },
        // 添加到购物车
        add(item) {
            if (sessionStorage.getItem('token') == undefined) {
                this.$message.warning('请先注册或登录后再进行购物');
                this.$bus.$emit('showLogin');
            } else {
                let token = sessionStorage.getItem('token');
                let iduser = this.$store.state.uid;
                let gid = item.id;
                let num = 1;
                const obj = {
                    token: token,
                    iduser: iduser,
                    gid: gid,
                    num: num,
                };
                this.$store.dispatch('add', obj);
                this.$message.success('添加成功');
            }
        },
        // 获取更多
        async getMore() {
            this.page += 1;
            const res = await this.getList();
            if (res.code == 0) {
                if (res.data.length < 8) {
                    this.more = false;
                }
                this.$message.success('获取首页商品成功');
                this.list = [...this.list, ...res.data];
            } else {
                this.$message.error('获取商品列表失败');
            }
        },
        // 点击搜索
        async search() {
            console.log(1);
            this.page = 1;
            this.list = [];
            this.more = false;
            if (this.keyword == '') {
                this.more = true;
                this.getGoodsList();
            } else {
                const res = await this.getSearchList();
                if (res.code == 0) {
                    this.$message.success('搜索商品成功');
                    this.list = [...this.list, ...res.data];
                } else {
                    this.$message.error('搜索商品失败');
                }
            }
        },
        // 获取商品
        async getList() {
            const { data: res } = await this.$http.get('/goods/getGoodsByLimit', {
                params: {
                    page: this.page,
                    limit: this.limit,
                },
            });
            console.log(res);
            return res;
        },
        // 模糊搜索
        async getSearchList() {
            const { data: res } = await this.$http.get('/goods/getGoodsBySearch', {
                params: {
                    search: this.keyword,
                    page: this.page,
                    limit: 50,
                },
            });
            console.log(res);
            return res;
        },
        // 商品详情页
        getDetail(id) {
            this.id = id;
        },
        // 修改id
        setId() {
            this.id = 0;
        },
    },
    mounted() {
        this.getGoodsList();
        this.$bus.$on('setId', this.setId);
    },
    beforeDestroy() {
        // 事件解绑
        this.$bus.$off('setId');
    },
};
</script>

<style scoped>
.search {
    width: 500px;
    height: 40px;
    display: flex;
    margin: auto;
}
.searchbtn {
    background-color: aqua;
    height: 40px;
    width: 60px;
}
.list {
    width: 90%;
    height: 95%;
    /* border: 1px solid red; */
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.price {
    font-size: 13px;
    color: red;
}
.bottom {
    margin-top: 0px;
    line-height: 25px;
}
.button {
    padding: 0;
    float: right;
    background-color: aqua;
    height: 25px;
    width: 100px;
    display: none;
}
.image {
    width: 90%;
    height: 70%;
    border-radius: 4px;
    margin: auto;
    display: block;
    position: relative;
    top: 10px;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
}
.clearfix:after {
    clear: both;
}
.more {
    width: 60px;
    height: 20px;
    margin: auto;
}
.thing {
    margin: 10px;
}
.thing:hover button {
    display: block;
}
</style>
