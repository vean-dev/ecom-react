import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

// Components and Pages
import AppNavbar from "./components/AppNavbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetailPage from "./components/ProductDetailPage";
import ViewCart from "./pages/ViewCart";
import Logout from "./pages/Logout";

import { UserProvider } from "./UserContext";
//import AdminView from "./components/AdminView";
import Profile from "./components/Profile";

import './App.css';


function App() {


    const [user, setUser] = useState({ access: localStorage.getItem("token") });
  
    const unsetUser = () => {
      localStorage.clear();
    }
  
    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log("User data", data);
        if (typeof data.user !== "undefined"){
          setUser({
            id: data.user._id,
            isAdmin: data.user.isAdmin
          });
        } else {
          setUser({
            id: null,
            isAdmin: null
          })
        }
      })
    }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar/>
        <Container fluid>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/logout" element={<Logout />}/>
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<ViewCart />} />
            <Route path="/register" element={<Register />}/>
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
