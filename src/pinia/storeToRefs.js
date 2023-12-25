import { toRefs, toRaw, toRef, isRef, isReactive, isVue2 } from "vue"

export function storeToRefs(store) {
    if (isVue2) {
        // 如果是vue2直接返回toRefs(store)，尽管其中包含很多methods
        return toRefs(store)
    } else {
        // store的原始对象
        // toRaw() 可以返回由 reactive()、readonly()、shallowReactive() 或者 shallowReadonly() 创建的代理对应的原始对象
        store = toRaw(store)

        const refs = {};
        for (const key in store) {
            const value = store[key]
            if (isRef(value) || isReactive(value)) {
                // 过滤store中的非ref或reactive对象
                // 使用toRef获取一个新的ref
                refs[key] = toRef(store, key)
            }
        }

        return refs
    }
}