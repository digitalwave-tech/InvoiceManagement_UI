import React, { useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/registration.css';
import loginImg from "../components/login.svg";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardImg
} from "reactstrap";
//import { GoogleLoginButton } from "react-social-login-buttons";

function Register() {

  const [companyname, setcompanyname] = useState('');
  const [addressline, setaddress] = useState('');
  const [city, setcity] = useState('');
  const [states, setstate] = useState('');
  const [phone, setphoneno] = useState('');
  const [pincode, setpincode] = useState('');
  const [emailid, setemail] = useState('');
  const [gstno, setgstnno] = useState('');

  const navigate = useNavigate();
  //const [customerData] = useState("");
  const handleSubmit = async (event) => {

    event.preventDefault();
    const customerData = {
      companyname,
      addressline,
      city,
      states,
      phone,
      pincode,
      emailid,
      gstno
    };
    console.log("Sending data:", customerData);
    try {
      //https://localhost:7116/api/controller/login?gstNo=GST_12345
      const response = await axios.post('http://localhost:7116/api/controller/CreateUserAccount',customerData,{
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        //const { token } = response.data;
        //localStorage.setItem('token', token); // Store the token in localStorage
        navigate('/');
        console.log('customer registered successfully');
      } else {
        // Handle login failure
        console.log('Registeration failed');
        //setShowAlert(true);
      }
    } catch (error) {
      console.error('Error:', error);
      //setShowAlert(true);
    } 
  };

  return (
    <div className="background">
      <div className="login-box">
        <div className="container">
          <div class="row app-des">
            <div class="col left-background ">
              <h1 style={{ marginTop: -10,color:"white" }}>Invoice</h1>
              <h4 style={{color:"white", marginBottom:"50px"}}>Management</h4>
              <CardImg
                className="mobile-img"
                src={loginImg}
                alt="mobile-App"
              />
            </div>
            <div class="col login-form">
              <form onSubmit={handleSubmit}>
                <h2 className="font-weight-bold mb-3" style={{ marginTop: -20 }}>Registration</h2>
                <FormGroup>
                  <Input
                    className="mb-3"
                    type="text"
                    placeholder="Company Name"
                    value={companyname}
                    onChange={(e) => setcompanyname(e.target.value)}
                    required
                  />
                  <Input
                    className="mb-3"
                    type="text"
                    placeholder="Address Line"
                    value={addressline}
                    onChange={(e) => setaddress(e.target.value)}
                    required
                  />
                  <Input
                    className="mb-3"
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setcity(e.target.value)}
                    required
                  />
                  <Input
                    className="mb-3"
                    type="text"
                    placeholder="State"
                    value={states}
                    onChange={(e) => setstate(e.target.value)}
                    required
                  />
                  <Input
                    className="mb-3"
                    type="text"
                    value={pincode}
                    placeholder="Pincode"
                    onChange={(e) => setpincode(e.target.value)}
                    required
                  />
                  <Input
                    className="mb-3"
                    type="text"
                    value={phone}
                    placeholder="Phone No"
                    onChange={(e) => setphoneno(e.target.value)}
                    required
                    pattern='[1-9]{1}[0-9]{9}' title='Phone no should ne numeric' maxLength={10}
                  />
                  <Input
                    className="mb-3"
                    type="email"
                    placeholder="Email"
                    value={emailid}
                    onChange={(e) => setemail(e.target.value)}
                  />
                  <Input
                    className="mb-3"
                    type="text"
                    value={gstno}
                    placeholder="Gst No"
                    onChange={(e) => setgstnno(e.target.value)}
                    required
                  />
                </FormGroup>
                <Button className="mt-3  btnall" >Create</Button>
                <div className="text-center m-4">Already have an account? <a href="/">SingIn</a></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register