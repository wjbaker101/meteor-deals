const config = require('./common/config/config.json');

module.exports = {

    outputDir: './dist/frontend',

    devServer: {
        proxy: {
            '/api': {
                target: `http://localhost:${config.backend.port}`,
            },
        },
    },

    chainWebpack: (config) => {
        const svgRule = config.module.rule('svg');

        svgRule.uses.clear();

        svgRule
            .use('vue-svg-loader')
            .loader('vue-svg-loader');
    },
}
