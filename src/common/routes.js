/*
   root router
*/
import { createHashHistory } from 'history';
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
export const history = createHashHistory();
const AuthorizedComponent = (props) => {
    const Component = props.component;
    return props.token ? (
        <Switch>
            <Route path="/:chatType/:to" render={props => <Component {...props} />} />
            <Route path="/:chatType" render={props => <Component {...props} />} />
        </Switch>
    ) : <Redirect to="/login" />
}

export default withRouter(AuthorizedComponent);


