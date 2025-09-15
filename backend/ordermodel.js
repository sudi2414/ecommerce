import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    buyerId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    hashedOTP: {
        type: String,
        required: true
    },
    items: [
        {
            itemId: {
                type: String,
                required: true
            }
        }

    ],
    status: {
        type: String,
        default: 'pending'
    },
});

// const Order = mongoose.model('Order', orderSchema);

export default mongoose.model('Order', orderSchema);
