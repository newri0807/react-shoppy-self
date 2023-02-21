import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartContext } from "../context/cart-context";
import { auth, getCart } from "../firebase";

export default function Nav(props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { totalCartAmount, setTotalCartAmount, addTototalCartAmount } =
    useContext(cartContext);

  const localStorageYn = JSON.parse(localStorage.getItem("userInfo"));
  const [userData, setUserData] = useState(localStorageYn);
  const adminUid = process.env.REACT_APP_ADMIN_UID;

  // 페이지 이동
  const Navigate = useNavigate();

  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider(); // provider를 구글로 설정
    signInWithPopup(auth, provider) // popup을 이용한 signup
      .then((data) => {
        localStorage.setItem("userInfo", JSON.stringify(data.user)); // user data 설정
        setUserData(JSON.parse(localStorage.getItem("userInfo")));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (userData !== null) {
      getCart(userData.uid).then((res) => {
        //console.log(res.length);
        addTototalCartAmount(res.length);
      });
    }
  }, [addTototalCartAmount, userData]);

  const onLogOutClick = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("userInfo");
        setUserData("");
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
        <Link to="/">logo </Link>
      </h1>
      <ul className="flex justify-between gap-3 items-center">
        <li>
          <Link to="/product">Product </Link>
        </li>
        {userData ? (
          <li className="flex justify-between items-center gap-2">
            <span onClick={onLogOutClick} className="cursor-pointer">
              logout
            </span>

            {userData.uid === adminUid ? (
              <>
                <span onClick={gotoPage} className="cursor-pointer">
                  상품등록
                </span>
                <span className="cursor-pointer">
                  <Link to="/cart">
                    카트 {totalCartAmount === 0 ? null : totalCartAmount}
                  </Link>
                </span>
              </>
            ) : (
              <span className="cursor-pointer">
                <Link to="/cart">
                  카트 {totalCartAmount === 0 ? null : totalCartAmount}
                </Link>
              </span>
            )}

            <img
              src={userData.photoURL}
              alt="userPic"
              className="rounded-full ring-2 ring-white mx-2 max-w-[2rem]"
            />
            <span>{userData.displayName}</span>
          </li>
        ) : (
          <li onClick={handleGoogleLogin} className="cursor-pointer">
            login
          </li>
        )}
      </ul>
    </div>
  );
}
