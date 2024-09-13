import { useEffect, useState } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import ProductCard from './ProductCard';
import ProductSearch from "./ProductSearch";

export default function UserView({ productsData }) {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

    useEffect(() => {
        const filteredProducts = (productsData || [])
            .filter(product => product.isActive)
            .sort((a, b) => a.name.localeCompare(b.name));
        setProducts(filteredProducts);
    }, [productsData]);

    
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <>
            <ProductSearch />
            <h1 className="text-center">Product Catalog</h1>
            <Container>
                <Row>
                    {currentProducts.map(product => (
                        <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                            <div>
                                <ProductCard productProp={product} />
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
            <div className="d-flex justify-content-center">
                <div className="pagination">
                    <Button variant="outline-primary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>{' '}
                    {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => (
                        <Button key={i} variant="outline-primary" onClick={() => paginate(i + 1)}>{i + 1}</Button>
                    ))}
                    <Button variant="outline-primary" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastProduct >= products.length}>Next</Button>
                </div>
            </div>
        </>
    );
}
