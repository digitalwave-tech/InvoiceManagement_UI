import React, { useState,useContext  } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../components/login.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import loginImg from "../components/login.svg";
import { AuthContext } from '../components/AuthContext';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardImg,
  Alert
} from "reactstrap";

function Login() {



  const [credentials, setCredentials] = useState("");
  const { login } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials(e.target.value);
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    setLoading(true);

    try {

      //https://localhost:7116/api/controller/login?gstNo=GST_12345
      const response = await axios.post('http://localhost:7116/api/controller/login?gstNo='+credentials, {
        //username: inputUsername,
        // password: inputPassword
      
      });

    if (response.status === 200) {
      login(response.data.token);
       // Set token in Authorization header for all subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

     navigate('/dashboard');
      console.log('User logged in successfully');
    } else {
      // Handle login failure
      alert('GST number is Invalid');
      console.log('Login failed');
      //setShowAlert(true);
    }
    } catch (error) {
      //alert('GST no invalid!!');
      console.error('Error:', error);
      //setShowAlert(true);
    } finally {
      setLoading(false);
    }

    
  };

  return (
    <div className="background">
      <div className="login-box">
        <div className="container">
          <div class="row app-des">
            <div class="col left-background ">
              <h1 style={{color:"white"}}>Invoice</h1>
              <h4  style={{color:"white"}}>Management</h4>
              <CardImg
                className="mobile-img"
                src={loginImg}
                alt="mobile-App"
              />
            </div>
            <div class="col login-form">
              <Form onSubmit={handleSubmit}>
                <h2 className="font-weight-bold mb-4">Login</h2>
                <FormGroup>
                  <Label className="font-weight-bold mb-2">Enter GST Number</Label>
                  <Input
                    className="mb-3"
                    type="text"
                    // placeholder="GST No" onChange={(e) => setInputUsername(e.target.value)} required
                    placeholder="GST No" onChange={handleChange} required

                    
                  />
                </FormGroup>
                <Button type="submit" className="mt-3  btn_all" >
                  {loading ? 'Logging In...' : 'Log In'}
                </Button>
                <div className="text-center m-4">Do not have an account? <a href="/register">SignUp</a></div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;