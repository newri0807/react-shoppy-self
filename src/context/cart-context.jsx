import { createContext, useEffect, useState } from "react";
import { getCart, onAuthStateChanged } from "../api/firebase";

export const cartContext = createContext();

export function CartProvider({ children }) {
  const [totalCartAmount, setTotalCartAmount] = useState(0);
  const addTototalCartAmount = (item) => setTotalCartAmount(item);
  //로그인 작성법 1. localStorage에 저장
  //const loginUserId = JSON.parse(localStorage.getItem("userInfo"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (user === null || user === undefined) {
      setTotalCartAmount(0);
    } else {
      getCart(user.uid).then((res) => {
        //console.log(res.length);
        setTotalCartAmount(res.length);
      });
    }
  }, [user, totalCartAmount]);

  return (
    <cartContext.Provider
      value={{ totalCartAmount, addTototalCartAmount, user }}
    >
      {children}
    </cartContext.Provider>
  );
}
