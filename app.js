require('dotenv').config();
require('express-async-errors');
const express = require('express');

const frontEndDomain = 'https://jobio-seven.vercel.app';
const backendDomain = 'https://jobio-production.up.railway.app';

//swagger
const { swaggerUi, swaggerDocument } = require('./swagger');

const app = express();

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//security packages
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const connectDB = require('./db/connect');

//including the routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

const { authenticate } = require('./middleware/authentication');

//including error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);

const appLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'Too many requests from this IP. Please, try again in 15 minutes',
    validate: {
        trustProxy: 'acknowledged', // 🔥 Must be set if trust proxy is true
    },
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'Too many requests from this IP. Please, try again in 15 minutes',
    validate: {
        trustProxy: 'acknowledged', // 🔥 Must be set if trust proxy is true
    },
});

// This allows the front-end to send a request to the back-end on the same localhost with different ports
app.use(
    cors({
        origin: frontEndDomain, // this must match exactly
    })
);

app.use(helmet());
app.use(xss());

app.use(express.json()); //To allow req.body in the request
// extra packages

// routes
app.get('/api/v1', (req, res) => {
    res.send(`jobs api\n<h1><a href=${backendDomain}/api-docs>Documentation</h1>`);
});

app.use('/api/v1/auth', loginLimiter, authRouter);
app.use('/api/v1/jobs', appLimiter, authenticate, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

connectDB(process.env.MONGO_URI)
    .then(console.log('Connected to DB...'))
    .catch((err) => console.log(err));

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
        console.log(`Swagger UI available at ${backendDomain}/api-docs`);
    } catch (error) {
        console.log(error);
    }
};

start();
