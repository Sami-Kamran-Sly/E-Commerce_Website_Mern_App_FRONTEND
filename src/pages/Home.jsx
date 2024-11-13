import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { Checkbox, Radio } from "antd";
import axios from 'axios'
import toast from 'react-hot-toast';
import { Prices } from '../Prices';
import { useCartContext } from '../context/CartContext';

function Home() {
  const {cart,setCart}= useCartContext()

  const [products, setProducts] = useState([]);
  const  [ categories ,setCategory] = useState([])
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);






  const navigate = useNavigate();


  useEffect(() => {
    if(page ===1 ) return
    loadMore()
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };



  const getAllProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/v1/product/product-list/${page}`);

      if (data?.success) {
        setProducts(data.products);
        toast.success('Products fetched successfully');
      } else {
        toast.error(data?.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Something went wrong');
    }
  };


  
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/v1/category/getAll-category`);
      if (data) {
        setCategory(data.category);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/v1/product/product-count`);
      setTotal(data.total); // Correct line to set total
      console.log(data.total, `Total is ${data.total}`); 
    } catch (error) {
      console.error('Error fetching total count:', error); 
      toast.error('Something went wrong while fetching the total count');
    }
  };
  
  
  const filterProducts = async () => {

    console.log("Checked categories:", checked); // Debugging
    console.log("Price range:", radio); // Debugging
    try {
      const { data } = await axios.post(`http://localhost:8000/api/v1/product/product-filter`, {
        checked,
        radio,

      });
  
      if (data?.success) {
        setProducts(data.products || []);

       
        setTotalPages(data.totalPages);
        setPageNumbers(data.pageNumbers);

      } else {
        toast.error("No products found for the selected filters");
      }
    } catch (error) {
      console.error('Error filtering products:', error);
      toast.error('Something went wrong while filtering');
    }
  };
  

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProducts();
    }
  }, [checked, radio]);


  const handleFilter = (value, id) => {
    let all = [...checked];

    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }

    setChecked(all);
    setRadio([]);
  };


//   1. Array Structure:
// all.filter((c) => c !== id) works when the elements in the all array are primitive values (e.g., numbers or strings).
// For example, if all = [1, 2, 3], each element (c) is a number, not an object. So you compare c directly to id.


// 2. When to Use c.id:
// You would use c.id !== id if each element in the array is an object that has a property id. In this case, c would be an object, and you need to access the id property of that object.



  useEffect(() => {
    getAllCategory();
    getTotal()
  }, []);

  useEffect(() => {
    getAllProduct();
  }, []);


  const addToCart = (p) => {
    // Find the index of the product in the cart
    const existingProductIndex = cart.findIndex((item) => item._id === p._id);
  
    let updatedCart; // Initialize the variable to store the updated cart
  
    if (existingProductIndex !== -1) {
      // Product already exists in the cart, update the quantity
      updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      // Product doesn't exist in the cart, add a new entry with quantity 1
      updatedCart = [...cart, { ...p, quantity: 1 }];
    }
  
    // Update the state with the new cart
    setCart(updatedCart);
    
    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    toast.success("Item Added to cart");
  };
  
  return (
    <Layout title={"Home Page E-commerce  "}>

      <div className="container mt-5 pt-5 ">
        <div className="row">
          <div className="col-3 mt-5 pt-5">
          <div className="d-flex flex-column">
              {categories?.map((c) => {
                return (
                  <div key={c._id} >
                    
                  <Checkbox
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                    
                    >
                    {c.name}
                  </Checkbox>
                    </div>
                );
              })}
            </div>

            <div className="d-flex flex-column">
              <Radio.Group
                onChange={(e) => {
                  setRadio(e.target.value);
                }}
              >
                   {/* Price Filter  */}
            <h6 className="text-center mt-4">Filter By Price </h6>
                {Prices?.map((p) => {
                  return (
                    <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>
                    </div>
                  );
                })}
              </Radio.Group>
            </div>

            <button
                className="btn btn-danger"
                onClick={() => {
                  setChecked([]); // Reset checked filters
                  setRadio([]); // Reset radio filters
                  setPage(1);; // Reset currentPage to 1
                  getAllProduct(); // Fetch initial products
                  window.location.reload();
                }}
              >
                RESET FILTERS
              </button>
          </div>
          <div className="col-9">
          <div className="d-flex flex-wrap mt-5">
        {products?.map((p) => {
          return (
            //  here we create a name in createProduct.js we also get it slug we have given in backend

              <div className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`http://localhost:8000/api/v1/product/product-photo/${p?._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description}</p>
                  <p className="card-text">{p.slug}</p>
                </div>
          

<button
className="btn btn-primary ms-1 mb-2"
onClick={() => navigate(`/product/${p.slug}`)}
>
More Details
</button>
<button
className="btn btn-dark ms-1"
onClick={() => {
  addToCart(p);

  


  // setCart([...cart, p]);

  // localStorage.setItem(
  //   "cart",
  //   JSON.stringify([...cart, p])
  // );
  // toast.success("Item Added to cart");
}}
>
ADD TO CART
</button>
</div>

          );
        })}
      </div>

   
    
          <div className="m-2 p-3">
              {products && products.length < total && (
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                    console.log(products.length);
                    console.log(total);
                  }}
                >
                  {/* firstly the count total function is showing how many 
                  products we have in our db  in this case 8 */}

                  {/* and here we are saying we want to load more product. 
                  we have given page dynamic so here we are writng "page +1" initial value is 1. 
                  so it goes like this 
               
              //  we have all ready three product by default ok! it goes like this when we click 
              on load more btn 3,8 and  another time 6,8  now the product.length become 
              bigger then products so it wont show the load more button    */}

                  {loading ? "Loading ..." : "Load More"}
                </button>
              )}
            </div>
            </div>
        </div>
      </div>

      
    
    </Layout>
      
  )
}

export default Home
