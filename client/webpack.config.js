const path = require("path");
const webpack = require("webpack");
module.exports = {
  context: path.resolve(__dirname, "./src"),
  entry: [
    "babel-polyfill",
    "react-hot-loader/patch",
    // activate HMR for React

    "webpack-dev-server/client?http://localhost:8080",
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    "webpack/hot/only-dev-server",
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    "./index.js"
  ],
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
    publicPath: "/"
  },
  devServer: {
    contentBase: path.resolve(__dirname),
    hot: true, // New
    historyApiFallback: true
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        loaders: ["react-hot-loader/webpack", "babel-loader"]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "file-loader?limit=10000&minetype=application/font-woff"
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "file-loader"
          }
        ]
      },
      {
        test: /\.(obj|mtl)$/i,
        exclude: [/node_modules/],
        loaders: ["file-loader"]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: [/node_modules/],
        loaders: [
          "file-loader?hash=sha512&digest=hex&name=[hash].[ext]",
          "image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false"
        ]
      },
      {
        test: /(\.css|scss)$/,
        exclude: [/node_modules/],
        use: ["style-loader", "css-loader", "sass-loader", "resolve-url-loader"]
      }
      // Loaders for other file types can go here
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin()
    // prints more readable module names in the browser console on HMR updates
  ]
};
