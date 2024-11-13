import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import axios from 'axios';
import AdminMenu from '../layout/AdminMenu';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Select } from "antd";

function UpdateProduct() {
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const params = useParams();
  const navigate = useNavigate();




  const [id, setId] = useState("");

  const getSingleProduct =async()=>{


    try {
      const { data } = await axios.get(`https://e-commerce-website-mern-new.vercel.app/api/v1/product/getsingle-product/${params.slug}`);
      setName(data.product.name)
      setId(data.product._id)
      setDescription(data.product.description)
      setShipping(data.product.shipping)
      setQuantity(data.product.quantity)
      setPrice(data.product.price)
      setCategory(data.product.category?._id)


    } catch (error) {
      console.log(error)
      
    }
  }
  useEffect(() => {
    getSingleProduct();
  }, []);


  const handleUpdate = async(e)=>{
    e.preventDefault();
    try {
      
      const productData = new FormData()
      productData.append("name",name)
      productData.append("price",price)
      productData.append("shipping",shipping)
      productData.append("description",description)
      productData.append("quantity", quantity);
      productData.append("photo",photo)
      productData.append("category",category)
      const { data } = await axios.put(`https://e-commerce-website-mern-new.vercel.app/api/v1/product/update-product/${id}`,productData);
      
      
      console.log(data);

      if(data){

        navigate("/dashboard/admin/products");
      }else {
        console.log("Error")
      }

    } catch (error) {
      console.log(error)
      
    }


  }

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`https://e-commerce-website-mern-new.vercel.app/api/v1/category/getAll-category`);
      if (data) {
        setCategories(data.category);
        console.log("Categories:", data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);


  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `https://e-commerce-website-mern-new.vercel.app/api/v1/product/delete-product/${id}`
      );
      toast.success("Product Deleted  Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };


  return (
<Layout title={"DashBoard Create Products "}>
      <div className="container-fluid mt-5 pt-4 ">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <h1>Update Products</h1>
            <div className="m-1 w-75">
              <Select
                placeholder="Select a Categroy"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setCategory(value)}
                value={category}
              >
                  {categories?.map((c)=>{
                    return (
                      <Select.Option key={c._id} >

                    
                          {c?.name}
          
                      </Select.Option>
                    )
                  })}

                {/* we are  recieving value prop from ant design remember that  */}
              </Select>

              <div className="mb-3">
                <label
                  htmlFor="uploadImages"
                  className="btn btn-outline-secondary col-md-12"
                >
                  {photo ? photo.name : "Upload Photo"}

                  {/* when we upload a photo it is stored in the url and showing name "about.png" so we cant access directly by photo so we use URL.
                  
                  createObjectURL(photo) (below)   */}

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

              {/* createObjectURL(photo) (below)   */}
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="photo"
                      height={"300px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`https://e-commerce-website-mern-new.vercel.app/api/v1/product/product-photo/${id}`}
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
                  value={shipping ? "yes" : "No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>

              <div className="mb-3">
                <button className="btn btn-primary" 
                
                onClick={handleUpdate}


                
                >
                  UPDATE PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button
                  type="submit"
                  onClick={() => setVisible(true)}
                  className="btn btn-primary"
                >
                  Delete Product
                </button>
                <Modal
                  onCancel={() => setVisible(false)}
                  footer={null}
                  open={visible}
                  bordered={false}
                  variant="outlined"
                >
                  <div className="mb-3 ">
                    <p>Are You sure you want to delete this Product</p>
                    <button className="btn btn-danger" onClick={handleDelete}>
                      DELETE PRODUCT
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UpdateProduct