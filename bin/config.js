// ======================================================
// 项目基本参数配置 autho: turbo
// ======================================================
import path from 'path';
import _debug from 'debug';
import Ip from 'ip';

const LOCAL_IP = Ip.address(); // 获取本地机器的 IP 地址
const PATH_BASE = path.resolve(__dirname, '..');
const log = _debug('app:config ');
const info = _debug('app:warning ');

// ----------------------------------
// 项目目录结构
// path_base -----> 根目录
// path_src  -----> 源代码目录
// path_dist -----> 生产目录
// ----------------------------------
const config = {
  env: process.env.NODE_ENV || 'development', // 环境变量
  path_base: PATH_BASE,
  path_src: 'src',
  path_dist: 'dist',
  // 服务端配置
  server_host: LOCAL_IP,
  server_port: process.env.PORT || 3000,
  // 第三方包: 手动添加
  vendor: [
    'babel-polyfill',
    'eventsource-polyfill',
    'react',
    'react-dom',
  ],
};

log('😈 加载默认配置...');
// ------------------------------------
// 获取基本路径 utility
// ------------------------------------
const base = (...args) =>
  Reflect.apply(path.resolve, null, [PATH_BASE, ...args]);
// ------------------------------------
// 编译配置
// ------------------------------------

const CompilerConfig = {
  development: () => ({
    // https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    devtool: 'eval-cheap-module-source-map',
    public_path: `http://${config.server_host}:${config.server_port}/`,
    proxy: {
      enabled: false,
      options: {
        host: '',
        match: /^\/api\/.*/,
      },
    },
  }),
  production: () => ({
    devtool: 'null',
    public_path: '/',
    hash_type: 'chunkhash',
    stats: {
      chunks: true,
      chunkModules: true,
      colors: true,
    },
  }),
};


// 获取项目路径
config.utils_paths = {
  base,
  src: base.bind(null, config.path_src),
  dist: base.bind(null, config.path_dist),
};

// 全局环境变量
config.globals = {
  __DEV__: config.env === 'development',
  __PROD__: config.env === 'production',
  'process.env': {
    NODE_ENV: JSON.stringify(config.env),
  },
  NODE_ENV: config.env,
};

// 获取生产环境下所依赖的第三方包
const pkg = require('../package.json');

config.vendor = config.vendor.filter((dep) => {
  if (!pkg.dependencies[dep]) {
    info(`"${dep}" 在 package.json 中未配置: 将不会打包到 vendor.js, 请在compiler_vendor中删除该依赖...`);
  }
  // 如果依赖正常返回
  return !!pkg.dependencies[dep];
});

// 区分打包和开发配置项
Object.assign(config, CompilerConfig[config.env]());

export default config;
