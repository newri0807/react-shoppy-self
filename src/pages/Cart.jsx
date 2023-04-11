import React, { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { cartContext } from "../context/cart-context";
import { addOrUpdateToCart, getCart, removeFromCart } from "../api/firebase";

export default function Cart() {
  const { addTototalCartAmount } = useContext(cartContext);
  const loginUser = JSON.parse(localStorage.getItem("userInfo"));
  //const [datass, setDatass] = useState();

  const QueryClient = useQueryClient();
  const mutation = useMutation(() => getCart(loginUser.uid), {
    onSuccess: () => QueryClient.invalidateQueries(["carts"]),
  });

  const { status, data, error } = useQuery(
    ["carts"],
    () => getCart(loginUser.uid),
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

  console.log(data, data.length);
  const reducer = (action, prev) => {
    let changeData = {};
    if (action === "add-count") {
      data
        .filter(
          (data) =>
            data.itemOption === prev.itemOption && data.itemId === prev.itemId
        )
        .map((prev) => {
          return (changeData = {
            ...prev,
            itemCount: prev.itemCount + 1,
          });
        });
    } else {
      data
        .filter(
          (data) =>
            data.itemOption === prev.itemOption && data.itemId === prev.itemId
        )
        .map((prev) => {
          if (prev.itemCount === 1) {
            return removeFromCart(loginUser.uid, prev.itemId, prev.itemOption);
          } else {
            return (changeData = {
              ...prev,
              itemCount: prev.itemCount - 1,
            });
          }
        });
    }
    //console.log(changeData);

    mutation.mutate(
      {},
      {
        onSuccess: () => {
          getCart(loginUser.uid).then((res) => {
            console.log(res.length);
            addTototalCartAmount(res.length);
          });
        },
      }
    );

    addOrUpdateToCart(loginUser.uid, changeData);
  };

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
                  key={item.itemId}
                  className="flex items-center justify-between my-2"
                >
                  <span className="min-w-[150px]">
                    <img
                      src={item.itemImgUrl}
                      alt=""
                      className={`product_${index}`}
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

                  <button
                    className="bg-gray-800 hover:bg-gray-800 text-white font-bold
                px-2 py-1  min-w-[27px] "
                    onClick={() => {
                      removeFromCart(
                        loginUser.uid,
                        item.itemId,
                        item.itemOption
                      );
                      mutation.mutate();
                      getCart(loginUser.uid).then((res) => {
                        //console.log(res.length);
                        addTototalCartAmount(res.length);
                      });
                    }}
                  >
                    x
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
