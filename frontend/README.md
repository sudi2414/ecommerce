##  Tech Stack
- **Frontend:** React.js (Tailwind and Normal CSS for styling)
- **Backend:** Express.js
- **Database:** MongoDB
- **Server Runtime:** Node.js
- **Authentication:** JWT (jsonwebtoken) & js-cookies & bcrypt.js for password hashing

##  Features

### **Authentication & User Management**
- User Registration (**Only IIIT email allowed**)
- Page Redirections using cookies
- Secure login with JWT authentication
- Users remain logged in unless they log out
- Password hashing using **bcrypt.js**

### **Profile Page**
- Change Password Option
- User can edit his basic details like Name,Age

###  **Item Management**
- Users can add items to sell in the website under different categories
- Add-to-cart option to add item to user Cart
- Each Item with unique page and Item details page has seller information
- Buyers can search and filter items
- User can't add his own items to cart
- An item can be added to cart only once

###  **Orders & Transactions**
- Users can also see **pending and cancelled orders**
- Users can track **bought and sold items**
- Seller can also reject orders
- Sellers see a **"Deliver Items"** page with **OTP-based order confirmation**

###  **Shopping Cart**
- Items can be added or removed from the cart
- **Final Order button** for checkout
- Displays OTP after placing succesful order.
- Displays total cost
- Successful orders reflect in the **Deliver Items** and **Orders History** pages

###  **Chatbot Support**
- AI chatbot (Gemini) for answering user queries
- Chat UI with **session-based** responses

## Installation Guide
###  **Download the Zip**
```sh
   Download the Zip file and Extract it.
```

### **Front-End Setup**

```sh 
   npx create-vite@latest

   npm install axios buffer react react-dom react-google-recaptcha react-markdown react-router-dom

   npx tailwindcss init -p

   configure tailwind.config.js

   /** @type {import('tailwindcss').Config} */
    export default {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: {
            extend: {},
        },
        plugins: [],
    }
    npm run dev
```

### **Back-End Setup**

```sh
   npm init -y

   npm install @google/generative-ai axios bcrypt bcryptjs bottleneck cookie-parser cors 

   npm dotenv express jsonwebtoken mongoose mongoose-aggregate-paginate-v2 nodemon

   npm run start
```   