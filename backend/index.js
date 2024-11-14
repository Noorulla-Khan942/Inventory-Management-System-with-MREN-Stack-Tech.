const express = require('express');
const cors = require('cors')
require('./db/config');
const User = require('./db/User');
const Product = require('./db/Product')
const Jwt = require('jsonwebtoken');
const jwtKey = 'Inventry mangt. sys';
const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            resp.send({ result: "something went wrong, please try later" })
        }
        resp.send({ result, auth: token })
    })
})

app.post("/login", async (req, resp) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return resp.status(400).send({ result: 'Email and password are required' });
    }

    try {
        let user = await User.findOne({ email, password }).select("-password"); // Ensure correct user lookup logic

        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    console.error("JWT sign error:", err); // Log the error
                    return resp.status(500).send({ result: "Something went wrong, please try again later" });
                }
                resp.send({ user, auth: token });
            });
        } else {
            resp.status(401).send({ result: 'No User Found' }); // User not found
        }
    } catch (error) {
        console.error("Database error:", error); // Log the error
        resp.status(500).send({ result: 'Internal Server Error' }); // Handle other errors
    }
});


app.post('/add-product', verifyToken, async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result)
})

app.get('/products', verifyToken, async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    } else {
        resp.send({ result: 'No products found' })
    }
})

app.delete('/product/:id', verifyToken, async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id })
    resp.send(result)
})

app.get('/product/:id', verifyToken, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ result: "No record found" })
    }
});

app.put('/product/:id', verifyToken, async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
});

app.put('/product/:id', verifyToken, async (req, resp) => {
    let result = await Product.updateOne({ _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
});

app.get('/search/:key', verifyToken, async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { brand: { $regex: req.params.key } },
            { price: { $regex: req.params.key } },
            { category: { $regex: req.params.key } },
            { country: { $regex: req.params.key } }
        ]
    });
    resp.send(result)
})

function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    console.log("Middleware called", token);

    if (token) {
        // Split on space to get the token
        token = token.split(' ')[1];

        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                console.error("Token verification error:", err); // Log the error
                return resp.status(401).send({ result: "Please provide a valid token" });
            } else {
                // If the token is valid, call the next middleware
                next();
            }
        });
    } else {
        console.warn("No token provided");
        return resp.status(403).send({ result: "Please add token with header" });
    }
}


app.listen(5000);