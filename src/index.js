import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from '../src/components/AuthContext';
import ReactDOM from 'react-dom';
import Login from '../src/components/login';
import Register from '../src/components/registration';
import DashBoard from './components/dash_board';


ReactDOM.render(
  <AuthProvider>
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register></Register>} />
      <Route path="/dashboard" element={<DashBoard></DashBoard>} />
      {/* <Route path="/dashboard" element={<PrivateRoute element={DashBoard} />} /> */}
    </Routes>
  </Router>
  </AuthProvider>,
  document.getElementById('root')
);





// export default index;
