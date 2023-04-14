import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { cartContext } from "../context/cart-context";
import { addOrUpdateToCart, getCart, removeFromCart } from "../api/firebase";

export default function Cart() {
  const { addTototalCartAmount, user } = useContext(cartContext);
  const loginUser = user;
  const [totalPrice, setTotalPrice] = useState(0);

  // React Query 클라이언트 인스턴스 생성
  const QueryClient = useQueryClient();

  // 작성법 1. -- useMutation() && useQueryClient() 사용
  // const mutation = useMutation(() => getCart(loginUser.uid), {
  //   onSuccess: () => {
  //     QueryClient.invalidateQueries(["carts"]);
  //     getCart(loginUser.uid).then((res) => {
  //       QueryClient.setQueryData("carts", res);
  //       setTotalPrice(calculateTotalPrice(res));
  //        addTototalCartAmount(res.length);
  //     });
  //   },
  // });

  // 장바구니에 있는 상품의 총 가격을 구하는 함수
  const calculateTotalPrice = (res) => {
    let totalPrices = 0;
    for (let i = 0; i < res.length; i++) {
      totalPrices += Number(
        res[i].itemPrice.replace(/,/g, "") * res[i].itemCount
      );
    }
    console.log(totalPrices);
    return totalPrices;
  };

  // 작성법 2. -- useQueryClient() 사용
  // useEffect(() => {
  //   console.log(user);
  //   getCart(loginUser.uid).then((res) => {
  //     //cache를 업데이트 하기 위해 setQueryData를 사용
  //     QueryClient.setQueryData("carts", res);
  //     setTotalPrice(calculateTotalPrice(res));
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [QueryClient]);

  const { status, data, error } = useQuery(
    ["carts", loginUser.uid],
    () => getCart(loginUser.uid),
    {
      staleTime: 1000 * 60 * 5,
      onSuccess: (res) => setTotalPrice(calculateTotalPrice(res)),
    }
  );

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  // 버튼 클릭시 상품의 개수를 변경하는 함수
  const reducer = (action, prev) => {
    let changeData = {};
    const itemToUpdate = data.find(
      (data) =>
        data.itemOption === prev.itemOption && data.itemId === prev.itemId
    );

    if (!itemToUpdate) {
      return;
    }

    console.log("itemToUpdate", action);
    if (action === "add-count") {
      changeData = {
        ...itemToUpdate,
        itemCount: itemToUpdate.itemCount + 1,
      };
    } else {
      if (itemToUpdate.itemCount === 1) {
        removeFromCart(
          loginUser.uid,
          itemToUpdate.itemId,
          itemToUpdate.itemOption
        );
        totalCartCountFunc();
      } else {
        changeData = {
          ...itemToUpdate,
          itemCount: itemToUpdate.itemCount - 1,
        };
      }
    }

    addOrUpdateToCart(loginUser.uid, changeData);

    // 작성법 1. -- mutation 사용
    // mutation.mutate();

    // 작성법 2. -- useQueryClient 사용
    // cache를 무효화하고 다시 쿼리를 실행
    QueryClient.invalidateQueries(["carts"]);
  };

  // 장바구니에 있는 상품의 총 개수를 구하는 함수
  function totalCartCountFunc() {
    getCart(loginUser.uid).then((res) => {
      addTototalCartAmount(res.length);
    });
  }

  return (
    <div>
      {data.length === 0 && (
        <h1 className="flex justify-center">장바구니에 아무것도 없습니다.</h1>
      )}
      {data.length > 0 && (
        <ul>
          {data &&
            data.map((item, index) => {
              return (
                <li
                  key={index}
                  className="flex items-center justify-between my-2"
                >
                  <span className="min-w-[150px]">
                    <img
                      src={item.itemImgUrl}
                      alt=""
                      className={`product_${index} max-h-[300px]`}
                    />
                  </span>
                  <span className="min-w-[150px]">{item.itemName} </span>
                  <span className="min-w-[150px]">
                    옵션 : {item.itemOption}
                  </span>
                  <div className="flex items-center justify-center">
                    <button
                      className="bg-pink-500 hover:bg-pink-700 text-white font-bold
                 px-2 py-1 rounded min-w-[27px]"
                      onClick={() => reducer("add-count", item)}
                    >
                      +
                    </button>
                    <span className="mx-2 flex items-center justify-center min-w-[20px]">
                      {item.itemCount}
                    </span>
                    <button
                      className="bg-pink-500 hover:bg-pink-700 text-white font-bold
                px-2 py-1 rounded min-w-[27px]"
                      onClick={() => reducer("delate-count", item)}
                    >
                      -
                    </button>
                  </div>
                  <span className={`min-w-[150px] each_price`}>
                    {`${Number(
                      item.itemPrice.replace(/,/g, "") * item.itemCount
                    ).toLocaleString("ko-KR")}`}
                    원
                  </span>
                  <button
                    className="bg-gray-800 hover:bg-gray-800 text-white font-bold
                px-2 py-1  min-w-[27px] "
                    onClick={() => {
                      removeFromCart(
                        loginUser.uid,
                        item.itemId,
                        item.itemOption
                      );
                      QueryClient.invalidateQueries(["carts"]);
                      //mutation.mutate();
                      totalCartCountFunc();
                    }}
                  >
                    x
                  </button>
                </li>
              );
            })}
          <table className="table-fixed w-full my-14 border text-center  font-light dark:border-neutral-500">
            <thead className="border-b font-medium dark:border-neutral-500">
              <tr className="border-separate border-neutral-700 bg-neutral-800 text-neutral-50 dark:border-neutral-600 dark:bg-neutral-700">
                <th className="border-r px-6 py-4 dark:border-neutral-500">
                  총 상품금액
                </th>
                <th className="border-r px-6 py-4 dark:border-neutral-500">
                  총 배송비
                </th>
                <th className="border-r px-6 py-4 dark:border-neutral-500">
                  결제예정금액
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-neutral-500">
                <td className="border-r px-6 py-4 dark:border-neutral-500 text-xl ">
                  {`${Number(totalPrice).toLocaleString("ko-KR")}`}원
                </td>
                <td className="border-r px-6 py-4 dark:border-neutral-500 text-xl ">
                  {`${Number(3000).toLocaleString("ko-KR")}`}원
                </td>
                <td className="border-r px-6 py-4 dark:border-neutral-500 text-xl font-bold  text-[#EC4899]">
                  {`= ${Number(totalPrice).toLocaleString("ko-KR")}`}원
                </td>
              </tr>
            </tbody>
          </table>
          <button
            className="w-full bg-[#EC4899] hover:bg-[#cc126f] text-white font-bold py-2 px-4"
            onClick={() => {
              alert("결제기능은 준비중 입니다😁");
            }}
          >
            CHECKOUT
          </button>
        </ul>
      )}
    </div>
  );
}
