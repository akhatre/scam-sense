const Dotenv = require('dotenv-webpack');
const path = require('path');


module.exports = (_, {mode}) => ({
  entry: './assets/index.js',  // path to our input file
  output: {
    filename: 'index_bundle.js',  // output bundle file name
    path: path.resolve(__dirname, './static'),  // path to our Django static directory
  },
  resolve: {
    extensions: ['.ts', '.js'],  // Resolve both TypeScript and JavaScript files
  },
  plugins: [
    new Dotenv({
      path: mode === 'production' ? './assets/env/prod' : './assets/env/dev',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env", "@babel/preset-react", '@babel/preset-typescript'] }
      },
        {
        test: /\.scss$/, // This handles SCSS files
        use: ['style-loader', 'css-loader', 'sass-loader'], // Process SCSS into CSS and inject into the DOM
      },
    ]
  }
});
