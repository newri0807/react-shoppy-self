<<<<<<< HEAD
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
=======
import React from "react";
import { getDatabase, ref, child, get, limitToFirst, query } from "firebase/database";
import { useQuery } from "react-query";
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const dbRef = ref(getDatabase());
    // 4개만 가져오기
    const productsQuery = query(child(dbRef, `products`), limitToFirst(4));
    const fetchTodoList = get(productsQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val());
          // 금액 높은 순으로 정렬
          const sortedData = data && data.map(item => {
          return { ...item, itemPrice: parseInt(item.itemPrice.replace(',', '')) };
          }).sort((a, b) => b.itemPrice - a.itemPrice);
          return sortedData;
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });

 const Navigate = useNavigate();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { status, data, error } = useQuery(
    ["Home_products"],
>>>>>>> reset2
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
<<<<<<< HEAD
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
  // storage 이미지 불러오기!
  const storage = getStorage();
  // Create a reference under which you want to list
  const storageRef = ref2(storage, `product/${imgName}`);

  getDownloadURL(storageRef).then((url) => {
    //console.log(url, "나는 URL");
    const img = document.querySelector(`.products_${i}`);
    img.setAttribute("src", url);
  });
};
=======
  //console.log(data, typeof data);
  return (
    <>  
      <div className="max-w-full overflow-hidden shadow-lg mb-10 bg-cover bg-center" style={{Width: "100%",  height: "20vh", backgroundImage: "url('./image/main-banner.jpg')"}}>
       
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data &&
          data.map((item, i) => {
            return (
              <li
                className="mb-4 cursor-pointer card rounded-t-md shadow-lg  shadow-gray-400/20 animate-float ease-out duration-300"
                key={i}
                onClick={() => {
                Navigate(`/detail/${item.index}`);
                }}
              >
                <img className={`products_${i}`} src={item.itemImgUrl} alt={`products_${i}`}/>
                <h3 className='text-lg mt-4 mb-2 font-semibold'> {item.itemName}</h3>
                <h5 className='mb-[10px]'>
                {isNaN(item.itemPrice)
                  ? item.itemPrice
                  : `${Number(item.itemPrice).toLocaleString('ko-KR')}원`}
                </h5>
              </li>
            );
          })}
      </ul>    
    </>    
  );
}

>>>>>>> reset2
