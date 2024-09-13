//ArchiveProduct.js

import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ArchiveProduct({ productId, isActive, fetchData }){

    const archiveProduct = () => {
        console.log("Archiving product with ID:", productId)
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/archive/${productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        .then(res => res.json())
        .then(data => {
            if (data.archiveProduct.message === "Product archived successfully") {
                Swal.fire({
                    title: "Product Archived",
                    text: "Product successfully archived",
                    icon: "success"
                });
                fetchData();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to archived product",
                    icon: "error"
                });
            }
        })
        .catch(error => {
            console.error("Error archiving product:", error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while archiving the product",
                icon: "error"
            });
        });
    };

    const activateProduct = () => {

        
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/activate/${productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.activateProduct.message  === "Product activated successfully") {
                Swal.fire({
                    title: "Product Activated",
                    text: "Product successfully activated",
                    icon: "success"
                });
                fetchData();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to archived product",
                    icon: "error"
                });
            }
        })
        .catch(error => {
            console.error("Error activating product:", error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while activating the product",
                icon: "error"
            });
        });
    };

    return (
        <>
            {isActive ? (
                <Button variant="danger" onClick={archiveProduct}>Archive</Button>
            ) : (
                <Button variant="success" onClick={activateProduct}>Activate</Button>
            )}
        </>



    );
}
