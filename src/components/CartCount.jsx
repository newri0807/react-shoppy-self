import { Database, get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { addOrUpdateToCart, removeFromCart } from "../api/firebase";

export default function CartCount(props) {
  const loginUser = JSON.parse(localStorage.getItem("userInfo"));
  const [mount, setMount] = useState(props.itemCount);
  const [datass, setDatass] = useState(props.datass);
  useEffect(() => {
    get(ref(Database, `carts/${loginUser.uid}`)) //사용자id별로 carts를 보관
      .then((snapshot) => {
        const items = snapshot.val() || {}; //snapshot.val()롤 items을 가져오고 없다면 빈 {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setDatass(Object.values(items));
      });
  }, [loginUser.uid, mount]);

  const reducer = (action, prev) => {
    let changeData = {};
    if (action === "add-count") {
      datass
        .filter(
          (data) =>
            data.itemOption === prev.itemOption && data.itemId === prev.itemId
        )
        .map((prev) => {
          setMount(prev.itemCount + 1);
          return (changeData = {
            ...prev,
            itemCount: prev.itemCount + 1,
          });
        });
    } else {
      datass
        .filter(
          (data) =>
            data.itemOption === prev.itemOption && data.itemId === prev.itemId
        )
        .map((prev) => {
          if (prev.itemCount === 1) {
            return removeFromCart(loginUser.uid, prev.itemId, prev.itemOption);
          } else {
            setMount(prev.itemCount - 1);
            return (changeData = {
              ...prev,
              itemCount: prev.itemCount - 1,
            });
          }
        });
    }

    //console.log(changeData);
    addOrUpdateToCart(loginUser.uid, changeData);
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <button
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold
                 px-2 py-1 rounded min-w-[27px]"
          onClick={() => reducer("add-count", props.item)}
        >
          +
        </button>
        <span className="mx-2 flex items-center justify-center min-w-[20px]">
          {mount}
        </span>
        <button
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold
                px-2 py-1 rounded min-w-[27px]"
          onClick={() => reducer("delate-count", props.item)}
        >
          -
        </button>
      </div>
    </div>
  );
}
