import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import i18next from "i18next";
import { message } from '@/components/common/Alert'
import LoginActions from '@/redux/login'
import useStyles from '@/pages/login/style'
import agora from '@/assets/images/agora@2x.png'

import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

function Register(props) {
    // const num = useSelector(state => state.num);
    const dispatch = useDispatch();

    const classes = useStyles(props);

    useEffect(() => {
        if (isWidthUp('sm', props.width)) {
            setShowBanner(true)
        } else {
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

    const handleRegister = (e) => {
        e.preventDefault()
        if (!values.userName || !values.password) {
            return message.error(i18next.t('The user name or password cannot be empty'))
        }
        if (values.userName.length > 64 || values.password.length > 64) {
            return message.error(i18next.t('The user name or password is not valid'))
        }
        dispatch(LoginActions.register(values.userName, values.password))
        // props.setLoading(true)
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
                    <form className={classes.form} autoComplete="off">
                        <TextField
                            InputLabelProps={{
                                style: { color: '#00BA6E' }
                            }}
                            inputProps={{ className: classes.input }}
                            margin="normal"
                            value={values.userName}
                            fullWidth
                            label={i18next.t('username')}
                            name="email"
                            autoFocus
                            onChange={handleChange('userName')}
                        />
                        <FormControl className={classes.password}>
                            <InputLabel style={{ color: '#00BA6E' }} htmlFor="standard-adornment-password">{i18next.t('password')}</InputLabel>
                            <Input
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
                            onClick={handleRegister}
                        >
                            {i18next.t('signup')}
                        </Button>

                        <Grid container>
                            <Grid item className={classes.registerText}>
                                {i18next.t("Already have an account")}
                                <Link href="#/login" variant="body2">
                                    {i18next.t('signin')}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Box>
        </div >
    );
}

export default withWidth()(Register);



