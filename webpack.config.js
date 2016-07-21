const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const srcPath = path.resolve(__dirname, "src");
const distPath = path.resolve(__dirname, "dist");

const tsloaders = [
    "babel-loader?" + JSON.stringify({
        plugins: ["transform-runtime"],
        presets: ["es2015"]
    }),
    "ts-loader"
];

module.exports = {
    entry: ["./src/app"],
    output: {
        path: distPath,
        publicPath: "/dist/",
        filename: "Hessellate.js",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"]
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: tsloaders,
                include: [srcPath]
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap"),
                include: [srcPath]
            }
        ],
    },

    plugins: [
        // This plugin moves all the CSS into a separate stylesheet
        new ExtractTextPlugin("Hessellate.css")
    ],

    debug: true,
    watch: false
};
