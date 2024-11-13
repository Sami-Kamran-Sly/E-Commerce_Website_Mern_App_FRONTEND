import React, { useEffect, useState } from 'react'
import axios from "axios";
import AdminMenu from '../layout/AdminMenu';
import CategoryForm from '../components/CategoryForm';
import Layout from "../components/Layout";
import toast from 'react-hot-toast';
import { Button, Modal } from 'antd';
function CreateCategory() {


  const  [ categories ,setCategory] = useState([])
  const [name,setName] = useState()
  const [visible, setVisible] = useState(false);
  const [updatedName ,setUpdatedName] = useState("")
  const [selected, setSelected] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`https://e-commerce-website-mern-new.vercel.app/api/v1/category/create-category`, {
        name,
      });

      console.log(data);
      if (data?.success) {
        toast.success(`${data.category.name} is created`);
        setName("");
        getAllCategory();
      } else {
        toast.error("went wrong ");
      }
    } catch (error) {
      toast.error("Something went wrong in input Form ");
    }
  };


  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`https://e-commerce-website-mern-new.vercel.app/api/v1/category/getAll-category`);
      if (data) {
        setCategory(data.category);
        console.log("Categories:", data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);


  const UpdateCategory = async()=>{

    try {
      
      const {data} =  await axios.put(`https://e-commerce-website-mern-new.vercel.app/api/v1/category/update-category/${selected._id}`, {
        name: updatedName
      })

      setSelected(null);
      setUpdatedName("");
      setVisible(false);
      getAllCategory();
      toast.success(`${updatedName} is updated`);
    } catch (error) {
      
    }

  }

  const deleteAllCategory = async (id) => {
    try {
      const { data } = await axios.delete(`https://e-commerce-website-mern-new.vercel.app/api/v1/category/delete-category/${id}`);
      if (data) {
        getAllCategory()
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  return (
    <Layout title={"Dashboard Create Category"}>
    <div className="container-fluid mt-5 pt-4">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>Manage Category</h1>
          <div className="p-3 w-50">
            <CategoryForm
              handleSubmit={handleSubmit}
              value={name}
              setValue={setName}
            />
          </div>

          <div className="w-75">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>
                      <button
                        className="btn btn-primary ms-2"
                        onClick={() => {
                          setVisible(true);
                          setUpdatedName(c.name);
                          setSelected(c);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ms-2"
                        onClick={()=>deleteAllCategory(c._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           <Modal


title="Updated"
centered
open={visible}
onCancel={() => setVisible(false)}
onOk={ UpdateCategory}


          > 
          
            <CategoryForm
              value={updatedName}
              setValue={setUpdatedName}
              handleSubmit={UpdateCategory}
            /> 
          </Modal> 
        </div>
      </div>
    </div>
  </Layout>
  )
}

export default CreateCategory
