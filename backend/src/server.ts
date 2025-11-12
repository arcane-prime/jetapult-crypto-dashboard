import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getTopNCryptosFromDB, getCryptoHistoricDataFromDB, searchQueryFromDB, getClosingPricesMarketCapFromDB } from './providers/db-provider.js';

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
            const days = paramsObject.days ? parseInt(paramsObject.days as string) : 30;
            const closingPricesMarketCap = await getClosingPricesMarketCapFromDB(id, days);
            res.json(closingPricesMarketCap);
        } catch (err) {
            console.error('Error getting closing prices and market cap:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/crypto/search', async (req, res) => {
        try {
            const paramsObject = req.query;
            const query = paramsObject.query as string;
            console.log('query', query);
            const searchResult = await searchQueryFromDB(query);
            res.json(searchResult);
        } catch (err) {
            console.error('Error searching crypto currencies:', err);
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