<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
input:-webkit-autofill + label {
  -webkit-transform: translateY(-14px) scale(0.8);
  transform: translateY(-14px) scale(0.8);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
.btn, .btn-large, .btn-small {
  background-color:#ee6e73
}
</style>
