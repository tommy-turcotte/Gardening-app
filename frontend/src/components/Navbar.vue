<script setup>
defineProps({
  login_state: {
    type: Boolean,
    required: false
  }
})
</script>

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
        <router-link class="navbar-item is-size-4" to="/forum">Forum</router-link>
        <a class="navbar-item is-size-4">
         Search
        </a>
        <a class="navbar-item is-size-4">
         Log in
        </a>
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
  @import "../node_modules/bulma/bulma.sass";
</style>
