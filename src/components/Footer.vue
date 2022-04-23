<template>
    <div id="foot">
        <div class="foot">
            <p>{{ footerMsgCopyright }}{{ footerMsgName }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'footer',
    data() {
        return {
            // 版权说明的文字
            footerMsgCopyright: 'Copyright © 2020-2021 vs平台 - Powered By ',
            // 单位
            footerMsgName: '罗熙杰的疯狂实验室',
        };
    },
    methods: {},
};
</script>

<style scoped>
.foot {
    text-align: center;
}
</style>
