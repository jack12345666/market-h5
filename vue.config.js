module.exports = {
  publicPath: './',
    devServer: {
      port: '8888',
      open: true,
      proxy: {
        '/api': {
          target: 'http://mall.chuangwo.net',
          changeOrigin: true,
          crossDomain: true,
          ws: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    },
  
}