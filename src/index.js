import React from 'react';
import ReactDOM from 'react-dom';
import './i18n/index';
import { Provider } from 'react-redux'
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, HashRouter } from 'react-router-dom'
import store from "./redux/index";
import App from './App';
import { createHashHistory } from 'history'
const history = createHashHistory()
ReactDOM.render(
  <Provider store={store}>
    <HashRouter basename='/' history={history}>
      <Route path={`/`} component={App}></Route>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
