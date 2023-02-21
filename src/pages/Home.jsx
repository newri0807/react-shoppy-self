/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { getDatabase, ref, child, get } from "firebase/database";
import { useQuery } from "react-query";
import {
  getDownloadURL,
  getStorage,
  uploadBytes,
  ref as ref2,
} from "firebase/storage";

export default function home() {
  const dbRef = ref(getDatabase());
  const fetchTodoList = get(child(dbRef, `products`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        //console.log(snapshot.val());
        return Object.values(snapshot.val()); //배열화
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { status, data, error } = useQuery(
    ["products"],
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
  console.log(data, typeof data);
  return (
    <ul>
      {data &&
        // eslint-disable-next-line array-callback-return
        data.map((item, i) => {
          //bringImg(data[key].values.itemImg, i);
          return (
            <li
              className="cursor-pointer"
              key={i}
              onClick={() => {
                // eslint-disable-next-line no-restricted-globals
                location.href = `/detail/${item.index}`;
              }}
            >
              <img className={`products_${i}`} src={item.itemImgUrl} />
              <h3> {item.itemName}</h3>
              <h5>{`${item.itemPrice}원`}</h5>
            </li>
          );
        })}
    </ul>
  );
}

const bringImg = (imgName, i) => {
  // storage 이미지 불러오기 !
  const storage = getStorage();
  // Create a reference under which you want to list
  const storageRef = ref2(storage, `product/${imgName}`);

  getDownloadURL(storageRef).then((url) => {
    //console.log(url, "나는 URL");
    const img = document.querySelector(`.products_${i}`);
    img.setAttribute("src", url);
  });
};
