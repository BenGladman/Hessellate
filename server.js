const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config");

const host = "0.0.0.0";
const port = 8080;
const listenAt = `http://${host}:${port}/`;

config.entry.unshift(`webpack-dev-server/client?${listenAt}`, "webpack/hot/only-dev-server");
config.module.loaders[0].loaders.unshift("react-hot-loader");
config.module.loaders[1].loaders.unshift("react-hot-loader");
config.plugins.push(new webpack.HotModuleReplacementPlugin());

const compiler = webpack(config);

const serverConfig = {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true
};

const onStartup = (err, result) => {
    if (err) {
        return console.log(`Startup Error...\n${err}`);
    }
    console.log(`Listening at ${listenAt}`);
};

const server = new WebpackDevServer(compiler, serverConfig);
server.listen(port, host, onStartup);
