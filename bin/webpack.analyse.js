const path = require('path');
const fs = require('fs');
const process = require('process');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// /**
//  * 
//  * @object defalt
//  * @return {webpackConfig}
//  * @auther kuangkuang
//  */
const buildObj = JSON.parse(fs.readFileSync(path.join(__dirname, '../bin/projectsInfo.json')));
// console.log(buildObj);

var entryObj = {};
// var entryObj = {
//     admin: ['babel-polyfill', path.join(__dirname, '../components', 'admin/admin.jsx')],
//     front: ['babel-polyfill', path.join(__dirname, '../components', 'front/front.jsx')]
// }

// for (let i in buildObj.config.projects) {

//     entryObj[buildObj.config.projects[i]["name"]] = ['babel-polyfill', path.join(__dirname, '../components', buildObj.config.projects[i]["path"])]
// }

entryObj[buildObj.config.dev["name"]] = ['babel-polyfill', path.join(__dirname, '../views', buildObj.config.dev["path"])]

console.log(entryObj);


console.log( path.resolve(__dirname, 'postcss.config.js'));
module.exports = (_env) => {

    return {
        mode: "development",
        entry: entryObj,

        // ['babel-polyfill', buildObject.entryFile],
        output: {
            // libraryTarget: 'amd',

            filename: "[name]/index.js",
            // filename: buildObject.outFile,
            path: path.join(__dirname, '..', 'assets')
        },
        module: {
            rules: [{
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
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
                }

            ]

        },
        plugins: [
            // new ExtractTextPlugin(buildObject.cssOutFile + ".css"),

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
                SERVICE_URL: JSON.stringify(buildObj.config.stringToHtmls.devStr)
            }),
            new webpack.LoaderOptionsPlugin({
                options: {
                    babel: {
                        extends: path.join(__dirname, '..', '.babelrc')
                    }
                }
            }),
            new BundleAnalyzerPlugin()
        ],
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".scss"],
            alias: {
                entry_dir: path.resolve(__dirname, '..'),

                // app: path.resolve(componentDir, 'app'),


                // app: path.resolve(componentDir, 'app'),

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