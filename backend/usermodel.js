import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contactnumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    itemsInCart: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Item' // Reference to an Item model (if defined)
            }
        }
    ],
    // sellerReviews: [
    //     {
    //         reviewer: {
    //             type: String,
    //             required: true
    //         },
    //         reviewText: {
    //             type: String,
    //             required: true
    //         },
    //         rating: {
    //             type: Number,
    //             required: true,
    //             min: 1,
    //             max: 5 // Ratings should be between 1 and 5
    //         },
    //         createdAt: {
    //             type: Date,
    //             default: Date.now
    //         }
    //     }
    // ]
});

const User = mongoose.model('users', userSchema);

export default mongoose.model('users', userSchema);

// module.exports = User;