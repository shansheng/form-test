<template>
  <div class="about">
    <h1>This is an about page</h1>
    <test></test>

    <!-- 自定义指令 -->
    <span v-hello="color3">{{message}}</span>
    <button @click="add"> 点击开始加1</button>

    <!-- 混入 -->
    <div>message:{{message}}</div>
    <div>foo:{{foo}}</div>

  </div>
</template>
<script>
// 自定义指令
import Vue from 'vue';
Vue.directive("hello",function(el,binding,vnode){
  el.style["color"]= binding.value;
})
// 注册一个全局自定义指令 v-focus
//生命周期：
// bind: 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。
// inserted: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。
// update: 被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新（详细的钩子函数参数见下）。
// componentUpdated: 被绑定元素所在模板完成一次更新周期时调用。
// unbind: 只调用一次， 指令与元素解绑时调用。

//混入
var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}



Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el,binding) {
    // 聚焦元素
    el.focus();
  }
});

export default {
  mixins: [mixin],
  data(){
    return{
      message:10,
      color3:"red"
    }
  },
  methods:{
    add:function(){
      this.message++;
    }
  }
}
</script>