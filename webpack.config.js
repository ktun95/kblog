const isDev = (process.env.NODE_ENV === 'development')
console.log(isDev)
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
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    }
  }