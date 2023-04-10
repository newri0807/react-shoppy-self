/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getDatabase, set, ref, get, child, push } from "firebase/database";
import { getDownloadURL, getStorage, ref as ref2 } from "firebase/storage";
import { addOrUpdateToCart, getCart } from "../api/firebase";
import { cartContext } from "../context/cart-context";

export default function Detail() {
  const { addTototalCartAmount } = useContext(cartContext);
  //파라미터
  let { id } = useParams();
  //test

  // 셀렉트 옵션 선택
  const [Selected, setSelected] = useState();

  //현재로그인한 user 정보
  const loginUserId = JSON.parse(localStorage.getItem("userInfo"));
  //console.log("현재로그인한 사람uid", loginUserId.uid);

  const dbRef = ref(getDatabase());
  const fetchTodoList = get(child(dbRef, `products/${id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const values = snapshot.val();
        return values;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  // // eslint-disable-next-line react-hooks/rules-of-hooks
  const { status, data, error } = useQuery(
    ["detail"],
    () => {
      return fetchTodoList;
    },
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  const { itemImg, itemName, itemPrice, itemOption, itemImgUrl } = data;

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  const selectOptions = itemOption;
  const selectList = selectOptions.split(",");

  // 장바구니 추가
  let nowCarts = {};
  function addCart(e) {
    e.preventDefault();

    let find;

    let selected = `${Selected}`;
    if (Selected === undefined) {
      selected = `${selectList[0]}`;
    }

    getCart(loginUserId.uid).then((appData) => {
      if (Object.keys(appData).length !== 0) {
        find = appData.find((one) => one.itemId === id);
      }

      const find2 = appData.find(
        (one) => one.itemOption === selected && one.itemId === id
      );

      if (find === undefined) {
        console.log("새상품 등록중");
        nowCarts = {
          itemImg,
          itemId: id,
          itemName,
          itemPrice,
          itemImgUrl,
          itemOption: selected,
          itemCount: 1,
        };
      } else {
        console.log(find2, selected);
        if (find2 === undefined) {
          console.log("같은 상품&& 옵션 다른 ----- 데이터 추가");
          appData
            .filter((data) => data.itemId === id)
            .map((prev) => {
              return (nowCarts = {
                ...prev,
                itemOption: selected,
                itemCount: 1,
              });
            });
        } else {
          console.log("같은 상품 && 같은 옵션 추가중 ---- 수량만 +1");
          appData
            .filter(
              (data) => data.itemOption === selected && data.itemId === id
            )
            .map((prev) => {
              return (nowCarts = {
                ...prev,
                itemOption: selected,
                itemCount: prev.itemCount + 1,
              });
            });
        }
      }

      console.log("새로 추가한 ", nowCarts);
      addOrUpdateToCart(loginUserId.uid, nowCarts); // 추가 및 업데이트에 담아서 보낸다.

      getCart(loginUserId.uid).then((res) => {
        //console.log(res.length);
        addTototalCartAmount(res.length);
      });
    });
    alert("카드에 등록되었습니다");
    // Navigate("/");
  }

  return (
    <form onSubmit={addCart}>
      <img alt={`${itemImg} 이미지`} src={itemImgUrl} />
      <h3> {itemName}</h3>
      <h5>{itemPrice}원</h5>
      <select
        onChange={handleSelect}
        className="border-2 rounded text-gray-500 p-1 my-2 w-sm block selectBox"
        defaultValue={selectList[0]}
      >
        {selectList.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </select>
      <button
        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        장바구니에 넣기
      </button>
    </form>
  );
}
