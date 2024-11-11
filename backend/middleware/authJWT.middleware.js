import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    console.log(`Request Headers:`, req.header)

    const authHeader = req.header('Authorization'); //.replace('Bearer ', ''); //changing header ***
    console.log('Authorization Header:', authHeader);

    if(!authHeader){
        return res.status(401).send('Access denied. No token provided.');
    }

    const parts = authHeader.split(' ');
    if(parts.length !== 2){
        return res.status(401).json({message: 'Authorisation header format must be bearer token'})
    }

    const token = parts[1];
    console.log('Token:', token);

    if(!token){
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decodedAuth = jwt.verify(token, JWT_SECRET);
        console.log('Decoded:', decodedAuth)
        req.user = decodedAuth.user;
        next();
        
    } catch (error) {
        console.error('Token verification failed:', error);
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({message:'Invalid token, Access Denied'});
        }
        else if (err.name === 'TokenExpiredError', error){
            return res.status(401).json({messsage:'Token has expired, Access Denied'});
        }
        res.status(500).json({message: 'Server error during authentication', error:error})
    }
};

export default authMiddleware;