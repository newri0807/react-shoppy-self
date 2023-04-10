import { createContext, useEffect, useState } from "react";
import { getCart } from "../api/firebase";

export const cartContext = createContext();

export function CartProvider({ children }) {
  const [totalCartAmount, setTotalCartAmount] = useState(0);
  const addTototalCartAmount = (item) => setTotalCartAmount(item);
  const loginUserId = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    if (loginUserId === null || loginUserId === undefined) {
      setTotalCartAmount(0);
    } else {
      getCart(loginUserId.uid).then((res) => {
        //console.log(res.length);
        setTotalCartAmount(res.length);
      });
    }
  }, [loginUserId, totalCartAmount]);
  return (
    <cartContext.Provider value={{ totalCartAmount, addTototalCartAmount }}>
      {children}
    </cartContext.Provider>
  );
}
