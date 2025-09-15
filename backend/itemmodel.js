import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    }
});

const Item = mongoose.model('items', itemSchema);

export default mongoose.model('items', itemSchema);

