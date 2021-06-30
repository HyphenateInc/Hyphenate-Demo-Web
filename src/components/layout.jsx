import React, { Component, useState, useMemo } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

function Layout(props) {

    const classes = useStyles();

    const [showLeft, setShowLeft] = useState(true)
    const [showRight, setShowRight] = useState(true)
    const [leftXs, setleftXs] = useState(3)

    useMemo(() => {
        if (isWidthUp('sm', props.width)) {
            setShowRight(true)
            setleftXs(3)
            setShowLeft(true)
            setShowRight(true)
        } else {
            setShowRight(false)
            setleftXs(12)
            setShowLeft(true)
            setShowRight(false)
        }
    }, [props.width])

    const handleGoBack = () => {
        setShowLeft(true)
        setShowRight(false)
    }

    const handleClickItem = (e) => {
        if (props.width === 'sm') {
            setShowLeft(false)
            setShowRight(true)
        }
    }
    return (
        <div className={classes.root}>
            <Grid container>
                {/* left pan */}
                <Grid item xs={leftXs}
                    style={{ display: showLeft ? 'block' : 'none' }}>
                    <SessionList onClickItem={handleClickItem} />
                </Grid>

                {/* right pan */}
                <Grid item xs style={{ display: showRight ? 'block' : 'none' }}>
                    <AppBar onGoBack={handleGoBack} />
                </Grid>
            </Grid>
        </div>
    )
}

export default withWidth()(Layout);


