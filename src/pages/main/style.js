import { makeStyles } from '@material-ui/core/styles';
const drawerWidth = 348;
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '& main': {
            display: 'flex',
            flex: 1
        }
    },
    content: {
        flex: 1,
        display: 'flex',
        position: 'relative',
        height: 'calc(100% - 6.67vh)'
    },
    aside: {
        width: '30vw',
    },
    article: {
        flex: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    }
}));

export default useStyles