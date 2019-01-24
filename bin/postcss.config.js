const postcssPresetEnv = require('postcss-preset-env');
// const precss = require("precss");
// const cssnano = require("cssnano");

module.exports = {
    parser: require('postcss-scss'),
    plugins: {
        "precss": {},
        "postcss-preset-env": {
            stage: 0,
            browsers: 'last 2 versions'
        }
        // require("postcss-cssnext")({
        //     features: {
        //         rem: false
        //             // customProperties: {
        //             //     variables: require("./varibles.js")
        //             // }
        //     }
        // }),
        // require('postcss-for')({}),
        // precss({}),
        // postcssPresetEnv({
        //     stage: 0,
        //     browsers: 'last 2 versions'
        // })
        // cssnano({
        //     preset: 'default',
        // })
        // require("autoprefixer")()
    }
}