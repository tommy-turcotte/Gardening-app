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

        <router-link v-if="isloggedin === true" class="navbar-item is-size-4" to="/Watch-List">Watch List</router-link>
        <a v-if="isloggedin === true" class="navbar-item is-size-4">
         Crops and Yields
        </a>
        <a class="navbar-item is-size-4">
         Search
        </a>
        <router-link v-if="isloggedin === true" class="navbar-item is-size-4" to="/Location">Add Location</router-link>
        <div v-if="isloggedin === true" class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link is-size-4">
          Profile
          </a>
          <div class="navbar-dropdown is-dark">
            <router-link v-if="isloggedin === true" class="navbar-item is-size-4" to="/Account">Account</router-link>
            <router-link v-if="isloggedin === true" class="navbar-item is-size-4" to="/Logout">Log out</router-link>
          </div>          
        </div>
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
}
</script>

<style lang="scss">
  @import '~bulma';
</style>
