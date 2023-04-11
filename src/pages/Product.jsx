import React from "react";
<<<<<<< HEAD

export default function Product() {
  return <div>Product</div>;
=======
import { getDatabase, ref, child, get, orderByChild } from "firebase/database";
import { useQuery } from "react-query";
import { useNavigate } from 'react-router-dom';

export default function Product() {
  const dbRef = ref(getDatabase());
  const fetchTodoList = get(child(dbRef, `products`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        //console.log(snapshot.val());
        const data = Object.values(snapshot.val()); //배열화
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
  //console.log(data, typeof data);
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data &&
        data.map((item, i) => {
          return (
            <li
              className="mb-6 mt-5 cursor-pointer card rounded-t-md shadow-lg  shadow-gray-400/20 animate-float ease-out duration-300"
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
  );
>>>>>>> reset2
}
