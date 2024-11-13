import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import AdminMenu from '../layout/AdminMenu';

function CreateProduct() {


  const navigate = useNavigate();

  const [name, setName]  = useState("")
  const [categories, setCategories] = useState([]);
  const [products, setProdcuts] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");


  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/v1/category/getAll-category`);
      if (data) {
        setCategories(data.category)
        console.log("Categories:", data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("shipping", shipping);
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("photo", photo);
      const { data } = await axios.post(`http://localhost:8000/api/v1/product/create-product`,formData);
      if (data?.success) {
        toast.success("Product Created Successfully Today");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error creating product:", error); // Log detailed error
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);


  return (
    <Layout>
 <div className="container-fluid mt-5 pt-4">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Product</h1>

            <Select
              variant="outlined" // Use variant instead of bordered
              placeholder="Select a Category"
              size="large"
              showSearch
              className="form-select mb-3"
              onChange={(value) => setCategory(value)}
              value={category}
            >
              {categories.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>

            <div className="mb-3">
              <label
                htmlFor="uploadImages"
                className="btn btn-outline-secondary col-md-12"
              >
                {photo ? photo.name : "Upload photo"}

                <input
                  type="file"
                  id="uploadImages"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>

            <div className="mb-3">
              {photo && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="photo"
                    height={"300px"}
                    className="img img-responsive"
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <input
                type="text"
                placeholder="write a Name"
                value={name}
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                name=""
                id=""
              />
            </div>

            <div className="mb-3">
              <textarea
                type="text"
                value={description}
                placeholder="write a description"
                className="form-control"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                value={price}
                placeholder="write a Price"
                className="form-control"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                value={quantity}
                placeholder="write a quantity"
                className="form-control"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

             <div className="mb-3"> 
           <Select
                bordered={false}
                placeholder="Select Shipping "
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setShipping(value);
                }}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select> 
           </div> 

            <div className="mb-3">
              <button className="btn btn-primary" onClick={createProduct}>
                CREATE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </Layout>
  )
}

export default CreateProduct
