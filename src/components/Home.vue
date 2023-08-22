<template>
    <div>
        <h1>Hello User {{ getUserId() }}</h1>
        <main id="todolist">
            <h1>Todo List <span>Get things done, one item at a time.</span></h1>
            <div class="items" v-if="items.length > 0">
                <ul>
                    <li v-for="(item, index) in todolist" :key="item.id" :class="{ 'done': item.done }">
                        <span v-if="!item.editing" class="label">{{ item.title }}</span>
                        <input v-else type="text" v-model="item.tempItem" @keyup.enter="saveItem(index, item)">
                        <div class="actions">
                            <button class="btn-picto" type="button" @click="changeItemStatus(index)">
                                <i aria-hidden="true" class="material-icons">{{ item.done ? 'check_box' :
                                    'check_box_outline_blank' }}</i>
                            </button>
                            <button class="btn-picto" type="button" aria-label="Edit" title="Edit" @click="editItem(index)">
                                <i aria-hidden="true" class="material-icons">{{ item.editing ? 'done' : 'edit' }}</i>
                            </button>
                            <button class="btn-picto" type="button" aria-label="Delete" title="Delete"
                                @click="deleteItem(index, item.id)">
                                <i aria-hidden="true" class="material-icons">delete</i>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>

            <p class="emptylist" v-else>Your todo list is empty.</p>

            <form @submit.prevent="addItem">
                <label for="newitem">Add to the todo list</label>
                <input type="text" name="newitem" id="newitem" v-model="itemTitle">
                <button type="submit">Add item</button>
            </form>
        </main>
        <button @click="logout" class="logout-btn">Logout</button>
    </div>
</template>
  
<script>
import axios from 'axios';


export default {
    name: 'Home',
    data() {
        return {
            itemTitle: '',
            items: []
        };
    },
    methods: {
        logout() {
            localStorage.removeItem('user-info');
            this.$router.push({ name: 'Login' });
        },
        getUserId() {
            const user = JSON.parse(localStorage.getItem('user-info'));
            if (user) {
                return `ID ${user.id}`;
            } else {
                return '';
            }
        },
        async addItem() {
            if (!this.itemTitle.trim()) {
                return;
            }

            const user = JSON.parse(localStorage.getItem('user-info'));
            if (!user) {
                return
            }
            const payload = {
                userId: user.id,
                title: this.itemTitle,
                done: false
            }
            const { data } = await axios.post("http://localhost:3000/todos", payload)
            this.items.push(data)

            this.itemTitle = '';
        },
        async deleteItem(index, todoId) {
            this.items.splice(index, 1);
            await axios.delete(`http://localhost:3000/todos/${todoId}`)
        },
        changeItemStatus(index) {
            const item = this.items[index];
            this.items[index].done = !item.done;
        },
        async saveItem(index, todo) {
            this.todolist[index].editing = true;
            this.todolist[index].title = todo.tempItem;
            const payload = {
                ...todo,
                title: todo.tempItem
            }
            delete payload.editing
            delete payload.tempItem
            await axios.put(`http://localhost:3000/todos/${todo.id}`, payload)
        },
        editItem(index) {
            this.todolist[index].editing = true;
            this.todolist[index].tempItem = this.items[index].title.trim();
        },
        async loadTodoItems(userId) {
            let { data } = await axios.get(`http://localhost:3000/Todos?userId=${userId}`);
            this.items = data
        }
    },
    computed: {
        todolist() {
            return this.items
        }
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem('user-info'));
        this.loadTodoItems(user.id)
    },
    watch: {
        items: {
            deep: true,
            handler(items) {
                localStorage.setItem('todos', JSON.stringify(items));
            }
        }
    }
};
</script>
  
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html,
body {
    background: #f7f1f1;
    font-size: 1.1rem;
    font-family: 'Quicksand', sans-serif;
    height: 100%;
}

@keyframes strikeitem {
    to {
        width: calc(100% + 1rem);
    }
}

#todolist {
    margin: 4rem auto;
    padding: 2rem 3rem 3rem;
    max-width: 500px;
    background: #FF6666;
    color: #FFF;
    box-shadow: -20px -20px 0px 0px rgba(100, 100, 100, .1);
}

#todolist h1 {
    /*text-align:center;*/
    font-weight: normal;
    font-size: 2.6rem;
    letter-spacing: 0.05em;
    border-bottom: 1px solid rgba(255, 255, 255, .3);
}

#todolist h1 span {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 0.7rem;
    margin-left: 3px;
    margin-top: 0.2rem;
}

#todolist .emptylist {
    margin-top: 2.6rem;
    text-align: center;
    letter-spacing: .05em;
    font-style: italic;
    opacity: 0.8;

}

#todolist ul {
    margin-top: 2.6rem;
    list-style: none;
}

#todolist .todolist-move {
    transition: transform 1s;
}

#todolist li {
    display: flex;
    margin: 0 -3rem 4px;
    padding: 1.1rem 3rem;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
}

#todolist .actions {
    flex-shrink: 0;
    padding-left: 0.7em;
}

#todolist .label {
    position: relative;
    transition: opacity .2s linear;
}

#todolist .done .label {
    opacity: .6;
}

#todolist .done .label:before {
    content: '';
    position: absolute;
    top: 50%;
    left: -.5rem;
    display: block;
    width: 0%;
    height: 1px;
    background: #FFF;
    animation: strikeitem .3s ease-out 0s forwards;
}

#todolist .btn-picto {
    border: none;
    background: none;
    -webkit-appearance: none;
    cursor: pointer;
    color: #FFF;
}


/* FORM */
form {
    margin-top: 3rem;
    display: flex;
    flex-wrap: wrap;
}

form label {
    min-width: 100%;
    margin-bottom: .5rem;
    font-size: 1.3rem;
}

form input {
    flex-grow: 1;
    border: none;
    background: #f7f1f1;
    padding: 0 1.5em;
    font-size: initial;
}

form button {
    padding: 0 1.3rem;
    border: none;
    background: #FF6666;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
    border: 1px solid rgba(255, 255, 255, .3);
    margin-left: 5px;
    cursor: pointer;
    transition: background .2s ease-out;
}

form button:hover {
    background: #FF5E5E;
}

form input,
form button {
    font-family: 'Quicksand', sans-serif;
    height: 3rem;
}

.logout-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #FF6666;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

.logout-btn:hover {
    background-color: #FF5E5E;
}
</style>
  