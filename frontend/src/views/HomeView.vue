<script setup>
import Tiles from '../components/BlockTiles.vue'
import NavBar from '../components/NavBar.vue'
</script>
<template>
    <NavBar />
    <section class="hero is-link is-fullheight">
        <div class="hero-head">
            <div class="container is-link has-text-centered">
                <h1 class="title is-1 pt-6">
                Welcome to our gardening app
            </h1>
            </div>
        </div>
        <div class="hero-body">
            <div class="container mx-auto">
                <Tiles />
            </div>
        </div>
    </section>
</template>


<style lang="scss">
  @import '~bulma';
</style>
