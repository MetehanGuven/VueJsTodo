<template>
    <img class="logo" src="../assets/Signup-logotype-Standard-1.png" />
    <div class="register">
        <input typpe="text" v-model="name" placeholder="Enter Name" />
        <input typpe="text" v-model="email" placeholder="Enter Email" />
        <input typpe="text" v-model="password" placeholder="Enter Password" />
        <button v-on:click="signUp"> Sign Up </button>
        <p>
            <router-link to="/login"> Login </router-link>
        </p>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'SignUp',
    data() {
        return {
            name: '',
            email: '',
            password: ''
        }
    },
    methods: {
        async signUp() {
            let result = await axios.post("http://localhost:3000/users", {
                email: this.email,
                password: this.password,
                name: this.name

            });

            if (result.status == 201) {
                localStorage.setItem("user-info", JSON.stringify(result.data))
            }
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
     width: 200px;

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
