import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { createLogger } from "redux-logger";
import thunk from 'redux-thunk'
import { loginReducer } from "./login";
import { commonReducer } from "./common"
import { messageReducer } from "./message"
import { rosterReducer } from "./roster"
import { sessionReducer } from './session'
import { reducer as groupMemberReducer } from './groupMember'
import { reducer as groupReducer } from './group'
import { reducer as chatRoomReducer } from './chatRoom'
import { reducer as noticeReducer } from './notice'
import './webim'
const logger = createLogger(); // initialize logger
const rootReducer = combineReducers({
    login: loginReducer,
    common: commonReducer,
    message: messageReducer,
    roster: rosterReducer,
    session: sessionReducer,
    group: combineReducers({
        groupMember: groupMemberReducer,
        group: groupReducer
    }),
    chatRoom: chatRoomReducer,
    notice: noticeReducer
})
const middlewares = [thunk, logger]
const enhancers = []
enhancers.push(applyMiddleware(...middlewares))
const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose

// const store = createStore(rootReducer, compose(
//     applyMiddleware(...middlewares),
//     window.devToolsExtension ? window.devToolsExtension() : f => f
// ))

const store = createStore(rootReducer, compose(...enhancers))

export default store

