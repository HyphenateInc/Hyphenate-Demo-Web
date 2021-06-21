import React, { useState } from 'react'
import CommonDialog from '@/components/common/dialog'
import i18next from "i18next";
import { Box, TextField, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useStore } from 'react-redux'
import GroupActions from '@/redux/group'
import { message } from '@/components/common/Alert'
import { useSelector } from 'react-redux'
const useStyles = makeStyles((theme) => {
    return ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: theme.spacing(100),
            paddingBottom: theme.spacing(4),
            padding: '16px 24px',
            boxSizing: 'border-box'
        },
        inputLabel: {
            marginBottom: theme.spacing(4),
            width: '100%'
        },
        button: {
            width: '50%',
            marginTop: theme.spacing(11),
            color: "#fff"
        }
    })
});

export default function ModifyInfoDialog({ open, onClose }) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState(null)
    const currentGroup = useSelector(state => state.session.currentSession)
    const handleClickSubmit = () => {
        if (!inputValue) {
            return setError(true)
        }
        dispatch(GroupActions.updateGroupInfoAsync({ groupId: currentGroup, groupName: inputValue }))
        message.success(i18next.t(' Submit Success'))
        setInputValue('')
        setError(null)
        onClose()
    }
    const handleChange = (event) => {
        setInputValue(event.target.value)
        setError(null)
    }
    const handleClose = () => {
        setInputValue('')
        setError(null)
        onClose()
    }
    function renderContent() {
        return (
            <Box className={classes.root}>
                <Typography className={classes.inputLabel}>
                    {i18next.t('Group Name')}
                </Typography>
                <TextField
                    label={i18next.t('Group Name')} variant="outlined" fullWidth autoFocus name="email"
                    error={error}
                    value={inputValue}
                    onChange={handleChange} />
                <Button
                    onClick={handleClickSubmit} variant="contained" color="primary" className={classes.button}>
                    {i18next.t('Submit')}
                </Button>
            </Box>
        )
    }

    return (
        <CommonDialog
            open={open}
            onClose={handleClose}
            title={i18next.t('Modify Info')}
            content={renderContent()}
        ></CommonDialog>
    )
}