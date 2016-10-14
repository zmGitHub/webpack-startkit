import Koa from 'koa';
// 因为当前的版本还不支持 async 语法 所以还得把中间件转换为 generator的写法
import convert from 'koa-convert';
import server from 'koa-static';
import proxy from 'koa-proxy';
import historyApiFallback from 'koa-connect-history-api-fallback';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import DashboardPlugin from 'webpack-dashboard/plugin';
import webpack from 'webpack';
import _debug from 'debug';
import config from './config';
import webpackConfig from './webpack.config';

const debug = _debug('app:server');
const paths = config.utils_paths; // 文件目录 utility
const port = config.server_port; // 服务器端口
const host = config.server_host; // 服务 ip
const app = new Koa(); // 创建 koa 的实例

// 是否启用 API 服务器
if (config.proxy && config.proxy.enabled) {
  app.use(convert(proxy(config.proxy.options)));
}

// 让 url 永远指向 index.html 方便 react-outer
app.use(convert(historyApiFallback({
  verbose: false, // 取消日志消息
})));

// 区分生产和开发
if (config.env === 'development') {
  debug('👽 开发模式加载完成');
  const {
    publicPath,
  } = webpackConfig.output;
  const complie = webpack(webpackConfig);
  complie.apply(new DashboardPlugin());
  app.use(convert(webpackDevMiddleware(complie, {
    publicPath,
    contentBase: paths.src(),
    // 服务一起动开始 webpack 编译
    lazy: false,
    hot: true,
    quiet: true, // 是否在 console 里面显示信息
    noInfo: true, // 是否在命令行中显示错误
    stats: {
      colors: true,
    },
    historyApiFallback: true,
  })));
  // 启用热部署插件
  app.use(convert(webpackHotMiddleware(complie)));
  // 静态文件请求
  app.use(convert(server(paths.src('static'))));
} else {
  debug('😻 打包完成, 模拟线上环境');
  app.use(convert(server(paths.dist())));
}

app.listen(port, (err) => {
  if (err) {
    debug(err);
  }
  debug(`🚀 外网访问: http://${host}:${port}`);
  debug(`💻 本机测试: http://localhost:${port}`);
});
