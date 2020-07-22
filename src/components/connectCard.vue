<template>
  <div class="coc">
    <div class="coc-b1">
      <div class="coc-tnum">12</div>
    </div>
    <div class="coc-b2">
      <div class="coc-b21">
        <span class="coc-b21-1">XXXXX汽修</span>
        <span class="coc-b21-2">23:59</span>
      </div>
      <div class="coc-b22">
        XXXXX汽修:我说了一句话
      </div>
    </div>
  </div>
</template>
<script>
export default {
  
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
}
</style>


