import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import CreatePoint from './pages/CreatePoint';
import Home from './pages/Home';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route exact component={Home} path="/"/>
            <Route component={CreatePoint} path="/create-point"/>
        </BrowserRouter>
    )
}

export default Routes;