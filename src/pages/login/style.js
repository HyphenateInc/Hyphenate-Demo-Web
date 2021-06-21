import { makeStyles } from '@material-ui/core/styles';
import banner from '@/assets/images/login_logo@2x.png'

const useStyles = makeStyles((theme) => {
    return {
        container: {
            backgroundColor: theme.palette.primary.bg,
            display: 'flex',
            alignItems: 'center',
            flex: 1,
        },
        bannerBox: {
            width: '50vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            '& div': {
                width: '40vw',
                height: '70vh',
                backgroundImage: `url(${banner})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                marginLeft: '10vw'
            }
        },
        formBox: {
            flex: 1,
            '& .formContainer': {
                margin: '-10vh 13vw 0',
            }
        },
        logoContainer: {
            textAlign: 'center',
            '& img': {
                height: '7.7vh'
            }
        },
        registerText: {
            textAlign: 'center',
            width: '100%',
            color: '#8494A2',
            marginTop: theme.spacing(7),
            '& a': {
                fontSize: '16px'
            }
        },
        password: {
            width: '100%'
        },
        submit: {
            margin: theme.spacing(8, 0, 2),
        },
        input: {
            color: "rgba(135, 152, 164, 1)"
        }
    }
});

export default useStyles

