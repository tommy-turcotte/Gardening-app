<template>
    <div class="container has-text-centered">
            <img id="tileimg" src="../assets/Home-loggedin.png" width="800" height="450">
            <p></p>
            <button onclick="changeSelect('tile1')" class="button is-rounded is-dark px-4">1</button>
            <button onclick="changeSelect('tile2')" class="button is-rounded is-dark px-4">2</button>
    </div>
</template>

<style lang="scss">
  @import "../node_modules/bulma/bulma.sass";

  template {
      background-color: black;
  }
</style>
