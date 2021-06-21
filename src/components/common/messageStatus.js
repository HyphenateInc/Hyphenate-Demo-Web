import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import clsx from 'clsx';
const useStyles = makeStyles((theme) => ({
    'MuiCircularProgressSvg': {
        width: '15px',
        height: '15px',
        color: '#e0e0e0',
        margin: '0 4px'
    },
    failIcon: {
        color: 'red'
    }
}))
function SedndingStatus({ status, style = {} }) {
    const classes = useStyles();
    let statusIcon = ''
    switch (status) {
        case 'sending':
            statusIcon = <svg className={classes.MuiCircularProgressSvg} viewBox="22 22 44 44" style={style}><circle className="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate" cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6"></circle></svg>
            break;
        case 'fail':
            statusIcon = <Icon className={clsx(classes.failIcon, "iconfont icon-weifasongchenggong")} style={style}></Icon>
            break;
        default:
            statusIcon = ''
            break
    }
    return statusIcon
}

export default memo(SedndingStatus)