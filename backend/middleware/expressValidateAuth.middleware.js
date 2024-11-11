import { body } from 'express-validator';

export const registerValidate = [
    body('name').trim().escape().matches(/^[a-zA-Z0-9_]{5,20}$/)
        .withMessage('Username must be 5-20 characters and can only contain letters, numbers, and underscores.'),
    body('idNum').trim().matches(/^[0-9]{13}$/)
        .withMessage('Please provide a valid South African ID number'),
    body('accountNum').trim().escape().matches(/^[0-9]{2,10}$/)
        .withMessage('Please provide a valid account number'),
    body('email').trim().isEmail().normalizeEmail()
        .withMessage('Please enter a valid email address.'),
    body('password').trim().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
        .withMessage('Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'),
   
]


export const loginValidate = [
    body('name').trim().escape().matches(/^[a-zA-Z0-9_]{5,20}$/).withMessage('Username is required and must be alphanumeric.'),
    body('accountNum').trim().escape().matches(/^[0-9]{2,10}$/),
    body('password').notEmpty().withMessage('Password is required'),
]

