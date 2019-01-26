<template>
    <div class="mod-home">
        <div class="logo"><img class="logo_img" src="../../assets/img/b_logo.png" alt="" /></div>
    </div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
.mod-home {
    .logo {
        position: absolute;
        left: 50%;
        top: 42%;
        .logo_img {
            width: 200px;
            height: auto;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
        }
        .title {
            font-size: 26px;
        }
    }
}
</style>
