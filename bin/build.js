import webpack from 'webpack';
import fs from 'fs-extra';
import _debug from 'debug';
import config from './config';
import webpackConfig from './webpack.config';

// 打包提示函数
const infoLog = _debug('app:compiler-info');
const warningLog = _debug('app:compiler-warning');
const errorLog = _debug('app:compiler-error');
const successLog = _debug('app:compiler-success');

// 目录函数
const paths = config.utils_paths;

// webpack 打包函数
function webpackCompiler() {
  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);
    // 运行 webpack 开始打包
    compiler.run((err, stats) => {
      if (err) {
        errorLog('💀 打包出现致命错误', err);
        return reject(err);
      }
      infoLog('😎 打包开始...', stats.toString(config.stats));
      const jsonStats = stats.toJson(); // 将错误信息转为 json 对象
      if (jsonStats.errors.length > 0) { // 打包出错
        errorLog('🤔 打包出错!');
        errorLog(jsonStats.errors.join('\n'));
        return reject(new Error(jsonStats.errors.join('\n')));
      }
      if (jsonStats.warnings.length > 0) { // 打包遇到警告 但不影响打包过程
        warningLog('⚠️ 打包出现警告');
        infoLog(jsonStats.warnings.join('\n'));
      }
      successLog('🍀 打包成功!');
      return resolve(jsonStats);
    });
  });
}

// 异步执行打包
(async function build() {
  try {
    // 执行打包函数
    const stats = await webpackCompiler();
    if (stats.warnings.length) {
      warningLog('😣 打包出现警告, 退出程序');
      process.exit(1);
    }
    successLog('🐹 复制静态资源...');
    fs.copySync(paths.src('static'), paths.dist()); // 后期加上雪碧图
  } catch (msg) {
    process.exit(1);
  }
}());
