import { PiniaSymbol } from './rootState'
import { ref } from 'vue'
export function createPinia() {
    // pinia 是管理多个store （管理store的状态的）
    const state = ref({});   // 映射状态

    
    const pinia = {
        install(app) {
            // 我们期望所有的组件都可以访问到这个pinia
            app.config.globalProperties.$pinia = pinia; // this.$pinia
            // vue3可以通过inject注入使用
            app.provide(PiniaSymbol, pinia)
            // Vue.prototype.$pinia = pinia;
        },
        state,
        _s:new Map() // 每个store id->store 
    }
    return pinia
}