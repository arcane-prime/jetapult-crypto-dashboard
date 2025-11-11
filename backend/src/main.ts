import { connectDB } from "./database/connect-db.js";
import { refreshCryptoCurrencies, refreshCryptoHistoricData } from "./providers/crypto-provider.js";

await connectDB();

console.log('starting the application');

// setInterval(() => {
//     refreshCryptoCurrencies();
// }, 10000);

setInterval(() => { 
    refreshCryptoHistoricData();
}, 10000);