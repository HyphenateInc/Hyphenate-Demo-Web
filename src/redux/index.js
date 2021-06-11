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
import Immutable from 'seamless-immutable'
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
const initState = Immutable({
    login: {},
    message: {
        byId: {},
        singleChat: {},
        groupChat: {},
        chatRoom: {},
        stranger: {},
        extra: {},
        unread: {
            singleChat: {},
            groupChat: {},
            chatRoom: {},
            stranger: {},
        }
    },
    common: { fetching: false },
    session: {
        sessionList: [],
        currentSession: ''
    },
    group: {
        groupMember: { groupMember: [] },
        group: {
            groupList: [], byId: {},
            names: []
        }
    },
    chatRoom: { chatRoomList: [] },
    notice: { notices: [] },
    roster: {
        byName: null,
        names: [],
        friends: []
    }
})

const appReducer = (state, action) => {
    if (action.type === 'LOGOUT') {
        state = initState
    }

    return rootReducer(state, action)
}


// const appReducer = (state = initState, action) => {
//     const newState = combinedReducer(state, action)
//     return rootReducer(newState, action)
// }
const store = createStore(appReducer, compose(...enhancers))

export default store

