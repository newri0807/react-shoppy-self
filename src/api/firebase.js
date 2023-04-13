// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, remove, set } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase();
export { app, auth, db };

// 📌 handleGoogleLogin 메소드는 구글 OAuth 인증을 사용하여 Firebase Authentication에 로그인하는 메소드
export async function handleGoogleLogin() {
  const provider = new GoogleAuthProvider(); // provider를 구글로 설정
  return signInWithPopup(auth, provider) // popup을 이용한 signup
    .then((data) => {
      console.log("extra", data.user);
      // localStorage.setItem("userInfo", JSON.stringify(data.user)); // user data 설정
      // return JSON.parse(localStorage.getItem("userInfo"));
      return data.user;
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function getCart(userId) {
  return get(ref(database, `carts/${userId}`)) //사용자id별로 carts를 보관
    .then((snapshot) => {
      const items = snapshot.val() || {}; //snapshot.val()롤 items을 가져오고 없다면 빈 {}
      return Object.values(items);
    });
}

export async function addOrUpdateToCart(userId, product) {
  // console.log(product, product.itemId);
  return set(
    ref(database, `carts/${userId}/${product.itemId}_${product.itemOption}`),
    product
  ); //product을 추가
}

export async function removeFromCart(userId, itemId, itemOption) {
  return remove(ref(database, `carts/${userId}/${itemId}_${itemOption}`));
}

// 📌 onAuthStateChanged 메소드는 로그인 상태가 변경될 때마다 실행되는 콜백 함수를 등록하는 메소드
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};
