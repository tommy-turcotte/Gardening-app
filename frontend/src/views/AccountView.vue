<template>
    <NavBar />
    <div class="section is-medium has-background-link">
        <div class="section is-medium has-background-link">
        <div class="columns is-centered is-mobile">
            <div class="column is-two-fifths">
                <div class="container has-text-centered pb-6">
                    <h2 class="title is-2">
                        Account Details
                    </h2>
                </div>
                 
                <section class="section">
                    <div class="card is-half">
                        <div class="card-content">
                                <div class="content">
                                <strong class="title is-4">Username: </strong><strong class="subtitle is-4" v-text="username"></strong>
                                <br>
                                <strong class="title is-4">Real Name: </strong><strong class="subtitle is-4" v-text="name"></strong>
                                <br>
                                <strong class="title is-4">Email: </strong><strong class="subtitle is-4" v-text="email"></strong>
                            </div>
                        </div>
                    </div>
                    
                </section>

            </div>
        </div>
    </div>
    </div>
</template>
<script>
import axios from 'axios'
import NavBar from '../components/NavBar.vue'

export default{
    name:'AccountView',
    components: {
         NavBar
    },
    data(){
        return{
            username: String,
            name: String,
            email: String
        }
    },
    beforeCreate(){
      axios.get("http://127.0.0.1:4321/authenticatedUser")
        .then(response=> {
          if (response.status == 200){
            this.username = response.data.username
            this.name = response.data.name
            this.email = response.data.email
            console.log("username gotten: "+this.username)
          }
          else{
            console.log("no user logged in")  
          }
         })
        .catch(error=> console.log(error));
    }
}
</script>
<style lang="scss">
@import '~bulma';
</style>