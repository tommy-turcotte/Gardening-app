<script setup>
import NavBar from '../components/NavBar.vue'
</script>
<template>
    <NavBar />
    <div class="section is-large has-background-link">
        <div class="columns is-centered">
            <div class="column is-one-third">
                <div class="container has-text-centered pb-6">
                    <h2 class="title is-2">
                        Register
                    </h2>
                </div>
                 <div class="box">
                    <label class="label">Enter Username:</label>
                    <input class="input" type="text" placeholder="Username">
                    <label class="label">Enter Email:</label>
                    <input class="input" type="email" placeholder="John.Smith@gmail.com">
                    <label class="label">Enter Password:</label>
                    <input class="input" type="password" placeholder="password">
                    <label class="label">confirm Password:</label>
                    <input class="input" type="password" placeholder="confirm password">
                    <div class="field is-grouped pt-4">
                        <p class="control">
                            <button class="button is-info" id="loginbtn">Register</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style lang="scss">
  @import '~bulma';
  h2 {
      color: white!important;
  }
</style>
