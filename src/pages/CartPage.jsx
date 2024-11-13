import React, { useEffect, useState } from 'react'
import { useCartContext } from '../context/CartContext'
import Layout from '../components/Layout'
import { useAuthContext } from '../context/AuthContextInfo'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DropIn from "braintree-web-drop-in-react";
function CartPage() {

  const {cart, setCart} = useCartContext()
  const {auth, setAuth} = useAuthContext()
  const [clientToken, setClientToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [instance, setInstance] = useState("");
  const navigate = useNavigate();
  
const totalPrice = ()=>{

  try {
    

    let total = 0;
    cart?.map((item)=>{
       total = total +item.price * item.quantity 

    })


    return total.toLocaleString("en-US" ,{
      style:"currency",
      currency:"USD",

    })
  } catch (error) {
    console.log(error)
  }
}
    const removeItem = (id) => {
        // Use filter to create a new array excluding the item with the given id
        const updatedCart = cart.filter((item) => item._id !== id);
      
        // Update the cart state with the new array
        setCart(updatedCart);
      
        // Optionally, update local storage to keep it in sync
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      };
      

      const handleQuantityChange =(productId,newQuantity)=>{


        const updateCart = cart.map((item)=>{
            return item._id === productId ? {...item,quantity:newQuantity} :item
        })

        setCart(updateCart)

        localStorage.setItem("cart" ,JSON.stringify(updateCart))
      }

      
// router.get("/braintree/token", braintreeTokenController);

// router.post("/braintree/payment", requireSignIn, braintreePaymentController);

      const getToken = async () => {
        try {
          const { data } = await axios.get(`https://e-commerce-website-mern-new.vercel.app/api/v1/product/braintree/token`);
          console.log(data?.clientToken);

          console.log(data);
    
          setClientToken(data?.clientToken);
        } catch (error) {
          console.log(error);
        }
      };
      useEffect(() => {
        getToken();
      }, [auth?.token]);
    
      const handlePayment = async () => {
        try {
          setLoading(true);
          const { nonce } = await instance.requestPaymentMethod();
          const { data } = await axios.post(`https://e-commerce-website-mern-new.vercel.app/api/v1/product/braintree/payment`, {
            nonce,
            cart,
          });
    
          console.log(nonce, cart);
          console.log(data);
    
          setLoading(false);
          localStorage.removeItem("cart");
          setCart([]);
          navigate("/dashboard/user/orders");
          toast.success("Payment Completed Successfully ");
        } catch (error) {
          console.log(error);
        }
      };
    

  return (
    <Layout>
<div className="container mt-5 pt-5">
<div className="row mt-5">

          <div className="col-md-12">
          <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}

                
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
       
          <div className="col-md-6">
            {cart?.map((p, index) => {
              return (
                <div className="row m-2 card flex-row " key={index}>
                  <div className="col-md-6">
                    <img
                      src={`https://e-commerce-website-mern-new.vercel.app/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width={"200px"}
                      height={"200px"}
                    />
                  </div>
                  <div className="col-md-4 m-2">
                    <h4> Name: {p.name}</h4>
                    <p>{p.description.substring(0, 30)}</p>

                    <button
                      className="btn btn-success"
                      onClick={() =>
                        handleQuantityChange(p._id, p.quantity+1)
                      }
                    >
                      +
                    </button>
                    <span className="mx-2">{p.quantity}</span>
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        handleQuantityChange(p._id, p.quantity - 1);

                        if (p.quantity <= 1) {
                          removeItem(p._id);
                        }
                      }}
                      disabled={p.quantity === 1}
                    >
                      -
                    </button>
                    <button
                      className="btn btn-danger pl-5 m-2"
                      onClick={() => {
                        removeItem(p._id);
                      }}
                    >
                      Remove
                    </button> 
                    <h4>Price {p.price}</h4>
                    <h6>Quantity {p.quantity}</h6>
                  </div>





    
                  </div>
                
              );
            })}
          </div>


          <div className="col-md-4">
          <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()} </h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                    // if we dont write state:"cart " when we login
                    //  it will show home page by default but if we write it
                    //  will navigate us to cart page directly after login
                  >
                    Plase Login to checkout
                  </button>
                )}
              </div>
            )}

            <div className="mt-2">
              {!clientToken || !auth?.token || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
                  </button>
                </>
              )}
          </div>
          
</div>
</div>
</div>


      
    </Layout>
  )
}

export default CartPage
