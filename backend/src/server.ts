import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getTopNCryptosFromDB, getCryptoHistoricDataFromDB } from './providers/db-provider.js';
import { getClosingPricesMarketCapFromDB } from './providers/db-provider.js';

dotenv.config();


export async function createServer() { 
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.get('/ping', (req, res) => { 
        res.send('pong');
    });

    app.get('/crypto/top', async (req, res) => { 
        try {
            const paramsObject = req.query;
            const topN = parseInt(paramsObject.topN as string) ?? 10;
            const cryptoCurrencies = await getTopNCryptosFromDB(topN);
            res.json(cryptoCurrencies);
        } catch (err) {
            console.error('Error getting top n crypto currencies:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/crypto/historic', async (req, res) => { 
        try {
            const paramsObject = req.query;
            const id = paramsObject.id as string;
            const cryptoHistoricData = await getCryptoHistoricDataFromDB(id);
            res.json(cryptoHistoricData);
        } catch (err) {
            console.error('Error getting crypto historic data:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/crypto/closing-prices-market-cap', async (req, res) => { 
        try {
            const paramsObject = req.query;
            const id = paramsObject.id as string;
            const closingPricesMarketCap = await getClosingPricesMarketCapFromDB(id);
            res.json(closingPricesMarketCap);
        } catch (err) {
            console.error('Error getting closing prices and market cap:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return app;
}

export async function startServer() { 
    const server = await createServer();
    server.listen(process.env.PORT || 4000, () => {
        console.log('Server is running on port 4000');
    });
}