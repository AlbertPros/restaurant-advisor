const path = require('path');
module.exports = {
    entry: './src/presentation/public/js/restaurant-app.js',
    devtool: 'source-map',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'src', 'presentation', 'public', 'dist'),
        },
    module: {
        rules: [
            {
                test: /\.js$/,
                type: 'javascript/auto'
            }
        ]
    }
};