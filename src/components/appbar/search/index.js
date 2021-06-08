import React, { memo } from 'react'
import { IconButton, Icon, InputBase } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => {
    return ({
        search: {
            position: 'relative',
            borderRadius: '15px',
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `30px`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '0',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    })
})
function SearchInput() {
    const classes = useStyles();

    return (
        <>
            {/* <IconButton className="iconfont icon-sousuo icon"></IconButton> */}
            < div className={classes.search} >
                <div className={classes.searchIcon}>
                    <IconButton className="iconfont icon-sousuo icon"></IconButton>
                </div>
                <InputBase
                    placeholder=""
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                />
            </div >
        </>
    )
}

export default SearchInput