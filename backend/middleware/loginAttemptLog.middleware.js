import LoginAttempt from '../models/loginAttempt.model.js';

const LoginAttemptLogger = async (req, res, next) => {
    // Store the original res.json function
    const originalJson = res.json.bind(res); 

    res.json = function (data) {
        // Get the account number and IP address from the request
        const login = req.body.accNum;
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

        // Determine if the login attempt was successful
        const successfulLogin = !data.message || data.message !== 'Incorrect credentials';

        // Create a new login attempt log
        LoginAttempt.create({ login, ipAddress, successfulLogin })
            .catch(err => console.log('Error Log - login attempt:', err));

        // Call the original res.json function with the provided data
        originalJson(data); // Call the original function directly
    };

    // Call the next middleware
    next();
};

export default LoginAttemptLogger;