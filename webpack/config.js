// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require("path");

module.exports = {
    mode: "development",
    // entry: "./src/index.ts",

    entry: {
        "embedded-chatbot": "./src/index.ts",
        "sorai-client": "./src/sorai/index.ts",
        "dev-panel": "./src/devpanel/index.ts",        
        "plugin.hello": "./src/platform/hello/index.ts",
    },

    output: {
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js",
        path: path.resolve('dist'),
        publicPath: "/dist/",
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    },

    watch: true,
    resolve: {
        extensions: [".webpack.js", ".ts", ".js"]
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },

    // plugins: [
    //     new BundleAnalyzerPlugin()
    // ]
}
