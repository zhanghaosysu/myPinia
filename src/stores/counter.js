import { defineStore } from '../pinia'
import { ref, computed, reactive } from 'vue'
import {useTodoStore } from './todo'

// compositionStore
export const useCounterStore = defineStore('counter', () => { // setup 同组件的setup,我们可以直接将组件中的setup没拿过来就可以了
    const count = ref(0);

    const todoStore = useTodoStore();
    console.log(todoStore.todos)
    const double = computed(() => {
        return count.value * 2;
    }) 

    const increment = (payload) => {
        count.value += payload;
    }

    return {
        count, // 状态
        double, // 计算属性
        increment // 函数
    }
})


// optionStore 基于optionsAPI来实现的，使用方式和vuex 基本上一致
// export const useCounterStore = defineStore('counter', {
//     state: () => { // -> reactive({})
//         return { count: 0}
//     },
//     getters: { // -> computed()
//         double() {
//             return this.count*2
//         }
//     },
//     actions: { // method
//         increment(payload) {
//             console.log(this)
//             this.count+=payload
//         }
//     }
// })
