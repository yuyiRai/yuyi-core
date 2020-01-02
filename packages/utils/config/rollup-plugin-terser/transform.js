const { minify } = require("terser");

const transform = (code, optionsString) => {
  const options = eval(`(${optionsString})`);
  const result = minify(code, options);
  if (result.error) {
    throw result.error;
  } else {
    result.nameCache = options.nameCache
    return result;
  }
};

exports.transform = transform;
