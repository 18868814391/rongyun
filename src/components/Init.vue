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
        <connectCard v-on:openChat="openChat" v-for="(detail,index) in chatList" :key="index" :detail="detail"></connectCard>
      </div>
      <div class="chatRoom">
        <div class="msgs" id='homeIm' @scroll="scrollEvent" ref='chatBox'>
          <div class="loadHistory">
            <span class="loadHistory-t" @click="loadHis()">{{haveHis?'加载历史记录':'没有历史记录了'}}</span>
          </div>
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
      chatList:[],//会话列表
      say:'',
      nowChat:null,//当前对话框对象
      targetMan:'',//目前会话框的对象
      hisObj:[],//历史记录大对象
      haveHis:true,//该会话是否还有历史记录
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
    console.log('组件初始化中是否链接上了',this.$store.state.isConnect)
    if(this.$store.state.isConnect){
      this.getChat()
    }
    setTimeout(()=>{
      console.log('一秒之后组件初始化中是否链接上了',this.$store.state.isConnect)
    },1000)
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
    ...mapGetters([
        'isConnect'
    ]),    
    getIsConnect() {
      return this.$store.state.isConnect;
    }
  },
  watch: { //------------------------重要-------有消息就滚动到底部-----------------------
    answer() {
      // this.$nextTick(() => {
      //   let list = document.getElementById('homeIm')
      //   list.scrollTop = list.scrollHeight
      //   //如不行，请尝试->  list.scrollTop = list.scrollHeight
      // })
    },
    isConnect(newVal){
      console.log('组件中监听链接是否成功',newVal)
      if(newVal){  //全局监听融云连接成功
        this.getChat()//获取会话列表，要钱
        // this.getChatRecord() //获取指定会话聊天记录，要钱        
      }
    },
  },
  methods: {
    openChat(d){ //点击了会话列表，获取对应会话的历史记录
      const self=this;
      if(d.targetId==self.targetMan){
        return false;//重复点击不会加载聊天记录
      }
      self.hisObj.forEach((v,i,a)=>{ //把对应的历史记录塞到对应对象中
        if(v.targetId==d.targetId){
            // v.history=v.history.concat(list)
            if(!v.history[0]){//不存在记录，是初次打开,正常执行
               self.getchatHistory(d);    
            }else{
              self.getchatHistory(d,1);//只切换对话，不加载历史记录
            }
        }
      })      
      // if(d.targetId!=self.targetMan){
      //   this.getchatHistory(d);//开始获取该对话的历史记录
      // }
    },
    toBottom(){ //聊天框滚动到底
      this.$nextTick(() => {
        let list = document.getElementById('homeIm')
        list.scrollTop = list.scrollHeight
        //如不行，请尝试->  list.scrollTop = list.scrollHeight
      })          
    },
    gotMsg(d){  //收到消息啦！！！！
      this.answer.push(d);
      this.toBottom();
    },
    send() {
      if(!this.send){
        return false;
      }
      let that = this
      let msg = new RongIMLib.TextMessage({ content: that.say, extra:'' });
      let conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊, 其他会话选择相应的消息类型即可
      let targetId = that.targetMan
      // let targetId = JSON.parse(localStorage.getItem('userInfo')).IMUser.assistantId; // 目标 Id
      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
          onSuccess: function (message) {
              // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
              console.log('Send successfully',message,message.content.content);
              that.answer.push(message,message.content.content)
              that.say = ''
              that.toBottom();
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
    getChat(){ //获取会话列表
      let self=this;
      let conversationType = RongIMLib.ConversationType.PRIVATE; //单聊, 其他会话选择相应的消息类型即可
      RongIMClient.getInstance().getConversationList({
          onSuccess: function(list) {
              // list => 会话列表集合
              console.log('会话列表集合',list)
              self.chatList=list
              self.chatList.forEach((v,i,a)=>{
                let ddd={targetId:'',history:[]}
                ddd.targetId=v.targetId
                self.hisObj.push(ddd)
              })
              console.log('历史记录大对象',self.hisObj)
          },
          onError: function(error) {
             console.log('会话列表获取失败')
          }
      }, null);      
    },
    scrollEvent (d) {
      let self= this;
      // console.log(this.$refs.chatBox.scrollTop)
      // if(this.$refs.chatBox.scrollTop<=10){ //拉到顶了。加载历史记录
      //   console.log('我要加载历史记录啦')
      //   this.getchatHistory(self.nowChat);
      // }
    },   
    loadHis(d){
      const self=this;
      this.getchatHistory(self.nowChat);
    }, 
    getchatHistory(d,type){ //获取指定对话历史记录
      const self=this;
      if(d.targetId!=self.targetMan){ //切换了会话框了，先清空当前信息记录
        self.$store.state.answer=[]
        self.haveHis=true
      }
      self.nowChat=d;
      self.targetMan=d.targetId
      console.log(d)
      if(type&&type==1){ //不加载记录，只是切换聊天框
        self.hisObj.forEach((v,i,a)=>{ //把对应的历史记录塞到对应对象中
          if(v.targetId==d.targetId){
              self.$store.state.answer=v.history
          }
        }) 
        self.toBottom();           
        return false
      }
        let conversationType=null
        if(d.conversationType==1){
          conversationType = RongIMLib.ConversationType.PRIVATE; //单聊, 其他会话选择相应的消息类型即可
        }else{
          alert(`消息类型为${d.conversationType}`)
          return false
        }
        let targetId = d.targetId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id
        let timestrap = null; // 默认传 null，若从头开始获取历史消息，请赋值为 0, timestrap = 0;
        let count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取
        RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
            onSuccess: function(list, hasMsg) {
                let flag=false;
                self.hisObj.forEach((v,i,a)=>{ //把对应的历史记录塞到对应对象中
                  if(v.targetId==d.targetId){
                      // v.history=v.history.concat(list)
                      if(!v.history[0]){//不存在记录，是初次打开，要滚动到底
                         flag=true     
                      }
                      console.log('当前获取到的历史记录',list)
                      v.history=list.concat(v.history)
                      self.$store.state.answer=v.history

                  }
                })
                if(flag){
                 self.toBottom(); 
                }
                console.log('被插入过的历史记录大对象',self.hisObj)
                // self.$store.state.answer=list
                console.log('历史纪录',list, hasMsg)
                self.haveHis=hasMsg
            },
            onError: function(error) {
                console.log('GetHistoryMessages, errorcode:' + error);
            }
        });        
    },
    getChatRecord(){  //获取指定会话历史
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
.loadHistory{
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top:5px; 
}
.loadHistory-t{
  cursor: pointer;
}
</style>


