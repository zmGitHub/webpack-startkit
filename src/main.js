import React from 'react';
import ReactDOM from 'react-dom';

import Button from 'components/Button';
import './styles/index.scss';

const MOUNT_NODE = document.getElementById('root'); // 获取应用启动节点
if (module.hot) {
  module.hot.accept();
}
ReactDOM.render(<Button name="点 我3123" />, MOUNT_NODE);

