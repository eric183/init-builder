<template>
    <transition name="fade">
        <router-view></router-view>
        <!-- <Main /> -->
        
    </transition>
</template>

<script>
// import Main from './views/main';


export default {
    
    // components: {
    //     MainLL
    // }, 
    updated() {
        window.exportObj = this;
    }
};
</script>
