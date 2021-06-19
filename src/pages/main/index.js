import React, { useState, memo, useEffect, useCallback } from 'react'
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import SessionList from '@/components/session/sessionList'
import AppBar from '@/components/appbar/appBar'
import Chat from '@/components/chat/index'
import { useParams, Route } from "react-router-dom";
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import SessionActions from '@/redux/session'
import MessageActions from '@/redux/message'
import BaseDrawer from '@/components/drawer/drawer'
import Notice from '@/components/notice'
import useStyles from './style'
const MemoAppBar = memo(AppBar)

function Main(props) {
    let { chatType, to } = useParams();
    const classes = useStyles();
    const dispatch = useDispatch()
    const messageList = useSelector(state => _.get(state, ['message', chatType, to], [])) || []
    const [showLeft, setShowLeft] = useState(true)
    const [showRight, setShowRight] = useState(true)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const drawerOpen = useSelector(state => state.common.showDrawer)

    useEffect(() => {
        to && dispatch(SessionActions.setCurrentSession(to))
    }, [to, dispatch])

    console.log(`当前宽度: ${props.width}`)
    // when width changed relayout
    useEffect(() => {
        if (isWidthUp('sm', props.width)) {
            console.log('大屏幕')
            setShowRight(true)
            setIsSmallScreen(false)
            setShowLeft(true)
            setShowRight(true)
        } else {
            console.log('小屏幕')
            setShowRight(false)
            setIsSmallScreen(true)
            setShowLeft(true)
            setShowRight(false)
        }
    }, [props.width])

    const handleGoBack = useCallback(() => {
        if (isWidthUp('xs', props.width)) {
            setShowLeft(true)
            setShowRight(false)
        }
    }, [props.width])

    const handleClickItem = useCallback((session) => {
        console.log('handleClickItem', session)
        const { sessionType, sessionId } = session
        if (sessionId === 'notice') {
            const redirectPath = '/notice'
            props.history.push(redirectPath + props.location.search)
            dispatch(SessionActions.setCurrentSession(sessionId))
        } else {
            if (!session.lastMessage) {
                dispatch(MessageActions.fetchMessage(sessionId, sessionType))
            }
            const redirectPath = `/${sessionType}/` + [sessionId].join('/')
            dispatch(SessionActions.setCurrentSession(sessionId))
            dispatch(MessageActions.clearUnreadAsync(sessionType, sessionId))
            props.history.push(redirectPath + props.location.search)
        }

        if (isWidthDown('xs', props.width)) {
            setShowLeft(false)
            setShowRight(true)
        }
    }, [props.width, props.history, dispatch, props.location])
    return (
        <div className={classes.root}>
            <header>
                <MemoAppBar
                    {...props}
                    isSmallScreen={isSmallScreen}
                    showLeft={showLeft}
                    showRight={showRight}
                    onGoBack={handleGoBack} />
            </header>
            <main className={classes.content}>
                <aside className={classes.aside} style={{ display: showLeft ? 'block' : 'none', width: isSmallScreen ? '100vw' : '26vw', maxWidth: isSmallScreen ? '100vw' : '400px' }}>
                    <SessionList onClickItem={handleClickItem} />
                </aside>

                <article className={classes.article} style={{ display: showRight ? 'block' : 'none' }}>
                    <Route
                        path="/:chatType/:to"
                        render={props => <Chat {...props} messageList={messageList} />}
                    />
                    <Route
                        path="/notice"
                        render={props => <Notice  {...props} />}
                    />
                </article>
                <BaseDrawer open={drawerOpen}></BaseDrawer>
            </main>
        </div >
    )
}

export default withWidth()(Main);


