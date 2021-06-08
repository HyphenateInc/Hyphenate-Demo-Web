import { createMuiTheme } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
export const deepSea = createMuiTheme({
    palette: {
        primary: {
            main: '#00BA6E',
            bg: '#243E55',
            bt: '#00BA6E'
        },
        secondary: {
            main: orange[500],
        },
    },
    status: {
        danger: '#e53e3e',
    },
    typography: {
        fontSize: 12,
    },
    spacing: factor => `${0.25 * factor}rem`, // = 0.25 * 2rem = 0.5rem = 8px
    MuiButton: '123'
});