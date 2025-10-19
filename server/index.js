import app from "./server.js";
import db from "./config/db.js";
import env from "./config/env.js";

(async function () {
  const PORT = app.get("port");

  await db();
  app.listen(PORT, () => {
    if (env.IS_DEV) {
      console.log(`Server is running at http://localhost:${PORT}/api/health`);
    } else {
      console.log(`Server is running at ${env.SERVER_URL}/api/health`);
    }
  });
})();
