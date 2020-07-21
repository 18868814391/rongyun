import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const API_PROXY = 'https://bird.ioliu.cn/v1/?url='; //代理

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    answer:[]
  },
  getters: {
  },
  mutations: {
    getAnswer (state, playload) {//--------------重要
      let say ={ //自定义消息组件所需参数
          type:1,
          css:'left',
          txt:playload.content,
          date:'',
          headImg:playload.extra
        }
      state.answer.push(say)
      console.log(playload)
 	},
  },
  actions: {
  }
})