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
}
