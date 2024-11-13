import React, { memo } from 'react'


import { Link } from "react-router-dom";
const Footer = memo(() => {
  return (
    <div className="footer " style={{background:"black",height:"200px" ,padding:"30px 0px"}}>
      <h1 className="text-center">All Right Reserved &copy; Techinfoyt</h1>
      <p className="text-center mt-3">
        <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
        <Link to="/policy">Privacy Policy</Link>
      </p>
    </div>
  )
})

export default Footer
