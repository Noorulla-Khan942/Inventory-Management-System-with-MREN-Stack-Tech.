import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();


    const addProduct = async () => {
        console.log(!name)
        if (!name || !brand || !price || !category || !country) {
            setError(true)
            return false
        }
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        let result = await fetch("http://localhost:5000/add-product", {
            method: 'post',
            body: JSON.stringify({ name, brand, price, category, country, userId }),
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        console.log(result)
        navigate('/')
    }


    return <>
        <div className="product">
            <h1>Add Product</h1>
            <input type="text" className="inputBox" placeholder="Enter Name" onChange={(e) => { setName(e.target.value) }} value={name} /> {error && !name && <span className="invalid-input">Enter valid name</span>}
            <input type="text" className="inputBox" placeholder="Enter Brand" onChange={(e) => { setBrand(e.target.value) }} value={brand} /> {error && !brand && <span className="invalid-input">Enter valid brand</span>}
            <input type="text" className="inputBox" placeholder="Enter Price" onChange={(e) => { setPrice(e.target.value) }} value={price} /> {error && !price && <span className="invalid-input">Enter valid price</span>}
            <input type="text" className="inputBox" placeholder="Enter Category" onChange={(e) => { setCategory(e.target.value) }} value={category} /> {error && !category && <span className="invalid-input">Enter valid category</span>}
            <input type="text" className="inputBox" placeholder="Enter Country" onChange={(e) => { setCountry(e.target.value) }} value={country} /> {error && !country && <span className="invalid-input">Enter valid country</span>}
            <button className="appButton" onClick={addProduct}>Add Product</button>
        </div>
    </>
}

export default AddProduct;