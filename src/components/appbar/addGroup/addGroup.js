import React, { useState } from 'react'
import CommonDialog from '@/components/common/dialog'
import i18next from "i18next";
import { Box, TextField, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useStore } from 'react-redux'
import GroupActions from '@/redux/group'
import { message } from '@/components/common/Alert'
const useStyles = makeStyles((theme) => {
    return ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
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

export default function AddGroupDialog({ open, onClose }) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState(null)
    const addGroup = () => {
        if (!inputValue) {
            return setError(true)
        }
        dispatch(GroupActions.joinGroup(inputValue))
        message.success(i18next.t('Successfully send the application'))
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
                    {i18next.t('Group Id')}
                </Typography>
                <TextField
                    id="outlined-basic" label="groupId" variant="outlined" fullWidth autoFocus name="email"
                    error={error}
                    value={inputValue}
                    onChange={handleChange} />
                <Button
                    onClick={addGroup} variant="contained" color="primary" className={classes.button}>
                    {i18next.t('Add Groups')}
                </Button>
            </Box>
        )
    }

    return (
        <CommonDialog
            open={open}
            onClose={handleClose}
            title={i18next.t('Add Groups')}
            content={renderContent()}
        ></CommonDialog>
    )
}