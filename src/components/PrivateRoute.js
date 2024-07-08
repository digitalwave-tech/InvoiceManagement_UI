// PrivateRoute.js
import React from 'react';
import { Route,Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import DashBoard from './dash_board';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
    //const { isAuthenticated } = useAuth();

    // return (
        
    //     isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />
    // );
//     <Route
//     {...props}
//     element={isAuthenticated ? <DashBoard {...props} /> : <Navigate to="/" replace />}
//   />
<Route
        {...rest}
        render={props =>
            isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Navigate to={{ pathname: '/', state: { from: props.location } }} />
            )
        }
    />
};

export default PrivateRoute;
