<template>
  <div id="app">
    <Init/>
  </div>
</template>

<script>
import Init from './components/Init.vue'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
export default {
  name: 'app',
  components: {
    Init
  },
created () { //生命周期函数-可发起求
    let that = this
    //融云初始化
    console.log(123,RongIMLib.RongIMClient.init)
    RongIMLib.RongIMClient.init('pvxdm17jpe59r',); //------------------------------重要填写appkey
    that.beforeIm() //设置监听，必须先设置监听，再连接
    that.nowIm()  //连接融云
  },
  methods: {
    ...mapMutations({ //读取最新消息列表，并设置----------------------------重要
      getAnswer:'getAnswer'
    }),    
    beforeIm(){
      let that = this
      // 连接状态监听器
      RongIMClient.setConnectionStatusListener({
          onChanged: function (status) {
              // status 标识当前连接状态
              switch (status) {
                  case RongIMLib.ConnectionStatus.CONNECTED:
                      console.log('链接成功');
                      break;
                  case RongIMLib.ConnectionStatus.CONNECTING:
                      console.log('正在链接');
                      break;
                  case RongIMLib.ConnectionStatus.DISCONNECTED:
                      console.log('断开连接');
                      break;
                  case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                      console.log('其他设备登录');
                      break;
                  case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                      console.log('域名不正确');
                      break;
                  case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                      console.log('网络不可用');
                      break;
              }
          }
      });

      // 消息监听器
      RongIMClient.setOnReceiveMessageListener({
          // 接收到的消息
          onReceived: function (message) {
              // 判断消息类型
              switch(message.messageType){
                  case RongIMClient.MessageType.TextMessage:
                      // message.content.content => 文字内容
                      //----------------------------重要-------把获取的消息存放在store中，全局公用homeIm.vue要使用
                      console.log('8080',message,message.content.content)
                      that.getAnswer(message.content)
                      break;
                  case RongIMClient.MessageType.VoiceMessage:
                      // message.content.content => 格式为 AMR 的音频 base64
                      break;
                  case RongIMClient.MessageType.ImageMessage:
                      // message.content.content => 图片缩略图 base64
                      // message.content.imageUri => 原图 URL
                      break;
                  case RongIMClient.MessageType.LocationMessage:
                      // message.content.latiude => 纬度
                      // message.content.longitude => 经度
                      // message.content.content => 位置图片 base64
                      break;
                  case RongIMClient.MessageType.RichContentMessage:
                      // message.content.content => 文本消息内容
                      // message.content.imageUri => 图片 base64
                      // message.content.url => 原图 URL
                      break;
                  case RongIMClient.MessageType.InformationNotificationMessage:
                      // do something
                      break;
                  case RongIMClient.MessageType.ContactNotificationMessage:
                      // do something
                      break;
                  case RongIMClient.MessageType.ProfileNotificationMessage:
                      // do something
                      break;
                  case RongIMClient.MessageType.CommandNotificationMessage:
                      // do something
                      break;
                  case RongIMClient.MessageType.CommandMessage:
                      // do something
                      break;
                  case RongIMClient.MessageType.UnknownMessage:
                      // do something
                      break;
                  default:
                      // do something
              }
          }
      });
    },
    nowIm(){
    //自己的token------从接口获取，写到缓存
      // var token = JSON.parse(localStorage.getItem('userInfo')).IMUser.token//"WzrthC5f4UfuiI7dIwCQ5fwtGfqCdobpowIZkcQnj8PQOQuAJb/nIi1ayzGFwJguvbQZxbJH3x0=";
      RongIMClient.connect('ouUKLae8Zgn/TGampTkAyPQmitI1Ev7C@zeph.cn.rongnav.com;zeph.cn.rongcfg.com', {
          onSuccess: function(userId) {
              console.log('Connect successfully. ' + userId);
          },
          onTokenIncorrect: function() {
              console.log('token 无效');
          },
          onError: function(errorCode){
              var info = '';
              switch (errorCode) {
                  case RongIMLib.ErrorCode.TIMEOUT:
                      info = '超时';
                      break;
                  case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
                      info = '不可接受的协议版本';
                      break;
                  case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                      info = 'appkey不正确';
                      break;
                  case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                      info = '服务器不可用';
                      break;
              }
              console.log(info);
          }
      });
    }
  },
}
</script>

<style>
*{
  margin: 0;
  padding: 0;  
}
#app {

}
</style>
