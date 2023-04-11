import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import AddProduct from "./pages/AddProduct";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Error Page 😭</div>,
    children: [
      { index: true, path: "/", element: <Home /> },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/addProduct",
        element: <AddProduct />,
      },
      {
        path: "/detail/:id",
        element: <Detail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    {/* devtools */}
    <ReactQueryDevtools initialIsOpen={true} />
    <RouterProvider router={router} />
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
