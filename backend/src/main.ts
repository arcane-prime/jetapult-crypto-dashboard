import { connectDB } from "./helpers/connect-db.js";
import { startServer } from "./server.js";
import { initializeData, schedulePeriodicRefresh } from "./services/data-refresh.service.js";

await connectDB();
await initializeData();
await startServer();
schedulePeriodicRefresh();
