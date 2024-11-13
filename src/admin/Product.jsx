import React, { useEffect, useState } from 'react'
import AdminMenu from '../layout/AdminMenu';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Product() {

  const  [ products, setProducts] = useState([])
const navigate = useNavigate()
  
  const getAllProduct = async (e) => {
    try {
     
      const { data } = await axios.get(`https://e-commerce-website-mern-new.vercel.app/api/v1/product/getAll-products`);
      if (data?.success) {
        console.log(data.products)
        setProducts(data.products)
        toast.success("Product Getting  Successfully Today");
      } else {
        toast.error(data?.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error creating product:", error); // Log detailed error
      toast.error("Something went wrong");
    }
  };

  useEffect(()=>{
    getAllProduct()
  },[])
  return (
    <div className="row">
    <div className="col-md-3">
      <AdminMenu />
    </div>
    <div className="col-md-9 ">
      <h1 className="text-center">Products</h1>
      <div className="d-flex flex-wrap">
        {products?.map((p) => {
          return (
            //  here we create a name in createProduct.js we also get it slug we have given in backend
            <Link
              key={p?._id}
              to={`/dashboard/admin/product/${p?.slug}`}
              className="product-link"
            >
              <div className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`https://e-commerce-website-mern-new.vercel.app/api/v1/product/product-photo/${p?._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description}</p>
                  <p className="card-text">{p.slug}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
  )
}

export default Product
