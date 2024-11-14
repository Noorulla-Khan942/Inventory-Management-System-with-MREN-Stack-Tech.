import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts()
    }, []);

    const getProducts = async () => {
        let result = await fetch('http://localhost:5000/products', {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json();
        setProducts(result)
    }
    console.log('products', products)

    const deleteProduct = async (id) => {
        let result = await fetch(`http://localhost:5000/product/${id}`, {
            method: "Delete",
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json()
        if (result) {
            getProducts();
        }
        console.log(id)
    }

    const searchHandle = async (e) => {
        let key = e.target.value
        if (key) {
            let result = await fetch(`http://localhost:5000/search/${key}`, {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            })
            result = await result.json()
            if (result) {
                setProducts(result)
            }
        } else {
            getProducts()
        }
    }

    return <>
        <div className='product-list'>
            <h2>Product List</h2>
            <input type="text" className="search-product-box" placeholder="Search Product" onChange={searchHandle} />
            <ul>
                <li>S no.</li>
                <li>Name</li>
                <li>Brand</li>
                <li>Price</li>
                <li>Category</li>
                <li>Country</li>
                <li>Operations</li>
            </ul>
            {
                products.length > 0 ? products.map((item, index) =>
                    <ul key={item._id}>
                        <li>{index + 1}</li>
                        <li>{item.name}</li>
                        <li>{item.brand}</li>
                        <li>{item.price}</li>
                        <li>{item.category}</li>
                        <li>{item.country}</li>
                        <li><button onClick={() => deleteProduct(item._id)}>Delete</button>
                            <Link to={"/update/" + item._id}>Update</Link>
                        </li>
                    </ul>
                )
                    : <h1>No Result Found</h1>
            }
        </div>
    </>
}

export default ProductList;