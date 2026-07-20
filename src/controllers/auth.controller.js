import userModel from '../models/user.model.js';
import config from '../config/config.js';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';



export async function registerUser(req, res) {
    
        const { username, email, password } = req.body;

        const isAlreadyRegistered = await userModel.findOne({  
            $or: [{ username }, { email }, { password }]
        });
        if (isAlreadyRegistered) {
            return res.status(400).json({ message: 'User already registered' });
        };

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');


        const newUser = await new userModel({ username, email, password: hashedPassword });
        const token  = jsonwebtoken.sign({ id: newUser._id }, config.JWT_SECRET, { expiresIn: '1h' }); 
        res.status(201).json({ message: 'User registered successfully', token });
};