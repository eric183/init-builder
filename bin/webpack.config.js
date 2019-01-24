// require('regenerator-runtime/runtime')

const path = require('path');
const fs = require('fs');
const process = require('process');

const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// /**
//  * 
//  * @object defalt
//  * @return {webpackConfig}
//  * @auther kuangkuang
//  */
const buildObj = JSON.parse(fs.readFileSync(path.join(__dirname, '../bin/projectsInfo.json')));
// console.log(buildObj);

var entryObj = {};

const IF_TS = /\.(tsx|ts)$/.test(buildObj.config.dev['path']);

entryObj[buildObj.config.dev["name"]] = ['babel-polyfill', path.join(__dirname, '../views', buildObj.config.dev["path"])]

// if(IF_TS) {
//     entryObj[buildObj.config.dev["name"]].shift();
// }


// console.log(entryObj[buildObj.config.dev["name"]]);

// console.log(path.resolve(__dirname, 'postcss.config.js'));
module.exports = (_env) => {

    return {
        mode: "development",
        entry: entryObj,

        // ['babel-polyfill', buildObject.entryFile],
        output: {
            // libraryTarget: 'amd',

            filename: "[name]/index.js",
            // filename: buildObject.outFile,
            path: path.join(__dirname, '..', 'assets'),
            chunkFilename: '[name].js',
            publicPath: '/assets/',

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
                            js: 'babel-loader'
                        }
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
                    test: /\.(css|scss)$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            "css-loader",
                            {
                                loader: "postcss-loader",
                                options: {
                                    config: {
                                        path: path.resolve(__dirname, 'postcss.config.js')
                                    }
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
                }

            ]

        },
        plugins: [
            // new ExtractTextPlugin(buildObject.cssOutFile + ".css"),
            new VueLoaderPlugin(),
            function() {
                this.plugin("done", function(stats) {
                    if (stats.compilation.errors && stats.compilation.errors.length) {
                        console.log(stats.compilation.errors);
                        // process.exit(1);
                    }
                    // ...
                });
            },
            new ExtractTextPlugin({
                filename: (getPath) => {
                    // console.log()
                    return getPath('[name]/style.css')
                        // console.log(getPath('css/[name].css'));
                },
                allChunks: true
            }),
            // new UglifyJSPlugin()
            new webpack.DefinePlugin({
                // ENV: JSON.stringify("production"),
                ENV: JSON.stringify("development"),
                SERVICE_URL: JSON.stringify(buildObj.config.stringToHtmls.devStr),
                // 'process.env.NODE_ENV': JSON.stringify('production')
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
                ENTRY_DIR: path.resolve(__dirname, '../'),
                util: path.resolve(__dirname, '../', 'util'),
                "@": path.resolve(__dirname, '../'),
                // app: path.resolve(componentDir, 'app')
                'vue$': 'vue/dist/vue.esm.js', // 用 webpack 1 时需用 'vue/dist/vue.common.js'
                
                
                modules: path.resolve(__dirname, '..', 'node_modules'),
                // vue: path.resolve(__dirname, 'node_modules/vue/dist/vue.common.js'),
                // lodash: path.resolve(__dirname,'node_modules/lodash/')
            },
            modules: [
                path.resolve(__dirname, '..', 'node_modules'),
                // path.resolve(componentDir, 'app')
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