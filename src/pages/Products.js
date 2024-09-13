import { useContext, useEffect, useState } from "react";
import UserContext from '../UserContext';

// Components
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";

export default function Products() {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/products/all` : `${process.env.REACT_APP_API_BASE_URL}/products/active`;

        fetch(fetchUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch products');
            }
            return res.json();
        })
        .then(data => {
            setProducts(data.products || []);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            setProducts([]);
        });
    };
    

    return (
        <> 
            {
                user.isAdmin ? 
                    <AdminView productsData={products} fetchData={fetchData}/>
                :
                    <UserView productsData={products}/>
            }
        </>
    );
}
