import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: "",
    phone: '',
    address: '',
    uid: 0,
    cart: [],
    // 用户待修改的信息
    _username: '',
    _phone: '',
    _address: '',
    
  },
  getters: {
    total(state){
      let total = 0;
      state.cart.forEach((item) => {
        total += item.num * item.price;
      });
      return total;
    },
  },
  mutations: {
    setName(state,value){
      console.log('设置共享数据: username = '+value);
      state.username = value;
      state._username = value;
    },
    setUid(state, value){
      console.log("设置共享数据: uid = "+ value);
      state.uid = value;
    },
    setPhone(state,value){
      console.log("设置共享数据: phone = "+ value);
      state.phone = value;
      state._phone = value;
    },
    setAddress(state,value){
      console.log("设置共享数据: address = "+ value);
      state.address = value;
      state._address = value;
    },
    set_Name(state,value){
      state._username = value;
    },
    set_Phone(state,value){
      state._phone = value;
    },
    set_Address(state,value){
      state._address = value;
    },
    // 获取购物车信息
    async setCart(state, value){
      if(value == ""){
        state.cart = [];
        return false;
      }
      let {iduser, token} = value;
      const {data: res} = await axios.post('/car/getCarDetail', {
        iduser,
        token,
      });
      if(res.code != 0){
        console.log('获取购物车信息失败');
        state.cart = [];
        console.log(res);
      }
      else{
        console.log('获取购物车信息成功');
        console.log("设置共享数据: cart = "+ res.data);
        state.cart = res.data;
      }
    },
  },
  actions: {
    // 用户名数据共享
    setName(context,value){
      context.commit('setName', value);
    },
    setUid(context, value){
      context.commit('setUid', value);
    },
    setPhone(context,value){
      context.commit('setPhone', value);
    },
    setAddress(context,value){
      context.commit('setAddress', value);
    },
    // 更新的信息
    set_Name(context,value){
      context.commit('set_Name', value);
    },
    set_Phone(context,value){
      context.commit('set_Phone', value);
    },
    set_Address(context,value){
      context.commit('set_Address', value);
    },
    async update(context,value){
      const {data: res} = await axios.post('/user/update', value);
      if(res.code == 0){
        console.log('修改信息成功');
        context.commit('setName', value.user_name);
        context.commit('setPhone', value.phone);
        context.commit('setAddress', value.address);
      }
      else{
        console.log('修改信息失败');
      }
    },
    // 购物车
    // 添加
    async add(context, value){
      let {iduser,token,num,gid}=value;
      let i = 0;
      while(i < num){
        const {data: res} = await axios.post('/car/addCarDetail', {
          iduser,
          token,
          gid,
        });
        if(res.code != 0){
          console.log('添加商品失败');
          console.log(res);
        }
        else{
          console.log('添加商品成功');
        }
        i++;
      }
      context.commit('setCart', value);
    },
    // 减少
    async reduce(context, value){
      let {iduser,token,num,gid}=value;
      let i = 0;
      while(i < num){
        const {data: res} = await axios.post('/car/reduceCarDetail', {
          iduser,
          token,
          gid,
        });
        if(res.code != 0){
          console.log('减少商品失败');
          console.log(res);
        }
        else{
          console.log('减少商品成功');
        }
        i++;
      }
      context.commit('setCart', value);
    },
    // 删除
    async delete(context, value){
      let {iduser,token,gid}=value;
      const {data: res} = await axios.post('/car/delCarDetail',{
        iduser,
        token,
        gid,
      });
      if(res.code != 0){
        console.log('删除商品失败');
        console.log(res);
      }
      else{
        console.log('删除商品成功');
      }
      context.commit('setCart', value);
    },
    // 初始化购物车
    setCart(context, value){
      context.commit('setCart', value);
    },
    // 生成订单
    async order(context, value){
      let {iduser,token}=value;
      const {data: res} = await axios.post('/order/makeOrder',{
        iduser,
        token,
      });
      if(res.code != 0){
        console.log('生成订单失败');
        console.log(res);
      }
      else{
        console.log('生成订单成功');
      }
      context.commit('setCart', value);
    },
  },
  modules: {
  }
})
