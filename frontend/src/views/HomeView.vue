<script setup>
import Tiles from '../components/BlockTiles.vue'
</script>
<template>
    <section class="hero is-link is-fullheight">
        <div class="hero-head">
            <div class="container is-link has-text-centered">
                <h1 class="title is-1 pt-6">
                Welcome to our gardening app
            </h1>
            </div>
            <!--<div class="container is-link">
                <h2 class="subtitle is-2 pl-6 pt-6">
                Samuel
            </h2>        
            </div>-->
        </div>
        <div class="hero-body">
            <div class="container mx-auto">
                <Tiles />
            </div>
        </div>
    </section>
</template>

<style lang="scss">
  @import "../node_modules/bulma/bulma.sass";
</style>
