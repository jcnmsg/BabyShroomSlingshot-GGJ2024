import path from 'path';

export default {
  mode: 'development',
  entry: './src/main.js',
  watch: true,
  target: 'node',
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: 'main.js',
    path: path.join(path.resolve(''), '/dist/')
  },
};