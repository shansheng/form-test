
import test from './test.vue';
const testCom={
    install:function(Vue,){
        Vue.component(test.name,test);
        //test.name'这就是后面可以使用的组件的名字，install是默认的一个方法 component-name 是自定义的，我们可以按照具体的需求自己定义名字

        // 1. 添加全局方法或属性(可以全局使用)
        Vue.myGlobalMethod = function () {
            // 逻辑...
            console.log('myGlobalMethod')
        }

        // 2. 添加全局资源
        Vue.directive('my-directive', {
            bind (el, binding, vnode, oldVnode) {
            // 逻辑...
            }
        })

        // 3. 注入组件
        Vue.mixin({
            created: function () {
            // 逻辑...
            }
        })

        // 4. 添加实例方法
        Vue.prototype.$myMethod = function (methodOptions) {
            // 逻辑...
            console.log('myMethod')
        }
    }
}

export default testCom;