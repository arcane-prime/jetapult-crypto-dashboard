import express from 'express';
import { 
  getTopNCryptosFromDB, 
  getCryptoHistoricDataFromDB, 
  searchQueryFromDB, 
  getClosingPricesMarketCapFromDB 
} from '../services/crypto.service.js';

const router = express.Router();

router.get('/top', async (req, res) => {
  try {
    const topN = parseInt(req.query.topN as string) || 10;
    if (topN < 1 || topN > 10) {
      return res.status(400).json({ error: 'Top N must be between 1 and 10' });
    }
    const cryptoCurrencies = await getTopNCryptosFromDB(topN);
    res.json(cryptoCurrencies);
  } catch (err) {
    console.error('Error getting top n crypto currencies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/historic', async (req, res) => {
  try {
    const id = req.query.id as string;
    const cryptoHistoricData = await getCryptoHistoricDataFromDB(id);
    res.json(cryptoHistoricData);
  } catch (err) {
    console.error('Error getting crypto historic data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/closing-prices-market-cap', async (req, res) => {
  try {
    const id = req.query.id as string;
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const closingPricesMarketCap = await getClosingPricesMarketCapFromDB(id, days);
    res.json(closingPricesMarketCap);
  } catch (err) {
    console.error('Error getting closing prices and market cap:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = req.query.query as string;
    const searchResult = await searchQueryFromDB(query);
    res.json(searchResult);
  } catch (err) {
    console.error('Error searching crypto currencies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

