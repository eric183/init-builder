const path = require('path');
const fs = require('fs');
const process = require('process');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const _env = '';
const [projectName, buildPath, outPath, childPath] = [process.env.npm_package_config_build_name, process.env.npm_package_config_build_path, process.env.npm_package_config_build_outPath, process.env.npm_package_config_build_childPath];

const buildJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', projectName, 'front-build.json'), 'utf8'));

// console.log(projectName);
// console.log(path.join(__dirname, '..', projectName, buildJson.config.build.entryPath, buildJson.config.build.childPath));


// const buildInfo = process.env.npm_package_config_projects.find((project) => process.env.npm_package_config_build == project.name);
// console.log(path.resolve(__dirname, '../', buildPath, childPath ? childPath : '', 'index.jsx'));
// console.log(path.resolve(__dirname, '../', outPath ? outPath : ''));
// console.log(process.env.npm_package_config_build_name);
console.log(path.join(__dirname, '..', projectName, buildJson.config.devPath))

const buildObject = {
    entryFile: path.join(
        __dirname,
        '..',
        projectName,
        buildJson.config.build.entryPath,
        buildJson.config.build.childPath,
        buildJson.config.build.name + '.' + buildJson.config.build.entryScript
    ),
    // entryFile: path.resolve(__dirname, 'index.jsx'),
    cssOutFile: '../../styles/' + buildJson.config.build.name,
}

// console.log(buildJson.config.build.name)
// /**
//  * 
//  * @object defalt
//  * @return {webpackConfig}
//  * @auther kuangkuang
//  */
var componentDir = path.join(__dirname, '..', projectName, buildJson.config.build.entryPath)
var entryObj = {};

var thirdParty = {
    "jquery": "libs/jquery-1.11.2.min",
    "underscore": "libs/underscore-min",
    "browser": "libs/jquery.browser.min",
    "slider": "libs/jquery.slider.min",
    "formValidator": "libs/validator/formValidator",
    "formValidatorRegex": "libs/validator/formValidatorRegex",
    "transit": "libs/jquery.transit.min",
    "layer": "libs/layer/layer.min",
    "easie": "libs/jquery.easie.min",
    "three": "libs/three.min",
    "fancybox": "libs/fancybox/jquery.fancybox",
    "fancybox_add": "libs/fancybox/fancybox_add",
    "lazyload": "libs/jquery.lazyload",
    "swiper": "libs/swiper.min",
    "cycle": "libs/jquery.cycle.min",
    "jquery-ui": "libs/jquery-ui-1.11.4/jquery-ui",
    "suggest": "libs/suggest",
    "pagination": "libs/jk.pagination",
    "lettering": "libs/jquery.lettering",
    "textillate": "libs/jquery.textillate",
    "zclip": "libs/jquery.zclip.min",
    "jplayer": "libs/jplayer/jquery.jplayer.min",
    "datepicker": "libs/datepicker",
    "sticky": "libs/jquery.sticky-kit",
    'jcrop': "libs/jcrop/jquery.Jcrop",
    'mousewheel': "libs/jquery.mousewheel",
    'playlist': "libs/jplayer/jplayer.playlist",
    'qrcode': "libs/jquery.qrcode",
    'chroma': "libs/chroma.min",
    'turn': 'turn/turn.min',
    'jqueryui': 'turn/jquery-ui.custom.min',
    'wqZoom': 'turn/wqzoom',
    'cookie': 'libs/jquery.cookie'
}

for (let i in thirdParty) {
    thirdParty[i] = path.resolve(componentDir, thirdParty[i])
}

// console.log(thirdParty);

if (_env != 'ALL') {

    buildJson.config.projects.forEach(project => {
        // console.log(project);
        // var john =
        entryObj[project.childPath + '/' + project.name] = path.join(
            __dirname,
            '..',
            projectName,
            buildJson.config.build.entryPath,
            project.childPath,
            project.entryScript ? project.name + '.' + project.entryScript : project.name + '.' + 'js'
        )
    });
} else {
    entryObj = {
        [buildJson.config.build.childPath + '/' + buildJson.config.build.name]: buildObject.entryFile
    }
}


// console.log(entryObj);
console.log('asdfasdfasdfdasd' + path.join(componentDir, 'app/'))

// import "babel-polyfill";

