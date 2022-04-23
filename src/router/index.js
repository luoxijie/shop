import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../views/Register.vue'
import Homepage from '../views/Homepage.vue'
import Shopping_centre from '../views/Shopping_centre.vue'
import Personal_center from '../views/Personal_center.vue'
import Shopping_cart from '../views/Shopping_cart.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'homepage',
    component: Homepage
  },
  {
    path: '/homepage',
    name: 'homepage',
    component: Homepage,
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/shopping_centre',
    name: 'shopping_centre',
    component: Shopping_centre,
  },
  {
    path: '/personal_center',
    name: 'personal_center',
    component: Personal_center,
  },
  {
    path: '/shopping_cart',
    name: 'shopping_cart',
    component: Shopping_cart,
  }
]
// 访问 购物车和个人中心 需要先登录
// router.beforeEach((to,from,next)=>{
//   if(to.path == '/shopping_cart' || to.path == '/personal_center'){
//     if(sessionStorage.token != undefined){
//       next();
//     }
//     else{
//       next({name:'register'});
//     }
//   }
// });
const router = new VueRouter({
  routes
});


export default router
