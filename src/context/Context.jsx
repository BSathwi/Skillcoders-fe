import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import Cookies from "js-cookie";

const CartCountContext = createContext();

export const CartCountProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const hasFetched = useRef(false); 

  const fetchCartCount = async () => {
    try {
      const token = Cookies.get("access_token");
      const response = await fetch("http://localhost:5000/auth/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartCount(data.total_cart_count); 
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount); 
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchCartCount();
      hasFetched.current = true; 
    }
  }, []);

  const value = {
    cartCount,
    fetchCartCount,
    updateCartCount, 
  };

  return (
    <CartCountContext.Provider value={value}>
      {children}
    </CartCountContext.Provider>
  );
};


export const useCartCount = () => {
  return useContext(CartCountContext);
};