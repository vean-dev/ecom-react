import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import ProductCard from './ProductCard';


const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [error, setError] = useState('');
  const [showSearchProductByName, setShowSearchProductByName] = useState(true);

  const handleSearch = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/searchByName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productName: searchQuery })
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for products:', error);
    }
  };

  const handleSearchByPriceRange = async () => {
    setError('');

    if (!minPrice || !maxPrice) {
      setError('Please enter both minimum and maximum prices.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/searchByPrice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ minPrice, maxPrice })
      });

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.results);
      } else {
        setError(data.message);
        setSearchResults([]);

      }
    } catch (error) {
      setError('An error occurred while searching for products.');
      console.error(error);
    }

  }

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      {showSearchProductByName ? (
        <>
          <h2>Search Product by Name</h2>
          <div className="form-group">
            <label htmlFor="courseName">Course Name:</label>
            <input
              type="text"
              id="courseName"
              className="form-control"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <Button className="btn btn-primary my-2" onClick={handleSearch}>
            Search
          </Button>
          <br />
          <Button className="my-2" onClick={() => setShowSearchProductByName(false)}>
            Switch to Search Product by Price Range
          </Button>
        </>
      ) : (
        <>
          <h2>Search Product by Price Range</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group">
            <label htmlFor="minPrice">Minimum Price:</label>
            <input
              type="number"
              className="form-control"
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="maxPrice">Maximum Price:</label>
            <input
              type="number"
              className="form-control"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <Button className="btn btn-primary my-2" onClick={handleSearchByPriceRange}>
            Search
          </Button>
          <br />
          <Button className="my-2" onClick={() => setShowSearchProductByName(true)}>
            Switch to Search Product by Name
          </Button>
        </>
      )}

      <h3>Search Results:</h3>
      <ul style={{ display: "flex", flexWrap: "wrap", listStyleType: "none", padding: 0 }}>
        {Array.isArray(searchResults) && searchResults.map((product) => (
          <li key={product._id} style={{ flex: "0 0 auto", margin: "10px", maxWidth: "300px" }}>
            <ProductCard productProp={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSearch;
