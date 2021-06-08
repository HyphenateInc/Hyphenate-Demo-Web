/*
   root router
*/
import { createHashHistory } from 'history'; // 如果是hash路由
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
export const history = createHashHistory();
const AuthorizedComponent = (props) => {
    console.log('AuthorizedComponent', props)
    const Component = props.component;
    console.log('component', Component);
    return props.token ? (
        <Switch>
            <Route path="/:chatType/:to" render={props => <Component {...props} />} />
            <Route path="/:chatType" render={props => <Component {...props} />} />
        </Switch>
    ) : <Redirect to="/login" />
}

export default withRouter(AuthorizedComponent);


