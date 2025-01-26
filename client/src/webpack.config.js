const path = require('path');

module.exports = {
  entry: './src/index.js',  // Your main JavaScript entry file
  output: {
    path: path.resolve(__dirname, 'dist'),  // Where the bundled output will go
    filename: 'bundle.js',  // Output file name
  },
  module: {
    rules: [
      // Rule for handling images (png, jpg, gif)
      {
        test: /\.(png|jpe?g|gif)$/i,  // Match image file types
        use: [
          {
            loader: 'file-loader',  // Loader to process images
            options: {
              name: '[path][name].[ext]',  // Keeps original path and name
            },
          },
        ],
      },
      // Other loaders can go here, for example for JavaScript or CSS
      {
        test: /\.js$/,  // Process JavaScript files
        exclude: /node_modules/,
        use: 'babel-loader',  // Use Babel for JavaScript
      },
      {
        test: /\.css$/,  // Process CSS files
        use: ['style-loader', 'css-loader'],  // Use these loaders for CSS
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.css'],  // Default extensions to resolve
  },
};
