<template>
    <div>
        <p>hi</p>
        <p v-if="disable">有</p>
    </div>
</template>

<script>
export default {
    props: ['disable'],
    data() {
        return {
            foo: {
                name: 'li',
            },
        };
    },
    mounted() {
        // debugger;
        console.log(this.disable);
    },
};
</script>
