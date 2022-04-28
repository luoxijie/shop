<template>
    <div id="detail">
        <div class="top">
            <span class="back" @click="back()"><i class="el-icon-back">返回</i></span>
            <span class="top_center">商品详情</span>
        </div>
        <div class="middle">
            <div class="capital">
                <div class="capital_img">
                    <img :src="msg.feimg" :alt="msg.name" />
                    <p>{{ msg.name }}</p>
                </div>
                <div class="capital_txt">
                    <div class="capital_txt1">
                        <span>类别:{{ msg.type }}</span>
                        <span>|</span>
                        <span>所属国家:{{ msg.country }}</span>
                    </div>
                    <div class="capital_txt2">
                        <span>￥{{ msg.price }}</span>
                    </div>
                    <div class="capital_txt3">
                        <p>包邮政策:本商品单件包邮（新疆部分区域除外）</p>
                        <p>服务政策:本商品不支持退货</p>
                        <p>
                            国家药监局提示:化妆品不能宣称医疗作用，也没有治疗作用，宣称治疗儿童湿疹等皮肤病的产品不属于化妆品。
                        </p>
                    </div>
                    <div class="capital_txt4">
                        <el-input-number
                            v-model="count"
                            @change="handleChange"
                            :min="1"
                            :max="1000"
                        ></el-input-number>
                        <el-button @click="add(msg.id)">加入购物车</el-button>
                    </div>
                </div>
            </div>
            <div class="secondary">
                <div class="secondary_div1">
                    <div class="secondary_div1_msg1">商品信息</div>
                    <div class="secondary_div1_msg">
                        <p>
                            <span>商品名称:</span>
                            <span>{{ msg.name }}</span>
                        </p>
                        <p>
                            <span>商品品牌:</span>
                            <span>{{ msg.brand }}</span>
                        </p>
                        <p>
                            <span>商品类型:</span>
                            <span>{{ msg.type }}</span>
                        </p>
                        <p>
                            <span>商品功效:</span>
                            <span>{{ msg.myexplain }}</span>
                        </p>
                        <p>
                            <span>生产地区:</span>
                            <span>{{ msg.country }}</span>
                        </p>
                    </div>
                </div>
                <div class="secondary_div1">
                    <div class="secondary_div1_msg1">商品详情</div>
                    <div class="secondary_div1_msg">
                        <img v-for="(item, index) in imgList" :src="item" :key="index" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'detail',
    data() {
        return {
            msg: {},
            count: 0,
            imgList: [],
        };
    },
    methods: {
        // 获取详情信息
        async getDetail() {
            if (this.id == 0) {
                return false;
            }
            const { data: res } = await this.$http.get('/goods/getGoodById', {
                params: {
                    id: this.id,
                },
            });
            console.log(res);
            if (res.code == 0) {
                this.$message.success('获取商品详情信息成功');
                this.msg = res.data[0];
                this.imgList = this.msg.detimg.split('@');
            } else {
                this.$message.error('获取商品详情信息失败');
            }
        },
        // 添加到购物车
        add(id) {
            if (sessionStorage.getItem('token') == undefined) {
                this.$message.warning('请先注册或登录后再进行购物');
                this.$bus.$emit('showLogin');
            } else {
                let token = sessionStorage.getItem('token');
                let iduser = this.$store.state.uid;
                let gid = id;
                let num = this.count;
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
        // 返回首页
        back() {
            this.$bus.$emit('setId');
        },
        //
        handleChange(value) {
            this.count = value;
        },
    },
    mounted() {
        this.getDetail();
    },
    props: ['id'],
};
</script>

<style scoped>
#detail {
    width: 90%;
    height: auto;
    /* border: 1px solid red; */
    margin: 10px auto;
}
.top {
    width: 100%;
    height: 20px;
    line-height: 20px;
    text-align: center;
}
.back {
    position: absolute;
    left: 95px;
}
.back:hover {
    color: aqua;
}
.middle {
    width: 100%;
    height: auto;
}
.capital {
    width: 100%;
    height: auto;
    text-align: center;
    display: flex;
    margin: 10px auto;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.capital_img {
    width: 60%;
    height: auto;
}
.capital_img img {
    width: 100%;
}
.capital_img:hover p {
    color: aqua;
}
.capital_txt {
    width: 40%;
    height: auto;
    text-align: left;
}
.capital_txt div {
    border-style: ridge;
    margin: 10px 5px;
}
.capital_txt1 {
    padding: 10px 0px;
}
.capital_txt2 {
    color: red;
    font-size: 30px;
    padding: 10px 0px;
}
.capital_txt4 div {
    border: none;
    margin: 10px 20px 10px 20px;
}
.capital_txt4 button {
    background-color: aqua;
}
.secondary {
    width: 100%;
    height: auto;
    margin: 40px 0px;
}
.secondary_div1 {
    border-top-style: solid;
    border-color: aqua;
}
.secondary_div1_msg1 {
    width: 60%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: aqua;
    margin: auto;
    font-size: 18px;
}
.secondary_div1_msg {
    text-align: left;
    width: 60%;
    height: auto;
    margin: auto;
}
.secondary_div1_msg p {
    height: 20px;
    line-height: 20px;
    padding: 0px 5px;
}
.secondary_div1_msg img {
    width: 100%;
    padding: 10px 0px;
}
</style>
