<template>
    <NavBar />
    <div class="section is-medium has-background-link">
        <div class="columns is-centered is-mobile is-vcentered">
            <div class="column is-one-third">
                <div class="container has-text-centered pb-6">
                    <h2 class="title is-2">
                        Register
                    </h2>
                </div>
                 <div class="box">
                    <label class="label">Enter Username:</label>
                    <input v-model="un" class="input" type="text" placeholder="Username">
                    <label class="label">Enter Name:</label>
                    <input v-model="rn" class="input" type="text" placeholder="John Smith">
                    <label class="label">Enter Email:</label>
                    <input v-model="email" class="input" type="email" placeholder="John.Smith@gmail.com">
                    <label class="label">Enter Password:</label>
                    <input v-model="pwInit" class="input" type="password" placeholder="password">
                    <label class="label">confirm Password:</label>
                    <input v-model="pwConf" class="input" type="password" placeholder="confirm password">
                    <div class="field is-grouped pt-4">
                        <p class="control">
                            <button class="button is-info" id="regbtn" @click="registerUser(un, rn, email, pwInit, pwConf)">Register</button>
                        </p>
                        <p v-if="!iscorrect" class="control is-danger">
                            Your passwords do not match
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import NavBar from '../components/NavBar.vue'
import axios from 'axios'
import md5 from 'md5'

export default{
    name: 'RegisterView',
    components: {
         NavBar
    },
    data() {
        return{
            iscorrect: true
        }
    },
    methods: {
        registerUser(un, rn, email, pwInit, pwConf){
            if (pwInit != pwConf){
                console.log("pwInit: "+pwInit)
                console.log("pwConf: "+pwConf)
                this.iscorrect = false;
            }
            else{
                var pw = md5(pwInit)
                axios.get(`http://127.0.0.1:4321/register?username=${un}&name=${rn}&email=${email}&hashedPw=${pw}`)
                        .then(response => {
                            console.log(`Reg body: ${response.data}`);
                            console.log(`Reg status: ${response.status}`);
                            this.$router.push('/');
                        })
                        .catch(error=> console.log(error));
            }
        },
    }
}

</script>

<style lang="scss">
  @import '~bulma';
  h2 {
      color: white!important;
  }
</style>
