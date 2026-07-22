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

        const newUser = new userModel({ username, email, password: hashedPassword });
        await newUser.save();

        const accessToken = jsonwebtoken.sign({ id: newUser._id }, config.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken.sign({ id: newUser._id }, config.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict',expires: 7*24*60*60*1000 });


        res.status(201).json({ message: 'User registered successfully', accessToken,});
};

 export async function getMe(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jsonwebtoken.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const decoded = jsonwebtoken.verify(refreshToken, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newAccessToken = jsonwebtoken.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '15m' });
        res.status(200).json({ accessToken: newAccessToken });
        const newRefreshToken = jsonwebtoken.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict',expires: 7*24*60*60*1000 });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};
