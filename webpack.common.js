const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Fiber = require("fibers");
const path = require("path");

module.exports = () => ({
  entry: {
    main: [__dirname + "/index.html", "@babel/polyfill", "./main.js"]
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src/"),
      css: path.resolve(__dirname, "./assets/css/"),
      fonts: path.resolve(__dirname, "./assets/fonts/"),
      images: path.resolve(__dirname, "./assets/images/")
    },
    extensions: [".js", ".json", ".css", ".scss"]
  },
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        loader: "html-loader",
        options: {
          name: "[name].[ext]"
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] }
        }
      },
      {
        test: /\.(s*)css$/,
        use: [
          {
            loader:
              this.mode !== "production"
                ? "style-loader"
                : MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader", // translates CSS into CommonJS
            options: {
              plugins: () => [
                require("postcss-import"),
                require("postcss-preset-env")
              ],
              sourceMap: "true"
            }
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("dart-sass"),
              fiber: Fiber,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        exclude: [/\.*\/images/i],
        use: [
          {
            loader: "file-loader",
            options: {
              name:
                this.mode === "development"
                  ? "[name]-[hash].[ext]"
                  : "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: [/\.*\/fonts/i],
        use: [
          {
            loader: "file-loader",
            options: {
              name:
                this.mode === "development"
                  ? "[name]-[hash].[ext]"
                  : "[name].[ext]",
              outputPath: "images/"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename:
        this.mode === "development" ? "[name].css" : "[name].[hash].css",
      chunkFilename:
        this.mode === "development" ? "[id].css" : "[id].[hash].css"
    })
  ]
});
