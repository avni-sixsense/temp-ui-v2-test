const path = require('path');

module.exports = {
  webpack: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      worker: 'worker-plugin/loader?esModule'
    },

    configure: webpackConfig => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      webpackConfig.resolve.fallback = {
        path: require.resolve('path-browserify')
      };

      return webpackConfig;
    }
  }
};
