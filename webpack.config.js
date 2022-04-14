const isDev = (process.env.NODE_ENV === 'development')
console.log('node_env = dev?:', isDev, process.env.NODE_ENV)
// console.log(process.env.NODE_ENV)
module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: [
      // 'core-js/stable',
      './client/index.js'
    ],
    output: {
      path: __dirname,
      filename: './public/bundle.js'
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      fallback: {"buffer": require.resolve("buffer/")}
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }