import path from 'path';

export default {
  mode: 'production',
  entry: './src/main.js',
  target: 'node',
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: 'main.js',
    path: path.join(path.resolve(''), '/dist/')
  },
};