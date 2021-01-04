const path = require("path");

module.exports = {
  paths: function (paths) {
    paths.appIndexJs = path.resolve(__dirname, "src/containers/index.tsx");
    return paths;
  },
};
