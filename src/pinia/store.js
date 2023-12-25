import { getCurrentInstance, inject, reactive, computed, toRefs } from 'vue'
import { PiniaSymbol } from './rootState';
function createOptionStore(id, options, pinia) {
    const { state, actions, getters = {} } = options;
    function setup() {
        // 1） 用户提供的状态
        pinia.state.value[id] = state ? state() : {}
        const localState = toRefs(pinia.state.value[id]);// 结构出来依旧是响应式
        const setupStore = Object.assign(
            localState,
            actions, // 用户提供的动作
            Object.keys(getters).reduce((computeds, getterKey) => {
                computeds[getterKey] = computed(() => {
                    return getters[getterKey].call(store)
                })
                return computeds
            }, {})
        )
        return setupStore
    }
    return createSetupStore(id, setup, pinia) // options Api 需要将这个api转化成setup方法
}
// setupStore 用户已经提供了完整的setup方法了，我们只需要直接执行setup函数即可，通过这个返回值，将其放到store上就可以了
function createSetupStore(id,setup,pinia) {
    const store = reactive({}); // pinia 就是创建了一个响应式对象而已
    function wrapAction(action) {
        return function () {
            // 将action中的this永远处理成store，保证this指向正确
            return action.call(store, ...arguments)
        }
    }
    const setupStore = setup(); // 拿到的setupStore 可能没有处理过this指向
    for (let prop in setupStore) {
        const value = setupStore[prop]
        if (typeof value === 'function') {
            // 将函数的this永远指向store
            setupStore[prop] = wrapAction(value)
        }
    }
    // store[double] = 0
    Object.assign(store, setupStore)
    pinia._s.set(id, store)
    return store;
}
export function defineStore(idOrOptions, setup) {
    let id;
    let options;
    const isSetupStore = typeof setup === 'function'; // 区分optionsAPI 还是setupApi
    // 对用户的两种写法做一个处理
    if (typeof idOrOptions === 'string') {
        id = idOrOptions;
        options = setup;
    } else {
        options = idOrOptions;
        id = idOrOptions.id;
    }
    function useStore() {
        // 这个useStore 只能在组件中使用
        const currentInstance = getCurrentInstance();
        const pinia = currentInstance && inject(PiniaSymbol)
        // return store

        if (!pinia._s.has(id)) { // 这个store是第一次使用
            if (isSetupStore) {
                createSetupStore(id,setup,pinia); // 创建一个setupStore
            } else {
                // 创建选项store
                createOptionStore(id, options, pinia); // 创建后的store只需要存到_s中即可
            }
        }
        const store = pinia._s.get(id); // 如果已经有了store这不用创建直接拿到即可
        return store
    }

    return useStore;
}

// https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/

