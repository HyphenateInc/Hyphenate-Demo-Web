import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from "react"

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default function Loading({ show }) {
    console.log('-----', show)
    const classes = useStyles();
    const handleClose = () => {
        // setOpen(false);
    };

    useEffect(() => {
    }, [show])

    return (
        <div>
            <Backdrop className={classes.backdrop} open={show} onClick={handleClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

