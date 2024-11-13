import React from 'react'
import Layout from '../components/Layout'
import { useSearchContext } from '../context/SearchContext'
import { useNavigate } from 'react-router-dom'

function Search() {
    const {auth,setAuth} = useSearchContext()
    const navigate = useNavigate()
  return (
    <Layout>





        <div className="container mt-5">


<div className="text-center mt-5 pt-5 ">
    {auth.results.length <1 ? "No Product Found " : `Found  ${auth.results.length}`}
</div>

        <div className="d-flex  flex-wrap mt-4">
            {auth?.results?.map((p)=>{

return (

    <div
    className="card m-2"
    key={p._id}
    style={{ width: "18rem" }}
  >
    <img
      src={`http://localhost:8000/api/v1/product/product-photo/${p._id}`}
      className="card-img-top"
      alt={p.name}
    />
    <div className="card-body">
      <h5 className="card-title">{p.name}</h5>
      <p className="card-text">{p.description}</p>
      <p className="card-text">${p.price}</p>
      <p className="card-text">{p.slug}</p>
      <button class="btn btn-primary ms-1" 
      

      onClick={()=>navigate(`/product/${p.slug}`)}
      >More Details</button>
      <button class="btn btn-secondary ms-1">Add to Cart</button>
    </div>
  </div>



)

            })}



            </div>
        </div>
      
    </Layout>
  )
}

export default Search
