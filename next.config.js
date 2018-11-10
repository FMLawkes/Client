/* eslint-disable import/unambiguous */
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withCSS = require('@zeit/next-css')

const nextConfig = {
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: 'bundle-analysis-server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: 'bundle-analysis-browser.html'
    }
  },
  // custom webpack config
  webpack(config, {dir, dev, isServer, buildId, defaultLoaders}) { // eslint-disable-line
    return config
  },
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1
  }
}

module.exports = withCSS(withBundleAnalyzer(nextConfig))
