<template>
  <div class="coc" @click="openChat()">
    <div class="coc-b1">
      <div class="coc-tnum" v-if="detail.unreadMessageCount*1>0">{{detail.unreadMessageCount}}</div>
    </div>
    <div class="coc-b2">
      <div class="coc-b21">
        <span class="coc-b21-1">会话类型{{detail.conversationType}}</span>
        <span class="coc-b21-2">{{sendTime}}</span>
      </div>
      <div class="coc-b22">
        {{`发送者id${detail.latestMessage.senderUserId}说`}}：{{detail.latestMessage.content.content}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      sendTime:'',
    }
  },
  props:{
    detail:Object
  },
  created(){
    this.sendTime=this.getLocalTime(this.detail.sentTime)
  },
  methods:{
    getLocalTime(nS) {     
      return new Date(parseInt(nS) ).toLocaleString().replace(/:\d{1,2}$/,' ');     
    },
    openChat(){
      this.$emit('openChat',this.detail)
    },
  },
}
</script>
<style scoped>
.coc{
  width: 100%;
  height: 100px;
  background: white;
  border: 1px solid #eee;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.coc-b1{
  width: 80px;
  height: 80px;
  border-radius:50%;
  background: lavender;
  margin-right:15px;  
  position: relative;
}
.coc-tnum{
  position: absolute;
  width: 20px;
  height: 20px;
  background: red;
  border-radius:50%;
  color: white;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  position: absolute;
  right: 0px;
  top: 0px; 
}
.coc-b2{
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.coc-b21{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.coc-b21-1{
  font-size: 15px;
  color: #333;
}
.coc-b21-2{
  font-size: 15px;
  color: #999;
}
.coc-b22{
  width: 100%;
  margin-top:10px; 
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;  /*要显示的行数*/
  -webkit-box-orient: vertical;
  word-break: break-all;
}
</style>


