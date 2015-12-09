module.exports = {
  entry: {
    'build/inject': './src/inject/index',
  },
  output: {
    path: './',
    filename: '[name].js'
  },
  watch: true,
  cache: true,
  node: {
    fs: 'empty'
  }
}
