<template>
    <router-view></router-view>
</template>

<script>
import Homepage from './views/Homepage.vue';
import Register from './views/Register.vue';

export default {
    name: 'app',
    components: {
        Homepage,
        Register,
    },
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
