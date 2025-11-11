import { connectDB } from "./helpers/connect-db.js";
import { startServer } from "./server.js";
import { refreshCryptoCurrencies, refreshCryptoHistoricData } from "./providers/coingecko-provider.js";

await connectDB();
await startServer();



await refreshCryptoCurrencies();
await refreshCryptoHistoricData();