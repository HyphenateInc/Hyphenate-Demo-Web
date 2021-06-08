import './App.css';
import React, { Component, memo } from 'react'
import { connect } from 'react-redux'
import {
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import Login from './pages/login'
import Register from './pages/register'
import Main from './pages/main'
import AuthorizedComponent from "./common/routes";
import Loading from '@/components/common/Loading'
import Theme from '@/theme'
import { getToken, getUserName } from '@/utils'
import LoginActions from '@/redux/login'
import '@/assets/iconfont.css'
const MemoLoading = memo(Loading)
const MemoLogin = memo(Login)
const MemoRegister = memo(Register)

class App extends Component {
  constructor(props) {
    super(props)
    console.log('props', this.props)
    this.state = {}
  }

  componentDidMount() {
    if (getToken()) {
      console.log('token登录')
      this.props.loginByToken(getUserName(), getToken())
    }
  }
  render() {
    const { token, fetching } = this.props
    return (
      <Theme>
        <MemoLoading show={fetching}></MemoLoading>
        <Switch>
          <Route exact path="/login" component={MemoLogin} />
          <Route exact path="/register" component={MemoRegister} />
          {/* <Route exact path="/app" component={Main} /> */}
          <Route path="/" render={props => <AuthorizedComponent {...this.props} token={token} component={Main} />} />
        </Switch>
      </Theme>
    );
  }
}

export default withRouter(connect(
  ({ login, common }) => ({
    token: login.token,
    fetching: common.fetching
  }),
  dispatch => ({
    loginByToken: (username, token) => dispatch(LoginActions.loginByToken(username, token))
  })
)(App));

