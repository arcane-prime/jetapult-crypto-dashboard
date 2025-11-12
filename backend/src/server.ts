import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import routes from './routes/index.js';
import './config/passport.js'; // Import passport config to register strategies

dotenv.config();

export async function createServer() { 
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    
    // Initialize passport
    app.use(passport.initialize());

    // Setup routes
    app.use('/', routes);

    return app;
}

export async function startServer() { 
    const server = await createServer();
    server.listen(process.env.PORT || 4000, () => {
        console.log('Server is running on port 4000');
    });
}