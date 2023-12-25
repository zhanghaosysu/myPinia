import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { getCurrentInstance, inject, reactive, computed, ref, isRef, isReactive, toRefs, toRef } from 'vue'

// 创建pinia
import { createPinia } from './pinia'

const num1 = ref({}); // 当值为对象类型时，会用 reactive() 自动转换它的 .value
const num2 = ref(0);
const store = reactive({});
Object.assign(store, { num1, num2 })

// store 为在组件里调用 useXXX() 得到的 store
let { num1: n1, num2: n2 } = store; // n1具有响应性，n2没有响应性，解构后 n2 是一个基础类型的值

console.log(isRef(n1), isReactive(n1), 'ref-----');  // false true 

// 修改 defineStore 里的 num1 和 num2
num1.value.a = 1;
num2.value = 1;

console.log(store, n1, n2, store.num1, store.num2); // n1: {a: 1}, n2: 0

const store1 = reactive({age: 18, name: 'xxx'});

const { age, name } = toRefs(store1);
console.log(age.value === store1.age) // true
console.log(name.value === store1.name) // true

const app = createApp(App);
const pinia = createPinia(); //  获取pinia
// use API可以去调用插件的install方法，将app注入进来
app.use(pinia); // 使用pinia插件
app.mount('#app')
