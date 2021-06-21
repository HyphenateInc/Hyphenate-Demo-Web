import React, { memo } from 'react'
import { InputBase, Icon } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    searchBox: {
        boxSizing: 'border-box',
        margin: '0 16px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        height: '56px',
        display: 'flex',
        alignItems: 'center'
    },
    search: {
        flex: 1,
        display: 'flex',
        height: '30px',
        position: 'relative',
        borderRadius: '15px',
        backgroundColor: fade("#111", 0.15),
        '&:hover': {
            backgroundColor: fade('#111', 0.25),
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
        width: '100%'
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `30px`,
        paddingRight: '5px',
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '100%',
            '&:focus': {
                width: '100%',
            },
        },
    },
}));

function SearchInput({ onChange, onBlur, style }) {
    const classes = useStyles();
    return (
        <div className={classes.searchBox} style={style}>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <Icon className="iconfont icon-sousuo icon"></Icon>
                </div>
                <InputBase
                    placeholder="search"
                    onChange={onChange}
                    onBlur={onBlur}
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                />
            </div>
        </div>
    )
}

export default memo(SearchInput)
