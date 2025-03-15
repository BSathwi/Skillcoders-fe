import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { Loader, ShoppingCart, CreditCard, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCartCount } from "../context/Context";

const emptyCartImage = "https://img.freepik.com/free-vector/shopping-cart-realistic_1284-6011.jpg?t=st=1741755855~exp=1741759455~hmac=782fa5f7a94ada1cf8eacfc23d9ca2bbadc6f335027ac436027d66828e631c75&w=900";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const { cartCount, updateCartCount } = useCartCount();
  const fetchCalled = useRef(false);

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchCartItems();
    }
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    const token = Cookies.get("access_token");

    if (!token) {
      toast.error("Authentication required! Please login.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/carting/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (Array.isArray(data.cart_items)) {
        setCartItems(data.cart_items);
      } else {
        console.error("Expected an array but got:", data);
        setCartItems([]);
      }
    } catch (error) {
      toast.error("Error fetching cart items.");
      console.error("Fetch Error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (courseId) => {
    const token = Cookies.get("access_token");

    try {
      const res = await fetch("http://localhost:5000/carting/cart/remove", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      if (res.ok) {
        const newCount = cartCount - 1;
        updateCartCount(newCount);
        toast.success("Course removed from cart.");
        setCartItems(cartItems.filter((course) => course.course_id !== courseId));
      } else {
        toast.error("Failed to remove course.");
      }
    } catch (error) {
      toast.error("Error removing from cart.");
      console.error("Remove Cart Error:", error);
    }
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...");
  };

  const totalPrice = cartItems.reduce((acc, course) => acc + (course.price || 0), 0);

  const handleRegister = (courseId) => {
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <div className="min-h-screen mt-16">
        <div className="max-w mx-auto">
          <div className="bg-white p-8">
            <div className="flex items-center gap-3 mb-8">
              <ShoppingCart className="w-8 h-8 text-violet-600" />
              <h2 className="text-3xl font-bold text-violet-900">My Cart</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader className="h-8 w-8 animate-spin text-violet-600" />
              </div>
            ) : cartItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mt-10"
              >
                <img src={emptyCartImage} alt="Empty Cart" className="w-64 h-64 object-contain opacity-75" />
                <p className="text-violet-600 text-xl mt-6 font-medium">Your cart is empty!</p>
                <p className="text-violet-400 mt-2">Add some courses to get started</p>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {cartItems.map((course) => (
                    <motion.div
                      key={course.course_id}
                      variants={item}
                      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-violet-100 hover:border-violet-300"
                    >
                      <div className="relative">
                        <img 
                          src={course.course_image} 
                          alt={course.course_name} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-violet-900 mb-2 line-clamp-2">
                          {course.course_name}
                        </h3>
                        <p className="text-2xl font-bold text-violet-600 mb-4">
                          ₹{course.price}
                        </p>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleRegister(course.course_id)}
                            className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-300 flex items-center justify-center gap-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            Register
                          </button>
                          <button
                            onClick={() => handleRemoveFromCart(course.course_id)}
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-12 border-t border-violet-100 pt-8"
                >
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                      <p className="text-violet-600 text-lg">Total Amount</p>
                      <p className="text-3xl font-bold text-violet-900">₹{totalPrice}</p>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="px-8 py-4 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors duration-300 flex items-center gap-3 text-lg font-medium shadow-lg hover:shadow-violet-200"
                    >
                      <CreditCard className="w-5 h-5" />
                      Proceed to Checkout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;