<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
  	updated(){
  		window.exportObj = this;
  	}
  }
</script>
