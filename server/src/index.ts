import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import allowedOrigins from './configs/allowedOrigins.config.json';
import dotenv from 'dotenv';
dotenv.config({ path: "src/configs/.env" });
import connectDB from './configs/db.config';
import routes from './routes/index';
import trimMiddleware from './middleware/trimMiddleware';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';

// Express Server Setup
const app = express();
const port = process.env.PORT || 5999;
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const origins = allowedOrigins[env];

const corsOptions = {
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Express Middlewares
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.startsWith('/api/stripe/webhooks')) {
        express.raw({ type: 'application/json' })(req, res, next);
    } else {
        express.json()(req, res, next);
    }
});

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(trimMiddleware);
app.use('/static', express.static(path.join(__dirname, 'static')));

const DB = process.env.DB_URI || '';
connectDB(DB);

// Server status endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('Boilerplate Server is up!');
});

// Routes
app.use("/api", routes);

// Error Handler
app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log(`Node/Express Server is Up......\nPort: localhost:${port}`);
});
