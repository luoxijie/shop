<template>
    <div id="shopping_centre">
        <el-container>
            <el-header>
                <Preamble :index="index"></Preamble>
            </el-header>
            <el-main>
                <div id="centre" v-show="id == 0">
                    <div class="carousel">
                        <el-carousel :interval="4000" trigger="click" height="400px">
                            <el-carousel-item v-for="item in imgUrl" :key="item.id">
                                <img :src="item.url" alt="" />
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                    <div class="centre">
                        <div class="type">
                            <div
                                :class="{ type_div: true, active: activeIndex == index }"
                                @mouseover="setList(index)"
                                v-for="(item, index) in type"
                                :key="index"
                            >
                                {{ item }}
                            </div>
                        </div>
                        <div class="list">
                            <div class="list_img" v-for="item in list" :key="item.id">
                                <img
                                    :src="item.feimg"
                                    :alt="item.name"
                                    @click="goDetail(item.id)"
                                />
                            </div>
                        </div>
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
    name: 'Shopping_centre',
    components: {
        Preamble,
        Bottom,
        Detail,
    },
    data() {
        return {
            index: '/shopping_centre',
            activeIndex: 0,
            id: 0,
            imgUrl: [],
            page: 1,
            limit: 8,
            // 默认展示的list
            list: [],
            // 获取的list
            list1: [],
            list2: [],
            list3: [],
            list4: [],
            list5: [],
            // type
            type: ['保湿', '洗面奶', '口红', '面膜', '其他'],
        };
    },
    methods: {
        async getListByType() {
            for (let i = 0; i < this.type.length; i++) {
                const { data: res } = await this.$http.get('/goods/getGoodsBytype', {
                    params: {
                        page: this.page,
                        limit: this.limit,
                        type: this.type[i],
                    },
                });
                console.log(res.data);
                if (res.code == 0) {
                    console.log('获取成功');
                    if (i == 1) {
                        this.list1 = res.data;
                        this.list = this.list1;
                    } else if (i == 2) {
                        this.list2 = res.data;
                    } else if (i == 3) {
                        this.list3 = res.data;
                    } else if (i == 4) {
                        this.list4 = res.data;
                    } else {
                        this.list5 = res.data;
                    }
                } else {
                    this.$message.error('获取失败');
                    console.log('获取失败');
                }
            }
        },
        // 修改展示的list
        setList(index) {
            console.log(index);
            if (index == 0) {
                this.list = this.list1;
            } else if (index == 1) {
                this.list = this.list2;
            } else if (index == 2) {
                this.list = this.list3;
            } else if (index == 3) {
                this.list = this.list4;
            } else {
                this.list = this.list5;
            }
            this.activeIndex = index;
        },
        //
        goDetail(id) {
            this.id = id;
        },
        //
        setId() {
            this.id = 0;
        },
    },
    created() {
        this.getListByType();
    },
    mounted() {
        let obj1 = {
            url: 'https://b.appsimg.com/upload/momin/2021/10/12/49/1634038899547.jpg',
            id: 1,
        };
        let obj2 = {
            url: 'https://b.appsimg.com/upload/momin/2021/10/13/110/1634111046277.jpg',
            id: 2,
        };
        this.imgUrl.push(obj1);
        this.imgUrl.push(obj2);
        //
        // let div = document.querySelector('.type_div');
        // div.className = '.type_div .active';
        this.$bus.$on('setId', this.setId);
    },
    beforeDestroy() {
        this.$bus.$off('setId');
    },
};
</script>

<style scoped>
#centre {
    width: 90%;
    height: auto;
    /* border: 1px solid red; */
    margin: 0px auto;
}
.carousel {
    width: 86%;
    margin: 10px auto;
}
.centre {
    width: 86%;
    height: auto;
    /* border: 1px solid aqua; */
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 5px;
    margin: 0px auto;
}
.type {
    width: auto;
    height: 25px;
    display: flex;
}
.type_div {
    height: 25px;
    line-height: 25px;
    width: auto;
    margin: 0px 25px;
    font-size: 15px;
}
.type_div:hover {
    color: aqua;
}
.active {
    border-bottom: 1px solid aqua;
}
.list {
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
}
.list_img {
    width: 32%;
    height: 150px;
    margin: 10px 7px;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.list_img img {
    width: 100%;
    height: 100%;
}
</style>
