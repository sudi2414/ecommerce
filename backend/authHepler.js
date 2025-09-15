import bcrypt, { compare } from 'bcrypt';

const hashPassword = async (password) => {
    try{
        return await bcrypt.hash(password, 10);
    }
    catch(err){
        console.error('Error hashing password:', err);
    }
};

const comparePassword = async (password, hashedPassword) => {
    try{
        return bcrypt.compare(password, hashedPassword);
    }
    catch(err){
        console.error('Error comparing password:', err);
    }
};

export  { hashPassword , comparePassword };