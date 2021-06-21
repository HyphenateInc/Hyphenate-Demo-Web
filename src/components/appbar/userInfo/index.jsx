import React, { useEffect, useState } from "react";
import CommonDialog from "@/components/common/dialog";
import i18next from "i18next";
import { Box, TextField, Avatar, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector, useStore } from "react-redux";
import Typography from "@material-ui/core/Typography";
import SettingsIcon from "@material-ui/icons/Settings";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import WebIM from "../../../common/WebIM";
import LoginActions from "@/redux/login"
const useStyles = makeStyles((theme) => {
    return {
        root: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: theme.spacing(100),
            paddingBottom: theme.spacing(4),
            margin: "16px 24px",
        },
        inputLabel: {
            marginBottom: theme.spacing(4),
            width: "100%",
        },
        button: {
            width: "50%",
            marginTop: theme.spacing(11),
            color: "#fff",
        },
        avatar: {
            width: theme.spacing(20),
            height: theme.spacing(20),
        },
        gridAvatar: {
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            marginBottom: theme.spacing(7),
        },
        gridItem: {
            display: "flex",
            alignItems: "center",
            width: "100%",
            margin: "10px 0"
        },
    };
});

export default function UserInfo({ open, onClose }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const ownInfo = useSelector(state => state.login.info) || {}
    const [inputValue, setInputValue] = useState(ownInfo.nickname);
    const [isEdit, setIsEdit] = useState(true);
    const [error, setError] = useState();

    const handleChange = (event) => {
        setInputValue(event.target.value);
        setError(null);
    };
    const handleClose = () => {
        setIsEdit(true)
        setError(null);
        onClose();
    };
    const handleClickSave = () => {
        dispatch(LoginActions.updateOwnInfo('nickname', inputValue))
        setIsEdit(true)
    }
    function renderContent() {
        return (
            <Box className={classes.root}>
                <div className={classes.gridAvatar}>
                    <Avatar className={classes.avatar} />
                </div>

                <div className={classes.gridItem}>
                    <Typography variant="inherit" noWrap style={{ width: "50px" }}>
                        {i18next.t("User Id")}
                    </Typography>

                    <Typography variant="inherit" noWrap>
                        {': ' + WebIM.conn.context.userId}
                    </Typography>
                </div>
                {/* 
                <div className={classes.gridItem}>
                    <span style={{ width: "50px" }}>
                        {i18next.t("nickname")}
                    </span>
                    <TextField
                        style={{ flex: '1' }}
                        variant="outlined"
                        autoFocus
                        name="userName"
                        size="small"
                        error={error}
                        defaultValue={ownInfo.nickname}
                        value={inputValue}
                        onChange={handleChange}
                        disabled={isEdit}
                    />
                    {isEdit ? (
                        <EditOutlinedIcon
                            style={{ color: "#888888", marginLeft: "10px" }}
                            onClick={() => setIsEdit(false)}
                        />
                    ) : (
                        <>
                            <Button style={{ width: "50px", minWidth: '0' }} onClick={handleClickSave}>{i18next.t("UserInfo-Save")}</Button>
                            <Button style={{ width: "50px", minWidth: '0' }} onClick={() => setIsEdit(true)}>{i18next.t("UserInfo-Cancel")}</Button>
                        </>
                    )}
                </div> */}
            </Box>
        );
    }

    return (
        <CommonDialog
            open={open}
            onClose={handleClose}
            title={i18next.t("Personal information")}
            content={renderContent()}
        ></CommonDialog>
    );
}
