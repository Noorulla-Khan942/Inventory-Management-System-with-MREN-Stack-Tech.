import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [country, setCountry] = useState('');

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getProductDetails();
    }, [])

    const getProductDetails = async () => {
        let result = await fetch(`http://localhost:5000/product/${params.id}`, {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        setName(result.name)
        setBrand(result.brand)
        setPrice(result.price)
        setCategory(result.category)
        setCountry(result.country)
    }

    const updateProduct = async () => {
        console.log(name, brand, price, category, country)
        let result = await fetch(`http://localhost:5000/product/${params.id}`, {
            method: 'put',
            body: JSON.stringify({ name, brand, price, category, country }),
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json()
        console.log(result)
        navigate('/')
    }

    return <>
        <div className="product">
            <h1>Update Product</h1>
            <input type="text" className="inputBox" placeholder="Enter product name" value={name} onChange={(e) => { setName(e.target.value) }} />
            <input type="text" className="inputBox" placeholder="Enter product brand" value={brand} onChange={(e) => { setBrand(e.target.value) }} />
            <input type="text" className="inputBox" placeholder="Enter product price" value={price} onChange={(e) => { setPrice(e.target.value) }} />
            <input type="text" className="inputBox" placeholder="Enter product category" value={category} onChange={(e) => { setCategory(e.target.value) }} />
            <input type="text" className="inputBox" placeholder="Enter product country" value={country} onChange={(e) => { setCountry(e.target.value) }} />
            <button onClick={updateProduct} className="appButton">Update Product</button>
        </div>
    </>
}

export default UpdateProduct;