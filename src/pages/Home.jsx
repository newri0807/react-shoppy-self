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

