# Webpack+dashboard+React 集成环境框架
[![Build Status](https://travis-ci.org/zmGitHub/webpack-startkit.svg?branch=master)](https://travis-ci.org/zmGitHub/webpack-startkit)

集成 webpack+webpack-dashboard+HMR

## feature
- 支持多页面类型的React应用开发
- 实用Koa服务器进行构建,扩展性更强
- 分为开发环境(Dev)和上线(Prod)环境,可以自由选择并进行开发
- 支持React热加载,可以实现CSS及JS的热加载效果
- 附加Postcss工具,可实现Sass语法开发,自动填充CSS3兼容方案及CSS雪碧图的自动化构建

##使用的技术

- [x] [Webpack](https://webpack.github.io)
- [x] [React](https://facebook.github.io/react/)
- [x] [Babel](https://babeljs.io/)
- [x] [Koa](https://github.com/koajs/koa)
- [x] [PostCSS](https://github.com/postcss/postcss)
- [x] [precss](https://github.com/jonathantneal/precss)
- [x] [CSS modules](https://github.com/outpunk/postcss-modules)
- [x] [autoprefixer](https://github.com/postcss/autoprefixer)
- [x] [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard)

## 使用方法

```
**1. 安装依赖
npm install
**2. 开发模式
npm run dev
**3. 生产模式
npm run prod
```
