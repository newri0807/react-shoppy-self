import { signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartContext } from "../context/cart-context";
import { auth, getCart, handleGoogleLogin } from "../api/firebase";
<<<<<<< HEAD

export default function Nav(props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { totalCartAmount, addTototalCartAmount } = useContext(cartContext);

  const localStorageYn = JSON.parse(localStorage.getItem("userInfo"));
  const [userData, setUserData] = useState(localStorageYn);
  const adminUid = process.env.REACT_APP_ADMIN_UID;

  // 페이지 이동
  const Navigate = useNavigate();

  // function handleGoogleLogin() {
  //   const provider = new GoogleAuthProvider(); // provider를 구글로 설정
  //   signInWithPopup(auth, provider) // popup을 이용한 signup
  //     .then((data) => {
  //       localStorage.setItem("userInfo", JSON.stringify(data.user)); // user data 설정
  //       setUserData(JSON.parse(localStorage.getItem("userInfo")));
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
=======
import { BsCart } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";


export default function Nav() {
  const { totalCartAmount, addTototalCartAmount } = useContext(cartContext);
  const [userData, setUserData] = useState(null);
  const adminUid = process.env.REACT_APP_ADMIN_UID;
  const Navigate = useNavigate();

>>>>>>> reset2

  const handleLogin = () => {
    handleGoogleLogin().then((res) => {
      localStorage.setItem("userInfo", JSON.stringify(res));
<<<<<<< HEAD
      setUserData(localStorageYn);
=======
      setUserData(res);
>>>>>>> reset2
    });
  };

  useEffect(() => {
<<<<<<< HEAD
    if (userData !== undefined) {
      console.log(userData.uid);
      getCart(userData.uid).then((res) => {
        console.log(res);
=======
    if (userData !== null) {
      getCart(userData.uid).then((res) => {
>>>>>>> reset2
        addTototalCartAmount(res.length);
      });
    }
  }, [addTototalCartAmount, userData]);

<<<<<<< HEAD
=======
    useEffect(() => {
    const localStorageYn = JSON.parse(localStorage.getItem("userInfo"));
    if (localStorageYn) {
      setUserData(localStorageYn);
    }
  }, []);

>>>>>>> reset2
  const onLogOutClick = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("userInfo");
<<<<<<< HEAD
        setUserData("");
=======
        setUserData(null);
>>>>>>> reset2
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

<<<<<<< HEAD
  return (
    <div className="flex items-center justify-between py-5 border-b-2 border-rose-300">
      <h1>
        <Link to="/">logo </Link>
=======
 
  return (
    <div className="flex items-center justify-between py-5 border-b-2 border-rose-300">
      <h1>
        <Link to="/" className='text-4xl font-extrabold text-[#e2559c] '>SHOPPY</Link>
>>>>>>> reset2
      </h1>
      <ul className="flex justify-between gap-3 items-center">
        <li>
          <Link to="/product">Product </Link>
        </li>
        {userData ? (
<<<<<<< HEAD
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
=======
          <li>
          <ul className="flex justify-between items-center gap-3">
            <span onClick={onLogOutClick} className="cursor-pointer">
              logout
            </span>
            <li>
               {userData.uid === adminUid ? (
                <span onClick={gotoPage} className="cursor-pointer bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-2 border border-gray-400 rounded shadow flex justify-around items-center gap-3">
                  <TfiWrite/><span>상품등록</span>
                </span>                           
            ) : null}
            </li>
           <li>
              {totalCartAmount === 0 ?(
                <span className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded inline-flex items-center" >
                    <Link to="/cart">
                      <BsCart style={{fontSize:"1.5em", color: '#fff'}}/> 
                    </Link>
                  </span>
              ):(
                  <span className="cursor-pointer"  style={{width: '115px', background: '#EC4899', borderRadius: "45px", padding: "10px 13px", color: "#fff"}}>
                    <Link to="/cart" style={{display: "inline-flex", gap: "9px",  alignItems: "center"}}>
                      <BsCart style={{fontSize:"1.2em"}}/> <span><strong className='text-xl'>{totalCartAmount === 0 ? null : totalCartAmount}</strong> Items </span>
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
>>>>>>> reset2
        ) : (
          <li onClick={handleLogin} className="cursor-pointer">
            login
          </li>
        )}
      </ul>
    </div>
  );
}