module.exports = (_env) => {

    return {
        entry: entryObj,

        // ['babel-polyfill', buildObject.entryFile],
        output: {
            // libraryTarget: 'amd',

            filename: "[name].js",
            // filename: buildObject.outFile,
            path: path.join(__dirname, '..', projectName, buildJson.config.devPath)
        },
        module: {
            rules: [{
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    include: path.resolve(componentDir),
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            extends: path.join(__dirname, '.babelrc')
                                // presets: ['babel-preset-env', 'babel-preset-react'].map(require.resolve)
                        }
                    }]
                },
                {
                    test: /\.(css|scss)$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            "css-loader",
                            {
                                loader: "postcss-loader",
                                options: {
                                    config: { path: path.resolve(__dirname, 'postcss.config.js') }
                                }
                            }
                        ],
                    }),
                },
                {
                    test: /\.(png|eot|woff2|woff|ttf|svg|jpg|gif|mp3)$/,
                    // use: [
                    //     `file-loader?name=[name].[ext]&publicPath=../../assets/wow_event/${envFile}/images/&outputPath=./../images/`
                    // ],
                    use: [
                        `file-loader`
                    ]
                },

                {
                    test: /browser/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        'exports-loader?$.fn.browser'
                    ]
                },
                {
                    test: /underscore/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?_'

                    ]
                },
                {
                    test: /formValidator/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?formValidator'
                    ]
                },
                {
                    test: /formValidatorRegex/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?formValidatorRegex'
                    ]
                },
                {
                    test: /transit/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?transit'
                    ]
                },
                {
                    test: /layer/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.layer'
                    ]
                },
                {
                    test: /easie/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.easie'
                    ]
                },
                {
                    test: /three/,
                    use: [
                        // 'imports-loader?this=>window,jquery',
                        // 'exports-loader?THREE'
                    ]
                },
                {
                    test: /lazyload/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.lazyload'
                    ]
                },
                {
                    test: /layer/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.layer'
                    ]
                },
                {
                    test: /cycle/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.cycle'
                    ]
                },
                {
                    test: /fancybox/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.fancybox'
                    ]
                },
                {
                    test: /fancybox\_add/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?fancybox_add'
                    ]
                },
                {
                    test: /jquery\-ui/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.jquery-ui'
                    ]
                },
                {
                    test: /suggest/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?$.fn.suggest'
                    ]
                },
                {
                    test: /slider/,
                    use: [
                        // 'imports-loader?this=>window,jquery',
                        // 'exports-loader?slider'
                    ]
                },
                {
                    test: /pagination/,
                    use: [
                        // 'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.pagination'
                    ]
                },
                {
                    test: /lettering/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.lettering'
                    ]
                },
                {
                    test: /textillate/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.textillate'
                    ]
                },
                {
                    test: /zclip/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.zclip'
                    ]
                },
                {
                    test: /jplayer/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.jplayer'
                    ]
                },
                {
                    test: /datepicker/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.datepicker'
                    ]
                },
                {
                    test: /sticky/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.sticky'
                    ]
                },
                {
                    test: /jcrop/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.jcrop'
                    ]
                },
                {
                    test: /mousewheel/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.mousewheel'
                    ]
                },
                {
                    test: /qrcode/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.qrcode'
                    ]
                },
                {
                    test: /turn/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.turn'
                    ]
                },
                {
                    test: /wqZoom/,
                    use: [
                        'imports-loader?this=>window,jquery'
                    ]
                },
                {
                    test: /cookie/,
                    use: [
                        'imports-loader?this=>window,jquery',
                        // 'exports-loader?jQuery.fn.cookie'
                    ]
                },


            ]

        },
        plugins: [
            function() {
                this.plugin("done", function(stats) {
                    if (stats.compilation.errors && stats.compilation.errors.length) {
                        console.log(stats.compilation.errors);
                        // process.exit(1);
                    }
                    // ...
                });
            },
            new ExtractTextPlugin(buildObject.cssOutFile + ".css"),
            // new UglifyJSPlugin()
            new webpack.DefinePlugin({
                ENV: _env
            }),
            new webpack.LoaderOptionsPlugin({
                options: {
                    babel: {
                        extends: path.join(__dirname, '.babelrc')
                    }
                }
            })
        ],
        resolve: {
            extensions: [".js", ".jsx"],
            alias: Object.assign({
                entry_dir: path.resolve(__dirname),

                app: path.resolve(componentDir, 'app'),


                // app: path.resolve(componentDir, 'app'),

                // modules: path.resolve(__dirname, 'node_modules'),
                // vue: path.resolve(__dirname, 'node_modules/vue/dist/vue.common.js'),
                // lodash: path.resolve(__dirname,'node_modules/lodash/')
            }, thirdParty),
            modules: [
                path.resolve(__dirname, 'node_modules'),
                path.resolve(componentDir, 'app')
                // path.join(__dirname, projectName, buildJson.config.build.entryPath)
            ],
        },
        resolveLoader: {
            modules: [
                path.resolve(__dirname, 'node_modules'),
            ],
        },
    }
    devtool: "inline-source-map"
}