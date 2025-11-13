import { refreshCryptoCurrencies, refreshCryptoHistoricData } from "./coingecko.service.js";
import { hasCryptoData } from "../repositories/crypto.repository.js";
import cron from "node-cron";

export async function initializeData() {
  const hasData = await hasCryptoData();
  
  if (!hasData) {
    console.log("📊 No data found in database. Fetching initial data from CoinGecko...");
    try {
      await refreshCryptoData();
      console.log("✅ Initial data fetch completed successfully!");
    } catch (error) {
      console.error("❌ Error fetching initial data:", error);
      console.log("⚠️  Server will start but may not have data. You can manually trigger data refresh.");
    }
  } else {
    console.log("✅ Database already has data. Skipping initial fetch.");
  }
}

export function schedulePeriodicRefresh() {
  cron.schedule("0 */2 * * *", async () => {
    console.log("[Cron] Starting scheduled crypto data refresh...");
    await refreshCryptoData();
  });
  console.log("🔄 Scheduled automatic data refresh every 2 hours");
}

async function refreshCryptoData() {
  try {
    console.log("🔄 Starting crypto data refresh...");
    await refreshCryptoCurrencies();
    await refreshCryptoHistoricData();
    console.log("✅ Crypto data refresh completed successfully");
  } catch (error) {
    console.error("❌ Error refreshing crypto data:", error);
  }
}

