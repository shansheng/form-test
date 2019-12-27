<template>
  <div id="app">
    <router-link to="/about" class="nav-item">about</router-link>
    <router-link to="/" class="nav-item">home</router-link>
    <router-link to="/drag" class="nav-item">drag</router-link>
    <router-view/>
  </div>
</template>

<style>
.nav-item{
  margin-right:20px;
}
</style>
