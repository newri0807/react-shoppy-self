import { signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartContext } from "../context/cart-context";
import { auth, getCart, handleGoogleLogin } from "../api/firebase";
import { BsCart } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";

export default function Nav() {
  const { totalCartAmount, addTototalCartAmount, user } =
    useContext(cartContext);
  const [userData, setUserData] = useState(user);
  const adminUid = process.env.REACT_APP_ADMIN_UID;
  const Navigate = useNavigate();

  const handleLogin = () => {
    handleGoogleLogin().then((res) => {
      //로그인 작성법 1. localStorage에 저장
      //localStorage.setItem("userInfo", JSON.stringify(res));
      setUserData(res);
    });
  };

  useEffect(() => {
    if (userData !== null) {
      getCart(userData.uid).then((res) => {
        addTototalCartAmount(res.length);
      });
    }
  }, [addTototalCartAmount, userData]);

  //로그인 테스팅
  useEffect(() => {
    setUserData(user);
    console.log("로그인확인중", userData);
  }, [user, userData]);

  //로그인 작성법 1. localStorage에 저장
  // useEffect(() => {
  //   const localStorageYn = JSON.parse(localStorage.getItem("userInfo"));
  //   if (localStorageYn) {
  //     setUserData(localStorageYn);
  //   }
  // }, []);

  //로그인 작성법 2. onAuthStateChanged() 메소드 이용
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged((user) => {
  //     setUserData(user);
  //   });

  //   console.log("onAuthStateChanged", userData);
  //   return () => unsubscribe();
  // }, [userData]);

  const onLogOutClick = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.

        //로그인 작성법 1. localStorage에 저장
        //localStorage.removeItem("userInfo");

        setUserData(null);
        addTototalCartAmount(0);
        alert("로그아웃 되었습니다");
        Navigate("/");
      })
      .catch((err) => {
        // An error happened.
        console.log(err);
      });
  };

  const gotoPage = () => {
    Navigate(`/addProduct`);
  };

  return (
    <div className="flex items-center justify-between py-5 border-b-2 border-rose-300">
      <h1>
        <Link to="/" className="text-4xl font-extrabold text-[#e2559c] ">
          SHOPPY
        </Link>
      </h1>
      <ul className="flex justify-between gap-3 items-center">
        <li>
          <Link to="/product">Product </Link>
        </li>
        {userData ? (
          <li>
            <ul className="flex justify-between items-center gap-3">
              <span onClick={onLogOutClick} className="cursor-pointer">
                logout
              </span>
              <li>
                {userData.uid === adminUid ? (
                  <span
                    onClick={gotoPage}
                    className="cursor-pointer bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-2 border border-gray-400 rounded shadow flex justify-around items-center gap-3"
                  >
                    <TfiWrite />
                    <span>상품등록</span>
                  </span>
                ) : null}
              </li>
              <li>
                {totalCartAmount === 0 ? (
                  <span className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded inline-flex items-center">
                    <Link to="/cart">
                      <BsCart style={{ fontSize: "1.5em", color: "#fff" }} />
                    </Link>
                  </span>
                ) : (
                  <span
                    className="cursor-pointer"
                    style={{
                      width: "115px",
                      background: "#EC4899",
                      borderRadius: "45px",
                      padding: "10px 13px",
                      color: "#fff",
                    }}
                  >
                    <Link
                      to="/cart"
                      style={{
                        display: "inline-flex",
                        gap: "9px",
                        alignItems: "center",
                      }}
                    >
                      <BsCart style={{ fontSize: "1.2em" }} />{" "}
                      <span>
                        <strong className="text-xl">
                          {totalCartAmount === 0 ? null : totalCartAmount}
                        </strong>{" "}
                        Items{" "}
                      </span>
                    </Link>
                  </span>
                )}
              </li>
              <li>
                <div className="flex justify-around items-center gap-0">
                  <img
                    src={userData.photoURL}
                    alt="userPic"
                    className="rounded-full ring-2 ring-white mx-2 max-w-[2rem]"
                  />
                  <span>{userData.displayName}</span>
                </div>
              </li>
            </ul>
          </li>
        ) : (
          <li onClick={handleLogin} className="cursor-pointer">
            login
          </li>
        )}
      </ul>
    </div>
  );
}
