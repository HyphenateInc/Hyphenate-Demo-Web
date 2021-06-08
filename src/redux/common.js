import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import Cookie from 'js-cookie'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setLoading: ['fetching'],
    setActiveContact: ['chatType', 'contact'],
    setShowDrawer: ['isShow'],
})

const INITIAL_STATE = {
    fetching: false,
    activeContact: null,
    showDrawer: false
}
/* ------------- Reducers ------------- */

export const setLoading = (state = INITIAL_STATE, { fetching }) => {
    return Immutable.merge(state, {
        fetching
    })
}
export const setActiveContact = (state, { chatType, contact }) => {
    return state.merge({ activeChatType: chatType, activeContact: contact })
}

export const setShowDrawer = (state, { isShow }) => {
    return state.merge({ showDrawer: isShow })
}


/* ------------- Hookup Reducers To Types ------------- */
export const commonReducer = createReducer(INITIAL_STATE, {
    [Types.SET_LOADING]: setLoading,
    [Types.SET_ACTIVE_CONTACT]: setActiveContact,
    [Types.SET_SHOW_DRAWER]: setShowDrawer
})

export default Creators

