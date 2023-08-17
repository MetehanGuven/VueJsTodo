<template>
    <img class="logo" src="../assets/images.png" />
    <div class="register">
        <input typpe="text" v-model="email" placeholder="Enter Email" />
        <input typpe="text" v-model="password" placeholder="Enter Password" />
        <button v-on:click="signIn"> Login </button>
        <p>
            <router-link to="/sign-up"> SignUp </router-link>
        </p>
        <div v-if="error !== ''"> {{ error }} </div>
    </div>
</template>
<script>

import axios from 'axios'
export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            error: ''
        }
    },
    methods: {
        async signIn() {
            this.error = ''
            let result = await axios.get(`http://localhost:3000/users?email=${this.email}&password=${this.password}`)
            if (result.data.length > 0) {
                let user = result.data[0]
                localStorage.setItem('user-info', JSON.stringify(user));
                this.loadTodoItems(user.id);
                this.$router.push({ name: 'Home' })
            }
            else {
                this.error = "Hatali Giris"
            }
        },
        async loadTodoItems(userId) {
            let result = await axios.get(`http://localhost:3000/Todos?userId=${userId}`);
            this.$store.commit('setTodoItems', result.data);
        }
    },
    mounted() {
        let user = localStorage.getItem('user-info');
        if (user) {
            this.$router.push({ name: 'Home' })
        }
    }
}
</script>
<style> .logo {
     width: 225px;

 }

 .register {
     display: flex;
     flex-direction: column;
     align-items: center;
 }

 .register input {
     width: 300px;
     height: 40px;
     padding-left: 20px;
     display: block;
     margin-bottom: 30px;
     margin-right: auto;
     margin-left: auto;
     border: 1px solid skyblue;
 }

 .register button {
     width: 120px;
     height: 40px;
     border: 1px solid skyblue;
     background: orange;
     color: white;
     cursor: pointer;
 }
</style>
