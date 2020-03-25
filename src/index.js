import React from 'react';
import {Grommet} from 'grommet';
import {dark} from 'grommet/themes';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


ReactDOM.render(
    <Grommet theme={dark}>
        <App/>
    </Grommet>,
    document.getElementById('root')
);
