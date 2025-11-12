import { connectDB } from "./helpers/connect-db.js";
import { startServer } from "./server.js";
import { refreshCryptoCurrencies, refreshCryptoHistoricData } from "./providers/coingecko-provider.js";
import cron from "node-cron";

await connectDB();
await startServer();

// Schedule to run every 2 hours (at minute 0 of every 2nd hour)
cron.schedule("0 */2 * * *", async () => {
  await refreshCryptoData();
});

await refreshCryptoData();


async function refreshCryptoData() {
    try {
      console.log("[Cron] Starting crypto data refresh...");
      await refreshCryptoCurrencies();
      await refreshCryptoHistoricData();
      console.log("[Cron] Crypto data refresh completed successfully");
    } catch (error) {
      console.error("[Cron] Error refreshing crypto data:", error);
    }
  }
  