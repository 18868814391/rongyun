<template>
  <div class="con" >
    <div class="con-head">
      <img class="con-head-m" src="../assets/login_icon_logo.png" alt="">
      <span class="con-head-t">v1.0.0</span>
    </div>
    <div class="con-box">
      <div class="con-nav">
        <div class="con-nav-head"></div>
      </div>
      <div class="chatList">
        <div class="search">
          <input class="search-1" type="text" placeholder="请输入搜索内容">
        </div>
        <connectCard v-for="item in 12"></connectCard>
      </div>
      <div class="chatRoom">
        <div class="msgs" id='homeIm'>
          <homeNews v-for="(item ,index) in answer" :key='index' :item='item' :data='item'></homeNews>
        </div>
        <div class="inpOp">
          <div class="inpTool"></div>
          <textarea v-on:keyup.enter="send"  style="resize:none;"  class="inpEnter" v-model="say" placeholder="请输入内容..." />
          <button class="sendBtn"  @click="send" :disabled ='say?false:true'>发送</button>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script>
import axios from "axios";
import {mapState,mapGetters,mapActions,mapMutations} from 'vuex'
import homeNews from './homeNews'
import connectCard from './connectCard'

// const arr = [ Field ,Button];
// arr.map(e => {
//   //动态生成组件
//   Vue.use(e);
// });

export default {
  data() {
    return { 
      say:''
    };
  },
  name: "homeIm",
  props: {
    msg: String
  },
  components:{
    homeNews,
    connectCard
  },
  created() {
    //this.getChatRecord() //获取聊天记录，要钱
    this.$nextTick(() => {//------------------------重要-------有消息就滚动到底部-----------------------
        let list = document.getElementById('homeIm')
        document.documentElement.scrollTop = list.scrollHeight
        //如不行，请尝试->  list.scrollTop = list.scrollHeight
      })
  },
  computed:{
    ...mapState({
      answer:"answer",
    }),

  },
  watch: { //------------------------重要-------有消息就滚动到底部-----------------------
    answer() {
      console.log('hanbeAN')
      this.$nextTick(() => {
        let list = document.getElementById('homeIm')
        list.scrollTop = list.scrollHeight
        //如不行，请尝试->  list.scrollTop = list.scrollHeight
      })
    }
  },
  methods: {
    send() {
      if(!this.send){
        return false;
      }
      let that = this
      let msg = new RongIMLib.TextMessage({ content: that.say, extra: 'https://img.52z.com/upload/news/image/20171120/20171120080335_21404.jpg' });
      let conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊, 其他会话选择相应的消息类型即可
      let targetId = '111'
      // let targetId = JSON.parse(localStorage.getItem('userInfo')).IMUser.assistantId; // 目标 Id

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
          onSuccess: function (message) {
              // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
              console.log('Send successfully',message,message.content.content);
              // let say = {
              //     type:1,
              //     css:'right',
              //     txt:message.content.content,
              //   }
              that.answer.push(message,message.content.content)
              that.say = ''
          },
          onError: function (errorCode, message) {
              let info = '';
              switch (errorCode) {
                  case RongIMLib.ErrorCode.TIMEOUT:
                      info = '超时';
                      break;
                  case RongIMLib.ErrorCode.UNKNOWN:
                      info = '未知错误';
                      break;
                  case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                      info = '在黑名单中，无法向对方发送消息';
                      break;
                  case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                      info = '不在讨论组中';
                      break;
                  case RongIMLib.ErrorCode.NOT_IN_GROUP:
                      info = '不在群组中';
                      break;
                  case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                      info = '不在聊天室中';
                      break;
              }
              console.log('发送失败: ' + info + errorCode);
          }
      });
    },

    getChatRecord(){
      let conversationType = RongIMLib.ConversationType.PRIVATE; //单聊, 其他会话选择相应的消息类型即可
      let targetId = '2'; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id
      let timestrap = null; // 默认传 null，若从头开始获取历史消息，请赋值为 0, timestrap = 0;
      let count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取
      RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
          onSuccess: function(list, hasMsg) {
              // list => Message 数组。
              // hasMsg => 是否还有历史消息可以获取。
              console.log('历史纪录',list, hasMsg)
          },
          onError: function(error) {
              console.log('GetHistoryMessages, errorcode:' + error);
          }
      });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.con{
  widows: 100vw;
  height: 100vh;
  background: lavender;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}
.con-head{
  width: 100%;
  height: 75px;
  background: rgb(3, 156, 3);
  padding: 0 50px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.con-head-m{
  width: 50px;
  margin-right:15px; 
}
.con-head-t{
  color: white;
  font-size: 15px;
}
.con-box{
  width: 100%;
  flex: 1;
  display: flex;
}
.con-nav{
  width: 100px;
  height: 100%;
  background: rgb(6, 197, 22);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.con-nav-head{
  width: 65px;
  height: 65px;
  background: lavender;
  border-radius:50%; 
  margin-top:20px; 
}
.chatList{
  width: 400px;
  height:calc(100vh - 71px);
  flex-shrink: 0;
  background: lemonchiffon;
  overflow-y: auto;
}
.search{
  width: 100%;
  height: 50px;
  background: lightgreen;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top:0px;
  z-index: 10;
}
.search-1{
  width: 80%;
  height: 40px;
  background: #eee;
  border-radius:20px;
  text-indent: 10px;
  border: none;
  outline: none; 
}
.chatRoom{
  flex: 1;
  height: 100%;
  background: white;
  position: relative;
  box-sizing: border-box; 
  display: flex;
  flex-direction: column;
}
.msgs{
  width: 100%;
  height: calc(100vh - 75px - 150px);
  overflow-y: auto;
}
.inpOp{
  width: 100%;
  height: 150px;
  background: white;
  border: 2px solid #eee;
  border-radius:5px; 
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.inpTool{
  width: 100%;
  height: 25px;
  background: lavender;
}
.inpEnter{
  width: 100%;
  flex: 1;
  border: none;
  outline: none;
  padding:15px;
  box-sizing: border-box;
}
.sendBtn{
  width: 80px;
  height: 30px;
  position: absolute;
  right: 20px;
  bottom:15px;
}
</style>


