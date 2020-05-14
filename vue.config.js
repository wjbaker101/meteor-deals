const config = require('./common/config/config.json');

module.exports = {

    outputDir: './dist/frontend',

    devServer: {
        proxy: {
            '/api': {
                target: `http://localhost:${config.backend.port}`,
            },
        },
        disableHostCheck: true,
    },

    chainWebpack: (config) => {
        const svgRule = config.module.rule('svg');

        svgRule.uses.clear();

        svgRule
            .use('vue-svg-loader')
            .loader('vue-svg-loader');
    },

    pwa: {
        name: 'Meteor Deals',
        themeColor: '#121218',
        msTileColor: '#121218',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
    }
}
