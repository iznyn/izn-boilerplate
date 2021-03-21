const path = require("path");

module.exports = async ({ config }) => {
  // Pug
  config.module.rules.push({
    test: /\.pug$/,
    use: ['babel-loader', 'storypug/lib/webpack-loader.js'],
  });

  // Sass
  config.module.rules.push({
    test: /\.s[ac]ss$/i,
    loaders: ["style-loader", "css-loader", "sass-loader"],
    include: path.resolve(__dirname, "../")
  });

  return config;
};
