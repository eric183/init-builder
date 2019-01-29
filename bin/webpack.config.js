// require('regenerator-runtime/runtime')

const path = require('path');
// const fs = require('fs');
// const process = require('process');

const webpack = require('webpack');

const MiniCssExtractPlugin  = require("mini-css-extract-plugin");
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const entryObj = {};
// /**
//  * 
//  * @object defalt
//  * @return {webpackConfig}
//  * @auther kuangkuang
//  */
const buildObj = require(path.join(__dirname, 'projectsInfo.json'));

// const IF_TS = /\.(tsx|ts)$/.test(buildObj.config.dev['path']);

entryObj[buildObj.config.dev["name"]] = ['babel-polyfill', path.join(__dirname, '../src', buildObj.config.dev["path"])]

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

// function assetsPath(_path) {
// 	const assetsSubDirectory =
// 		process.env.NODE_ENV === "production"
// 		? config.build.assetsSubDirectory
// 		: config.dev.assetsSubDirectory;

// 	return path.posix.join(assetsSubDirectory, _path);
// }

const ENV_OBJECT = {
    NODE_ENV: true
}

module.exports = (_env) => {

    return {
        // mode: "development",
        // optimization: {
        //     nodeEnv: 'development'
        // },
        entry: entryObj,

        // ['babel-polyfill', buildObject.entryFile],
        output: {
            // libraryTarget: 'amd',

            // filename: "[name]/index.js",
            filename: "index.js",
            // filename: buildObject.outFile,
            path: path.join(__dirname, '..', 'dist'),
            chunkFilename: "./[name].js",
            publicPath: '/dist/'

            // chunkFilename:'js/[id].[chunkhash].js',
            // publicPath: path.resolve(__dirname, '/'),
        },
        module: {
            rules: [{
                test: /\.(ts|tsx)?$/,
                use: 'awesome-typescript-loader',
                // exclude: /node_modules/
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'babel-loader',
                        // css: MiniCssExtractPlugin.loader
                    },
                }
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        extends: path.join(__dirname, '..', '.babelrc')
                        // presets: ['babel-preset-env', 'babel-preset-react'].map(require.resolve)
                    }
                }]
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },
            {
                test: /\.(css|scss)$/,
                // use: [

                //     // {
                //     //     loader: MiniCssExtractPlugin.loader,
                //     //     options: {
                //     //       // you can specify a publicPath here
                //     //       // by default it use publicPath in webpackOptions.output
                //     //       publicPath: '../'
                //     //     }
                //     // },
                //     'vue-style-loader',
                //     // 'style-loader',
                //     {
                //         loader: 'css-loader',
                //         // exclude: /element\-ui\/lib\/theme\-chalk\/index\/\.css/,
                //         options: { 
                //             importLoaders: 1, 
                //             // modules: true,
                //             // exportOnlyLocals: true
                //             // localIdentName: '[path][name]'
                //         },
                        
                //     },
                //     {
                //         loader: 'postcss-loader',
                //         // exclude: /node_modules/,
                //         options: {
                //             ident: 'postcss',
                //             parser: require('postcss-scss'),
                //             plugins: [
                //                 // require('postcss-partial-import')(), 
                //                 // require('postcss-import')(), 
                //                 require('precss')(),
                //                 require('postcss-cssnext')(),
                //                 require('postcss-preset-env')(),
                //                 require('cssnano')(),

                //                 // require('postcss-import')(),
                //                 // 'postcss-import': {},
                //                 // 'cssnano': {}
                //                 // require('stylelint')(),
                //             ]
                //         }
                //     }
                // ]
                oneOf: [
                    //只对module生效
                    {
                        resourceQuery: /module/,
                        use: [

                            // {
                            //     loader: MiniCssExtractPlugin.loader,
                            //     options: {
                            //       // you can specify a publicPath here
                            //       // by default it use publicPath in webpackOptions.output
                            //       publicPath: '../'
                            //     }
                            // },
                            'vue-style-loader',
                            // 'style-loader',
                            {
                                loader: 'css-loader',
                                // exclude: /element\-ui\/lib\/theme\-chalk\/index\/\.css/,
                                options: { 
                                    importLoaders: 1, 
                                    modules: true,
                                    // exportOnlyLocals: true
                                    // localIdentName: '[path][name]'
                                },
                                
                            },
                            {
                                loader: 'postcss-loader',
                                // exclude: /node_modules/,
                                options: {
                                    ident: 'postcss',
                                    parser: require('postcss-scss'),
                                    plugins: [
                                        // require('postcss-partial-import')(), 
                                        // require('postcss-import')(), 
                                        require('precss')(),
                                        require('postcss-cssnext')(),
                                        require('postcss-preset-env')(),
                                        require('cssnano')(),

                                        // require('postcss-import')(),
                                        // 'postcss-import': {},
                                        // 'cssnano': {}
                                        // require('stylelint')(),
                                    ]
                                }
                            }
                        ]
                    },
                    {
                       
                        use: [

                            // {
                            //     loader: MiniCssExtractPlugin.loader,
                            //     options: {
                            //       // you can specify a publicPath here
                            //       // by default it use publicPath in webpackOptions.output
                            //       publicPath: '../'
                            //     }
                            // },
                            'vue-style-loader',
                            {
                                loader: 'css-loader',
                                options: { 
                                    importLoaders: 1, 
                                    // modules: true,
                                },
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    ident: 'postcss',
                                    parser: require('postcss-scss'),
                                    plugins: [
                                        require('precss')(),
                                        require('postcss-cssnext')(),
                                        require('postcss-preset-env')(),
                                        require('cssnano')(),
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            // {
            //     test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
            //     include: [
            //         path.resolve('..', 'src'),
            //         path.resolve('..','node_modules/element-ui/')],
            //     use: [{
            //         loader: 'url-loader',
            //         options: {
            //             useRelativePath: true,
            //             limit: 10000
            //         }
            //     }]
            // }
                // {
                //     test: /\.(css|scss)$/,
                //     use: ExtractTextPlugin.extract({
                //         fallback: "style-loader",
                //         use: [
                //             "css-loader",
                //             {
                //                 loader: "postcss-loader",
                //                 options: {
                //                     config: {
                //                         path: path.resolve(__dirname, 'postcss.config.js')
                //                     }
                //                 }
                //             }
                //         ],
                //     }),
                // },
                {
                	test: /\.svg$/,
                	loader: "svg-sprite-loader",
                	include: [
                        resolve("src/icons"),
                        // resolve("src/assets/css/icon")
                    ]
                },
                {
                	test: /\.(png|jpe?g|gif)(\?.*)?$/,
                	loader: "file-loader",
                	// exclude: [
                    //     resolve('..', "src/icons")
                    // ],
                    include: [
                        resolve('src')
                    ],
                	options: {
                		limit: 10000,
                		name: "img/[name].[hash:7].[ext]"
                	}
                },
                {
                	test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: "file-loader",
                    
                	options: {
                		limit: 10000,
                		name: "media/[name].[hash:7].[ext]"
                	}
                },
                {
                	test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: "url-loader",
                    // include: [
                    //     resolve('src'),
                    //     // resolve('node_modules/element-ui')
                    //     // resolve('node_modules/element-ui/lib/theme-chalk')
                    // ],
                	options: {
                		limit: 10000,
                		name: "fonts/[name].[hash:7].[ext]"
                	}
                }
            ]

        },
        plugins: [
            // new ExtractTextPlugin(buildObject.cssOutFile + ".css"),
            // new MiniCssExtractPlugin({
            //     filename: "[name].css",
            //     chunkFilename: "[id].css"
            // }),
            new VueLoaderPlugin(),
            // function () {
            //     this.plugin("done", function (stats) {
            //         if (stats.compilation.errors && stats.compilation.errors.length) {
            //             console.log(stats.compilation.errors);
            //             // process.exit(1);
            //         }
            //         // ...
            //     });
            // },
            // new ExtractTextPlugin({
            //     filename: (getPath) => {
            //         // console.log()
            //         return getPath('[name]/style.css')
            //         // console.log(getPath('css/[name].css'));
            //     },
            //     allChunks: true
            // }),
            // new UglifyJSPlugin()
            new webpack.DefinePlugin({
                // ENV: JSON.stringify("production"),
                ENV: JSON.stringify("development"),
                SERVICE_URL: JSON.stringify(buildObj.config.stringToHtmls.devStr),
                'process.env.NODE_ENV': JSON.stringify("development"),
            }),
            new webpack.LoaderOptionsPlugin({
                options: {
                    babel: {
                        extends: path.join(__dirname, '..', '.babelrc')
                    }
                }
            })
        ],
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".scss", ".vue"],
            alias: {
                ENTRY_DIR: path.resolve(__dirname, '..'),
                util: path.resolve(__dirname, '..', 'util'),
                "@": path.resolve(__dirname, '..', 'src'),
                // app: path.resolve(componentDir, 'app')
                'vue$': 'vue/dist/vue.esm.js', // 用 webpack 1 时需用 'vue/dist/vue.common.js'
                // 'element-ui': path.resolve(__dirname, '..', 'node_modules/element-ui/lib'),
                // 'element-ui/lib/theme-chalk/index.css': path.join(__dirname, '..', 'node_modules/element-ui/lib/theme-chalk/index.css'),

                modules: path.resolve(__dirname, '..', 'node_modules'),
                // vue: path.resolve(__dirname, 'node_modules/vue/dist/vue.common.js'),
                // lodash: path.resolve(__dirname,'node_modules/lodash/')
            },
            modules: [
                path.resolve(__dirname, '..', 'node_modules'),
                path.resolve(__dirname, '..', 'node_modules/element-ui/lib/theme-chalk'),
                path.resolve(__dirname, '..', 'src/assets/css'),
                // path.join(__dirname, projectName, buildJson.config.build.entryPath)
            ],
        },
        resolveLoader: {
            modules: [
                path.resolve(__dirname, '..', 'node_modules'),
            ],
        },
    }
    devtool: "inline-source-map"
}