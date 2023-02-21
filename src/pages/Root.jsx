import React, { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import { cartContext, CartProvider } from "../context/cart-context";
import { getCart } from "../firebase";

export default function root() {
  return (
    <CartProvider>
      <div className="container mx-auto px-4">
        <Nav />
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </CartProvider>
  );
}
