## Vuex和Pinia的区别

- Pinia的特点就是采用ts来进行编写的，类型提示友好， 体积小，使用简单
- 去除mutations,  optionsApi 只有 state,getters,actions(包含了同步和异步)
- Pinia优势支持compositionApi 同时也兼容optionsApi(this指向)  可以无痛将vue3的代码直接迁移到pinia中
- Vuex中需要使用module 来定义模块（嵌套问题），树结构， vuex中命名空间的概念（namespaced）。整个数据定义树的结构 $store.state.a.b.c.xxx (createNamespaceHelpers()), 所有的模块的状态会定义到根模块上. 所以会出现模块覆盖根状态。
   ```js
    new Vuex.Store({
        state:{a:1},
        module:{
            a:{
                state:{ }
            }
        }
    })
   ```
- vuex中只允许程序有一个store.
- Pinia可以采用多个store，store之间可以互相调用 （扁平化）， 不用担心命名冲突问题

# Pinia 内部工作原理

- Pinia 是 Vue 的一个插件，是一个名叫 pinia 的对象，该对象拥有 install 方法，还有一个 state 属性和 Map 对象属性，在 install 方法里会将 pinia 注册到全局 app，分别通过 app.config.globalProperties 和 app.provide 来支持 optionsApi 和
compositionApi

- pinia 的 Map 对象属性会将每个 store 以 key, value 的形式储存，key 就是调用 defineStore 方法时传入的字符串属性，这样在根组件注册 pinia 后，所有子组件访问到 pinia 里所有的 store，store之间可以互相调用，store 不再是 Vuex 那种树形存结构，而是扁平化的结构

- 注意解构后的响应性
   ```js
    // num1 和 num2 为在 pinia 的 defineStore 里定义的需要导出的变量
    const num1 = ref({}); // 当值为对象类型时，会用 reactive() 自动转换它的 .value
    const num2 = ref(0);
    const store = reactive({});
    Object.assign(store, {num1, num2})

    // store 为在组件里调用 useXXX() 得到的 store
    let { num1: n1, num2: n2 } = store; // n1具有响应性, n1是一个经过 reactive 处理过的响应式对象，n2没有响应性，解构后 n2 是一个基础类型的值

    console.log(isRef(n1), isReactive(n1), 'ref-----'); // false true

    // 修改 defineStore 里的 num1 和 num2
    num1.value.a = 1;
    num2.value = 1;

    console.log(store, n1, n2, store.num1, store.num2); // n1: {a: 1}, n2: 0
   ```
   结论：在 defineStore 里通过 ref 定义的基础类型数据，修改后，在组件里解构通过调用 useXXX() 得到的 store 后，解构后的值不具有响应性，得通过 pinia 提供的 storeToRefs(store) 解构后才有响应性。

- storeToRefs 实质上就是用了 toRef API，给 store 里经过 ref 或 reactive 包装的值添加 get / set 代理
   ```js
    // toRef 实现：
    export const toRef = (object, key, defaultValue?) => {
        // 将一个对象的值转化为ref形式
        const val = object[key]
        return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue)
    }
    // toRef核心
    class ObjectRefImpl {
        public readonly __v_isRef = true
        constructor(private readonly _object, private readonly _key, private readonly _defaultValue?) {}
        get value() {
            const val = this._object[this._key] // 取值，取的是响应式对象的值，不是解构后的值，所以仍然具有响应性
            return val === undefined ? this._defaultValue : val // 是否去默认值
        }
        set value(newVal) {
            this._object[this._key] = newVal // 设置值
        }
    }

    // example
    const store = reactive({age: 18, name: 'xxx'});
    const ageRef = toRef(store, 'age');
    ageRef.value === store.age // true，

    // toRefs 就是遍历对象的属性，执行 toRef(obj, key)
    const { age, name } = toRefs(store);
    age.value === store.age // true
    name.value === store.name // true
    // 操作 age.value 和 name.value 等同于直接操作 store.age store.name
   ```
