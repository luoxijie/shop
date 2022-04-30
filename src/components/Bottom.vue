<template>
    <div id="bottom">
        <div class="bottom">
            <p>{{ footerMsgCopyright }}{{ footerMsgName }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'bottom',
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
.bottom {
    text-align: center;
}
</style>
