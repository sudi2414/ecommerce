import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './db.js';
import { registerController, loginController, profileController, updateProfile, provideItems, Item_ID, sellItem, sellerDetails, Addtocart, retriveFromCart, removeFromCart, placeorder, listorders, listselling, closeOrder, changePassword, cancelOrder ,chatbot} from './authRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// const cors = require('cors');

import { sortUserPlugins } from 'vite';

dotenv.config();

//const express = require('express');

connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());


//app.use(morgan('dev'));

app.use(cors());

// OR enable CORS for specific origin
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests only from this origin
  //   methods: ['GET', 'POST'],       // Specify allowed HTTP methods
  credentials: true               // Allow cookies and credentials
}));



// app.use('/api/auth', authRoute);

// const port = process.env.port || 3000;

app.get('/', (req, res) => {
  console.log("aba");
  res.send({
    message: 'Hello World!'
  });
});


app.post('/api/signup', registerController);

app.post('/api/login', loginController);

app.post('/api/profile', profileController);

app.post('/api/updateprofile', updateProfile);

app.post('/api/changepassword', changePassword);

app.post('/api/items', provideItems);

app.post('/api/item/:id', Item_ID);

app.post('/api/sellitem', sellItem);

app.post('/api/seller', sellerDetails);

app.post('/api/cart/add', Addtocart);

app.post('/api/cart/ret', retriveFromCart);

app.post('/api/cart/remove/:id', removeFromCart);

app.post('/api/order', placeorder);

app.post('/api/orderslist', listorders);

app.post('/api/orders/deliver', listselling);

app.post('/api/orders/close/:id', closeOrder);

app.post('/api/orders/cancel', cancelOrder);

app.post("/api/chatbot", chatbot);

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});

app.get('/about', (req, res) => {
  res.send('About page');
});

app.get('/contact', (req, res) => {
  res.send('Contact page');
});
