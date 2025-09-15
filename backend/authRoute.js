import express from 'express';

import usermodel from './usermodel.js';

import itemmodel from './itemmodel.js';

import ordermodel from './ordermodel.js';

import { hashPassword, comparePassword } from './authHepler.js';

import dotenv from 'dotenv';

import { requireSignIn } from './authMiddleware.js';

import JWT from 'jsonwebtoken';

import cookieParser from 'cookie-parser';

import User from './usermodel.js';

import Item from './itemmodel.js';

import crypto from 'crypto';

import bcrypt from 'bcrypt';

import axios from 'axios';

// import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = 'process.env.RECAPTCHA_SECRET_KEY';


//import { cookies } from 'js-cookie';

//const router = express.Router();

dotenv.config();

const registerController = async (req, res) => {
    try {
        //console.log(res);

        const firstname = req.body.firstName;
        const lastname = req.body.lastName;
        const email = req.body.email;
        const age = req.body.age;
        const contactnumber = req.body.contactNumber;
        const password = req.body.password;

        //console.log(req.body.firstName);
        if (!req.body.firstName) {
            return res.status(400).send({
                success: false,
                message: 'First name is required'
            });
        }
        if (!lastname) {
            return res.status(400).send({
                success: false,
                message: 'Last name is required'
            });
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Email is required'
            });
        }
        if (!age) {
            return res.status(400).send({
                success: false,
                message: 'Age is required'
            });
        }
        if (!contactnumber) {
            return res.status(400).send({
                success: false,
                message: 'Contact number is required'
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: 'Password is required'
            });
        }
        const existinguser = await usermodel.findOne({ email });

        if (existinguser) {
            return res.status(400).send({
                success: false,
                message: 'Email already exists'
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await new usermodel({
            firstname,
            lastname,
            email,
            age,
            contactnumber,
            password: hashedPassword
        }).save();

        res.status(201).send({
            success: true,
            message: 'User registered successfully'
        });

    } catch (err) {
        console.error('Error in register controller:', err);
        res.status(500).send(
            {
                success: false,
                message: 'error in register controller',
            }
        );
    }
};

const loginController = async (req, res) => {
    try {
        console.log(req.body);
        console.log("hi3");
        //console.log
        //const { email, password } = req.body;
        const email = req.body.email;
        const password = req.body.password;
        const recaptchaToken = req.body.recaptchaToken;

        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Email is required'
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: 'Password is required'
            });
        }
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${recaptchaToken}`;
        const response = await axios.post(verifyUrl);
        if (!response.data.success) {
            return res.status(400).send({ success: false, message: 'reCAPTCHA verification failed' });
        }
        console.log("hi1");
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log("hi");

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: 'Invalid email or password'
            });
        }

        //console.log('JWT_SECRET:', process.env.JWT_SECRET);

        //const token = JWT.sign({ id: user._id }, 'HGFHGEADFT12678' , { expiresIn: '10d' });

        console.log("here1");

        const accessToken = JWT.sign({ id: user._id }, 'HGFHGEADFT12678', { expiresIn: '15m' });
        const refreshToken = JWT.sign({ id: user._id }, 'HGFHGEADFT12678', { expiresIn: '7d' });

        console.log("here2");
        console.log(refreshToken);
        console.log("here3");

        // Store refresh token in HTTP-only secure cookie
        res.cookie('refreshToken', refreshToken, {
            // Set true in production (HTTPS)
            // sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).send({
            success: true,
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                number: user.contactnumber,
            },
            refreshToken
        });
    } catch (err) {
        console.error('Error in login controller:', err);
        res.status(500).send(
            {
                success: false,
                message: 'error in login controller',
            }
        );
    }
};

const profileController = async (req, res) => {
    try {
        // console.log("Profile hit");
        // console.log(req.body);
        const authHeader = req.body.headers.Authorization;
        // console.log(authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
        // console.log('come');

        const token = authHeader.split(" ")[1];
        //const token = req.cookie.token;
        // console.log(token);
        const secretKey = "HGFHGEADFT12678"; // Replace with your actual secret key

        // Decode token
        const decoded = JWT.verify(token, secretKey);
        const userId = decoded.id; // Assuming `id` is stored in the token

        // Fetch user from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Exclude sensitive data like password
        const { firstname, lastname, email, age, contactnumber, role, createdAt } = user;

        // Send user data as response
        res.json({
            firstname,
            lastname,
            email,
            age,
            contactnumber,
            role,
            createdAt,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        // console.log("Update profile hit");
        // console.log(req.body);
        // console.log(req.headers);
        const authHeader = req.headers.authorization; // Extract the token from the Authorization header

        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const token = authHeader.split(" ")[1];

        //const { firstName, lastName, age, contactNumber } = req.body;
        //console.log(token);
        const firstName = req.body.firstname;
        const lastName = req.body.lastname;
        const age = req.body.age;
        const contactNumber = req.body.contactnumber;

        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized access. Token missing.',
            });
        }

        // Decode the token to get the user ID

        const decoded = JWT.verify(token, 'HGFHGEADFT12678');


        // Find the user by ID
        const user = await usermodel.findById(decoded.id);


        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found.',
            });
        }

        // Update the user fields

        user.firstname = firstName || user.firstname;
        user.lastname = lastName || user.lastname;
        user.age = age || user.age;
        user.contactnumber = contactNumber || user.contactnumber;

        // Save the updated user
        const updatedUser = await user.save();

        // Return the updated user (excluding password)
        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            user: {
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                email: updatedUser.email,
                age: updatedUser.age,
                contactnumber: updatedUser.contactnumber,
            },
        });
    } catch (err) {
        console.error('Error in update profile controller:', err);
        res.status(500).send({
            success: false,
            message: 'Error updating profile.',
        });
    }
};

const changePassword = async (req, res) => {
    try {
        console.log("Change password request received");

        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // Verify token and extract user ID
        const decoded = JWT.verify(token, 'HGFHGEADFT12678');
        const userId = decoded.id;

        // Extract passwords from request body
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Fetch user from database
        const user = await usermodel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare current password with stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            console.log('incorrect');
            return res.status(200).json({ message: "Incorrect current password" });
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            console.log('format');
            return res.status(200).json({ message: "New password and confirm password do not match" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password in the database
        user.password = hashedPassword;
        await user.save();
        console.log('password changed')

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const provideItems = async (req, res) => {
    try {
        //console.log("Provide items hit");
        // console.log(req.body);
        // console.log(req.body.headers.Authorization);
        const authHeader = req.body.headers.Authorization;
        // console.log(authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
        const items = await Item.find();
        //console.log(items);
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const Item_ID = async (req, res) => {
    console.log("Item ID hit");
    const authHeader = req.body.headers.Authorization;
    // console.log(authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization token missing" });
    }
    const { id } = req.params;
    //console.log(id);
    const item = await Item.findById(id);
    //console.log(item);

    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
};

const sellItem = async (req, res) => {
    try {
        console.log("Sell item hit");
        // console.log(req.body);
        // console.log(req.headers);
        const name = req.body.itemName;
        const price = req.body.price;
        const description = req.body.description;
        const category = req.body.category;

        const authHeader = req.headers.authorization; // Extract the token from the Authorization header
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
        //console.log(authHeader);
        const token = authHeader.split(" ")[1];
        //console.log(token);
        const decoded = JWT.verify(token, 'HGFHGEADFT12678');
        // Find the user by ID
        const user = await usermodel.findById(decoded.id);
        const sellerid = decoded.id;


        const item = await new itemmodel({
            name,
            price,
            description,
            category,
            sellerId: sellerid,
        }).save();

        res.status(201).send({
            success: true,
            message: 'User registered successfully'
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const sellerDetails = async (req, res) => {
    try {
        console.log("Seller details hit");
        //console.log(req.body);
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
        const sell = req.body.sell;
        const user = await usermodel.findById(sell);
        // const sellerid = decoded.id;

        // const items = await Item.find({ sellerId: sellerid });
        // //console.log(items);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// const jwt = require('jsonwebtoken'); // Ensure you have this package installed

// Adjust the path to your Cart model

const Addtocart = async (req, res) => {
    try {
        console.log("Add to cart hit");
        const { itemId, name, quantity, price } = req.body;
        console.log(req.body);
        const item = await itemmodel.findById(req.body.itemId);
        console.log(item);

        const sellerId = item.sellerId;

        // const itemID  = ObjectId(itemId);
        const authHeader = req.headers.authorization; // Extract the token from the Authorization header
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = JWT.verify(token, 'HGFHGEADFT12678');

        console.log(decoded.id);
        console.log(sellerId);

        if (decoded.id === sellerId) {
            return res.status(200).json({ message: "Seller and buyer of an item cannot be the same." });
        }

        // Find and update the user's cart
        const user = await usermodel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const existingItemIndex = user.itemsInCart.findIndex(item => item.itemId.toString() === itemId);

        if (existingItemIndex !== -1) {
            // If the item exists, increment its quantity
            user.itemsInCart[existingItemIndex].quantity += quantity;
        } else {
            // If the item does not exist, add it to the cart
            user.itemsInCart.push({ itemId: itemId });
        }

        await user.save();
        // Use `findByIdAndUpdate` to update the cart
        // await usermodel.findByIdAndUpdate(
        //     decoded.id,
        //     { itemsInCart: user.itemsInCart }, // Update the itemsInCart field
        //     { new: true, runValidators: true } // Return the updated document and run validation
        // );

        res.status(200).json({ message: 'Item added to cart successfully.', cart: user.itemsInCart });
    } catch (err) {
        console.error("Error during add-to-cart:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const retriveFromCart = async (req, res) => {
    try {
        //console.log("Retrive from cart hit");

        // console.log(req.body);

        const authHeader = req.body.headers.Authorization; // Extract the token from the Authorization header
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
        // console.log(authHeader);
        const token = authHeader.split(" ")[1];
        const decoded = JWT.verify(token, 'HGFHGEADFT12678');

        // Find the user's cart
        const user = await usermodel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const itemsInCart = user.itemsInCart;

        // give code such that itemsInCart is looped and items information if fetched from itemmodel
        // console.log(itemsInCart);

        const cartDetails = [];

        // Loop through itemsInCart and fetch item details
        for (const cartItem of itemsInCart) {
            const item = await itemmodel.findById(cartItem.itemId);
            if (item) {
                cartDetails.push({
                    itemId: item._id,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    category: item.category,
                    sellerId: item.sellerId
                });
            }
        }

        //console.log(cartDetails);

        res.status(200).json({ cart: cartDetails });


    } catch (err) {
        console.error("Error during retrive-from-cart:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const removeFromCart = async (req, res) => {
    try {
        // console.log("Remove from cart hit");

        // console.log(req.body);

        // console.log(req.params);
        const itemId = req.params.id;

        // console.log(itemId);

        const authHeader = req.body.headers.Authorization; // Extract the token from the Authorization header
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
        // console.log(authHeader);
        const token = authHeader.split(" ")[1];
        const decoded = JWT.verify(token, 'HGFHGEADFT12678');

        // Find the user's cart
        const user = await usermodel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Remove the item from the cart
        user.itemsInCart = user.itemsInCart.filter(item => item.itemId.toString() !== itemId);

        // console.log(user.itemsInCart);

        await user.save();

        res.status(200).json({ message: 'Item removed from cart successfully.', cart: user.itemsInCart });
    } catch (err) {
        console.error("Error during remove-from-cart:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}


const placeorder = async (req, res) => {
    try {
        console.log('In place order');

        const { itemIds } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Authorization header missing' });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = JWT.verify(token, 'HGFHGEADFT12678');
        } catch (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }

        console.log('Decoded:');

        const buyerId = decoded.id;
        let totalAmount = 0;
        let sellerId;

        const otp = crypto.randomInt(499999, 999999).toString();

        // Hash the OTP before storing
        const hashedOtp = await bcrypt.hash(otp, 10);

        for (const itemId of itemIds) {
            const item = await itemmodel.findById(itemId);
            if (!item) {
                return res.status(404).json({ success: false, message: `Item not found: ${itemId}` });
            }

            sellerId = item.sellerId;
            if (sellerId !== item.sellerId.toString()) {
                return res.status(400).json({ success: false, message: 'All items must belong to the same seller' });
            }

            if (buyerId === item.sellerId.toString()) {
                return res.status(400).json({ success: false, message: 'Cannot buy your own item' });
            }

            totalAmount += item.price;



            const order = new ordermodel({
                buyerId,
                sellerId,
                amount: item.price,
                hashedOTP: hashedOtp,
                items: [{ itemId }],
                status: 'pending',
            });

            console.log('Order:', order);

            await order.save();
        }

        // Clear the items in the cart for the user
        await User.findByIdAndUpdate(buyerId, { $set: { itemsInCart: [] } });

        console.log('Orders placed successfully');

        res.status(201).json({
            success: true,
            message: 'Orders placed successfully',
            otp: otp,
        });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const listorders = async (req, res) => {
    try {
        console.log("In list orders");

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT Token
        let decoded;
        try {
            decoded = JWT.verify(token, "HGFHGEADFT12678");
        } catch (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token" });
        }

        console.log("Decoded:", decoded);

        const { type } = req.body; // Get order type from request body

        let query = {};
        if (type === "bought") {
            query = { buyerId: decoded.id, status: "completed" };
        } else if (type === "sold") {
            query = { sellerId: decoded.id };
        } else if (type === "pending") {
            query = { buyerId: decoded.id, status: { $in: ["pending", "Cancelled"] } };
        } else {
            return res.status(400).json({ success: false, message: "Invalid order type" });
        }

        // Fetch orders
        const orders = await ordermodel.find(query);

        if (!orders.length) {
            return res.status(200).json({ success: true, orders: [] });
        }

        // Fetch seller, buyer, and item details using findById
        const updatedOrders = await Promise.all(
            orders.map(async (order) => {
                const seller = await usermodel.findById(order.sellerId, "name email"); // Fetch seller details
                const buyer = await usermodel.findById(order.buyerId, "name email"); // Fetch buyer details
                const items = await Promise.all(
                    order.items.map(async (item) => {
                        const itemDetails = await itemmodel.findById(item.itemId, "name price"); // Fetch item details
                        return { ...item._doc, itemId: itemDetails };
                    })
                );
                return { ...order._doc, sellerId: seller, buyerId: buyer, items }; // Include buyer details
            })
        );

        console.log(`${type} Orders:`, updatedOrders);

        return res.status(200).json({
            success: true,
            orders: updatedOrders,
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


const listselling = async (req, res) => {
    try {
        console.log("In list orders");

        const authHeader = req.body.headers.Authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT Token
        let decoded;
        try {
            decoded = JWT.verify(token, "HGFHGEADFT12678");
        } catch (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token" });
        }

        // console.log("Decoded:", decoded);

        const orders = await ordermodel.find({ sellerId: decoded.id, status: "pending" });

        if (!orders.length) {
            return { success: true, orders: [] };
        }

        // Fetch buyer and item details
        const formattedOrders = await Promise.all(
            orders.map(async (order) => {
                const buyer = await usermodel.findById(order.buyerId);
                //console.log("Buyer:", buyer);
                const items = await Promise.all(
                    order.items.map(async (item) => {
                        const itemDetails = await itemmodel.findById(item.itemId, "name price");
                        return {
                            orderId: order._id,
                            name: itemDetails?.name || "Unknown",
                            price: itemDetails?.price || 0,
                            buyerName: buyer?.lastname || "Unknown",
                            buyerContact: buyer?.contactnumber || "Unknown"
                        };
                    })
                );
                return items;
            })
        );

        console.log("Formatted Orders:", formattedOrders.flat());

        return res.status(200).json({ success: true, orders: formattedOrders.flat() });

    } catch (error) {
        console.error("Error fetching seller orders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const closeOrder = async (req, res) => {
    try {
        console.log("In close order");
        const { otp } = req.body;
        const orderId = req.params.id;
        console.log(req.params);
        // console.log(req.body.headers);
        // console.log(req.headers.Authorization);
        //console.log(req.headers);
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Authorization header missing" });
        }

        console.log("Closing order:", orderId);
        console.log("OTP:", otp);

        if (!otp) {
            return res.status(400).json({ success: false, message: "OTP is required" });
        }

        // Fetch the order by ID
        const order = await ordermodel.findById(orderId);

        console.log("Order:", order);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }



        // Verify the OTP using bcrypt
        const isOtpValid = await bcrypt.compare(otp, order.hashedOTP);

        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: "Incorrect OTP" });
        }

        // Update order status to "completed"
        order.status = "completed";
        await order.save();

        return res.status(200).json({ success: true, message: "Order completed successfully" });

    } catch (error) {
        console.error("Error closing order:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const cancelOrder = async (req, res) => {
    try {
        console.log('cancelOrder');
        const { orderId } = req.body;

        console.log(orderId);
        // console.log(req.headers);

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Authorization header missing" });
        }

        // Check if orderId is provided
        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required." });
        }

        // Find the order by ID
        const order = await ordermodel.findById(orderId);

        console.log(order);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        // Update order status to "Cancelled"
        order.status = "Cancelled";
        console.log(order);
        await order.save();

        return res.status(200).json({ success: true, message: "Order cancelled successfully." });
    } catch (error) {
        console.error("Error canceling order:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyCod_CarhO57rXCBHqEYTitw_Y2a7YgHzc');
const sessionChats = {};

const chatbot = async (req, res) => {
    try {
        console.log('here');

        const { sessionId, message } = req.body;

        if (!sessionChats[sessionId]) {
            sessionChats[sessionId] = [];
        }

        // Include previous messages for context
        sessionChats[sessionId].push({ role: 'user', message });

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const chatHistory = sessionChats[sessionId].map(msg => msg.message).join("\n");
        const response = await model.generateContent(chatHistory);

        const botMessage = response.response.text();

        sessionChats[sessionId].push({ role: 'bot', message: botMessage });

        res.json({ reply: botMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing chatbot response' });
    }
}

export { registerController, loginController, profileController, updateProfile, provideItems, Item_ID, sellItem, sellerDetails, Addtocart, retriveFromCart, removeFromCart, placeorder, listorders, listselling, closeOrder, changePassword, cancelOrder, chatbot };
