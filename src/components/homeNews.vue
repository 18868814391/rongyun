<template>
  <div class="homeNews">
      <!-- 1:文字，2：红包，3：文章 ,css:类型 -->
      <div class="right" v-if="data.messageType =='TextMessage'&&data.messageDirection=='1'">
         <div class="right-head"></div>
         <div class="right-con">
           <div class="getName">用户名1</div>
           <div class="content">{{data.content.content}}</div>
           <div class="time">{{time}}</div>
         </div>
      </div>
      <div class="left" v-if="data.messageType =='TextMessage'&&data.messageDirection!='1'">
         <div class="right-head"></div>
         <div class="right-con">
           <div class="getName2">用户名2</div>
           <div class="content">{{data.content.content}}</div>
           <div class="time">{{time}}</div>
         </div>        
      </div>
      
  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "homeNews",
  props:['data'],
  data() {
    return {
      time:'',
    };
  },
  created() {
    this.time=this.getLocalTime(this.data.sentTime)
  },
  methods: {
    getLocalTime(nS) {     
      return new Date(parseInt(nS) ).toLocaleString().replace(/:\d{1,2}$/,' ');     
    }
  }
};
</script>
<style scoped>
.homeNews{
  width: 100%;
}
.right{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  padding: 15px;
  box-sizing: border-box;
}
.right-head{
  width: 80px;
  height: 80px;
  background: lightcoral;
  border-radius:50%; 
}
.right-con{
  max-width:600px;
  display: flex;
  flex-direction: column;
  align-items: right;
  margin-right:15px;
  margin-left:15px;
  word-break: break-all;
}
.getName{
  width: 100%;
  text-align: right;; 
  margin-bottom:5px; 
}
.getName2{
  text-align: left;
  margin-bottom:5px;   
}
.content{
  display: inline-block;
  padding: 10px;
  border-radius:5px;
  background:  rgb(3, 156, 3);
  color: white;
}
.time{
  color: #999;
  font-size: 12px;
}
.left{
  width: 100%;
  display: flex;
  padding: 15px;
  box-sizing: border-box;  
}
</style>

