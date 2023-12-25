import { defineStore } from '../pinia'
import { ref } from 'vue'

export const useTodoStore = defineStore('todo', () => { // setup 同组件的setup,我们可以直接将组件中的setup没拿过来就可以了
    const todos = ref(['a','b','c']);

    return {
        todos
    }
})
