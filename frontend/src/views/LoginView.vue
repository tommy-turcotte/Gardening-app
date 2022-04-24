<template>
    <NavBar />
    <div class="section is-large has-background-link">
        <div class="columns is-centered">
            <div class="column is-one-third">
                <div class="container has-text-centered pb-6">
                    <h2 class="title is-2">
                        Login
                    </h2>
                </div>
                 <div class="box">
                    <label class="label">Enter Username:</label>
                    <input v-model="un" class="input" type="text" placeholder="Username" id="usertext">
                    <label class="label">Enter Password:</label>
                    <input v-model="pw" class="input" type="password" placeholder="password" id="pwtext">
                    <div class="field is-grouped pt-4">
                        <p class="control">
                            <button class="button is-info" id="loginbtn" @click="submitForm(un,pw)">Log In</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import NavBar from '../components/NavBar.vue'

export default {
  name: 'LoginView',
  components: {
        NavBar
    }, 
  methods: {
      submitForm(un, pw){
          console.log(un);
          console.log(pw);
          axios.get(`http://127.0.0.1:4321/authInfo?username=${un}`)
            .then(response => {
                console.log(response)
                if (response.status != 200){
                    console.log("it broke");
                }
                else {
                    var hashedPw = "f9237ac8edea8290896099012be6e62fa23610e2ee5f1faa0260e7aff42a4f7ee83b3812ce36cc95c8784eed6273f22bafaec4ece5c4f017355aafe92f8dd8a5"
                    axios.get(`http://127.0.0.1:4321/login?username=${un}&hashedPw=${hashedPw}`)
                        .then(response => {
                            console.log(`Login body: ${response.data}`);
                            console.log(`Login status: ${response.status}`);
                            this.$emit('loginUpdate')
                            this.$router.push('/');
                        })
                        .catch(error=> console.log(error));
                }
        })
        .catch(error=> console.log(error));
        }
  }
}
</script>

<style lang="scss">
  @import '~bulma';
  h2 {
      color: white!important;
  }
</style>
