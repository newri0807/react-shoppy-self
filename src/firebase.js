// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, remove, set } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrfoBPS44DjFzUTYv9OE9U-pG1Yl0cJ9g",
  authDomain: "react-shoppy-3b5bd.firebaseapp.com",
  databaseURL:
    "https://react-shoppy-3b5bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-shoppy-3b5bd",
  storageBucket: "react-shoppy-3b5bd.appspot.com",
  messagingSenderId: "695819232826",
  appId: "1:695819232826:web:610f5267caecfc903d7703",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase();
export { app, auth, db };

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
