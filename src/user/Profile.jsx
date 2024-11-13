



import React, { useEffect, useState } from 'react'


import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from '../components/Layout';
import "../../src/styles/AuthStyles.css";
import { useAuthContext } from '../context/AuthContextInfo';

function Profile() {
  const {auth, setAuth}  = useAuthContext()



    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();


    useEffect(()=>{

      const {name, email, address}  = auth?.user
  
      setName(name)
      setEmail(email)
      setAddress(address)
  
    },[auth?.user])
  const handleSubmit = async(e)=>{
    e.preventDefault()

    try {
  
      const { data } = await axios.put(`https://e-commerce-website-mern-new.vercel.app/api/v1/auth/profile`, {
        name,
        email,
        password,
        phone,
        address,
      });
      
      setAuth({...auth , user:data?.updatedUser})



let ls =localStorage.getItem("auth")
ls =JSON.parse(ls)

ls.user= data?.updatedUser


localStorage.setItem("auth" , JSON.stringify(ls))

navigate(`/dashboard/user`)
    
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong");
    }
  }
  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Name"
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Phone"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Address"
              required
            />
          </div>
 
          <button type="submit" className="btn btn-primary">
            Updated
          </button>
        </form>
      </div>
    </Layout>
  )
}






export default Profile
