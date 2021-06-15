import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { Button, TextField, Link, Grid, Box, FormControl, InputLabel, Input, IconButton, InputAdornment } from '@material-ui/core';
import i18next from "i18next";
import { message } from '@/components/common/Alert'
import LoginActions from '@/redux/login'
import CommonActions from '@/redux/common'
import useStyles from './style'
import agora from '@/assets/images/agora@2x.png'

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { withStyles } from '@material-ui/core/styles';

// import Sending from '@/components/common/sendingStatus'
const BaseInput = withStyles({
    "root": {
        color: '#00BA6E',
    },
})(TextField);

function Login(props) {
    const dispatch = useDispatch();
    const classes = useStyles(props);

    useEffect(() => {
        if (isWidthUp('sm', props.width)) {
            console.log('大屏幕')
            setShowBanner(true)
        } else {
            console.log('小屏幕')
            setShowBanner(false)
        }
    }, [props.width])

    const [showBanner, setShowBanner] = useState(true)
    const [values, setValues] = useState({
        userName: '',
        password: '',
        showPassword: false,
    });

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault()
        if (!values.userName || !values.password) {
            return message.error(i18next.t('The user name or password cannot be empty'))
        }
        dispatch(LoginActions.login(values.userName, values.password))
        dispatch(CommonActions.setLoading(true))
    }
    return (
        <div className={classes.container} >
            <Box className={classes.bannerBox} style={{ display: showBanner ? 'flex' : 'none' }}>
                <Box></Box>
            </Box>
            <Box className={classes.formBox}>
                <Box className="formContainer">
                    <Box className={classes.logoContainer}>
                        <img src={agora} alt='agora' />
                    </Box>
                    <form className={classes.form} >
                        <BaseInput
                            InputLabelProps={{
                                style: { color: '#00BA6E' }
                            }}
                            autoComplete="off"
                            inputProps={{ className: classes.input }}
                            margin="normal"
                            value={values.userName}
                            fullWidth
                            id="email"
                            label={i18next.t('username')}
                            name="email"
                            autoFocus
                            onChange={handleChange('userName')}
                        />
                        <FormControl className={classes.password}>
                            <InputLabel style={{ color: '#00BA6E' }} htmlFor="standard-adornment-password">{i18next.t('password')}</InputLabel>
                            <Input
                                autoComplete="off"
                                className={classes.input}
                                id="standard-adornment-password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleLogin}
                        >
                            {i18next.t('signin')}
                        </Button>

                        <Grid container>
                            <Grid item className={classes.registerText}>
                                {i18next.t("Don't have an account")}
                                <Link href="#/register" variant="body2">
                                    {i18next.t('signup')}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Box>
        </div >
    );
}

export default withWidth()(Login);

