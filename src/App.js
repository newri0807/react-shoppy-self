import logo from "./logo.svg";
import "./App.css";
import { CartProvider } from "./context/cart-context";
import Nav from "./components/Nav";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <CartProvider>
        <div className="container mx-auto px-4">
          <Nav />
          <div className="p-5">
            <Outlet />
          </div>
        </div>
      </CartProvider>
    </div>
  );
}

export default App;
