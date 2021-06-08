import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { green, orange } from '@material-ui/core/colors';

import { deepSea } from './deepSea'

export default function Theme(props) {
    return (
        <ThemeProvider theme={deepSea}>
            {props.children}
        </ThemeProvider>
    );
}

