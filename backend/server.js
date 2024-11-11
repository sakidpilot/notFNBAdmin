import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '../backend/config/db.js';
import https from 'https';
import http from 'http';
import fs from 'fs';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import paymentRoute from "../backend/routes/payment.route.js";
import authRoute from "../backend/routes/auth.route.js";
import adminRoute from"../backend/routes/admin.route.js";
import rateLimit from "express-rate-limit";
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xssclean from "xss-clean";
import helmet from 'helmet';
import bodyParser from 'body-parser';


dotenv.config();

const PORT = process.env.PORT || 5000;

const URL = process.env.URL_HEADER;

const app = express();

connectDB();

console.log(process.env.MONGO_URI);

// Http security headers
app.use(helmet());

// Prevent clickjacking by setting the X-Frame-Options header
app.use(helmet.frameguard({ action: 'deny' }));

// Set Content Security Policy (CSP) to prevent clickjacking via embedding via iframes
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        frameAncestors: ["'none'"], // Disallow any source from embedding the site
    },
}));

// Limit body size payment payload
app.use(express.json({limit: "100kb"}));

app.use(bodyParser.json());

app.use(ExpressMongoSanitize()); // noSQL query injections

app.use(xssclean()); //xss 

app.use(cookieParser());

app.use(hpp()); //https params pollution

app.use(morgan('combined'));

app.use(
    cors({
      origin: "https://localhost:3000", //add client server portal host
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true, //
    })
);


// CORS configuration
app.use((reg, res, next) =>
 {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});


// Secure Cookies
app.use((req, res, next) => {
    res.cookie('secureCookie', 'encryptedData', {
        httpOnly: false, //
        secure: true,
        sameSite: 'Strict',
    });
    next();
});

// Force HTTPS
app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
});

// Rate Limiting
const limitRequest = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, //change back to 100 -> increased for debug
});
app.use(limitRequest);


app.use(URL, authRoute);

app.use(URL, paymentRoute);

app.use(URL, adminRoute);


// SSL Certificates
const sslOptions = {
    key: fs.readFileSync('backend/keys/privatekey.pem'),
    cert: fs.readFileSync('backend/keys/certificate.pem'),
};


https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Secure server running on port ${PORT}`);
});

// Redirect HTTP to HTTPS
const httpApp = express();
httpApp.use((req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
});

http.createServer(httpApp).listen(80, () => {
    console.log('HTTP server redirecting to HTTPS');
});


app.get("/api/test", (req,res) =>{
    console.log("Test");
    res.status(200).send({message: "working"});
})