import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const API_PROXY = 'https://bird.ioliu.cn/v1/?url='; //代理

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    answer:[],
    isConnect:false,
  },
  getters: {
    isConnect:function(state){
      return state.isConnect
    },
  },
  mutations: {
    getAnswer (state, playload) {//--------------重要
      state.answer.push(playload)
      console.log('我是传给store的消息',playload)
      console.log('我是store里面的answer',state.answer)
 	  },
  },
  actions: {

  }
})