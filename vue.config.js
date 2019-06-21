module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        nsis: {
          oneClick: true
        }
      }
    }
  }
}