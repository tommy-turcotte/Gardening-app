<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-menu">
      <div class="navbar-start ml-auto">
        <div class="navbar-brand">
            <router-link class="navbar-item" to="/">
            <img src="../assets/gardenlogo.png" alt="Gardening App Logo" style="max-height: 60px">
            </router-link>
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
        </div>
      </div>

      <div class="navbar-end mr-auto">

        <a v-if="isloggedin === true" class="navbar-item is-size-4">
         Watch List
        </a>
        <a v-if="isloggedin === true" class="navbar-item is-size-4">
         Crops and Yields
        </a>

        <router-link class="navbar-item is-size-4" to="/forum">Forum</router-link>
        <a class="navbar-item is-size-4">
         Search
        </a>

        <router-link v-if="isloggedin === true" class="navbar-item is-size-4" @click="logOut()" to="/">Log out</router-link>
        <router-link v-if="isloggedin === false" class="navbar-item is-size-4" to="/login">Log In</router-link>
        <router-link v-if="isloggedin === false" class="navbar-item is-size-4" to="/Register">Register</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios'

export default{
  name: 'NavBar',
  data(){
    return{
      isloggedin: false,
    };
  },
  beforeCreate() {
      axios.get("http://127.0.0.1:4321/authenticatedUser")
        .then(response=> {
          if (response.status == 200){
            this.isloggedin = true;
          }
          else{
            this.isloggedin = false;           
          }
         })
        .catch(error=> console.log(error));
      },
  methods: {
    logOut(){
      location.reload()
      axios.get("http://127.0.0.1:4321/logout")
        .then(response=> {
          if (response.status == 200){
            console.log("successfully logged out")
          }
        })
        .catch(error=> console.log(error));
      }
    }
}
</script>

<style lang="scss">
  @import '~bulma';
</style>
