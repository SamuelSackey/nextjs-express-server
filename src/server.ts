import express from "express";
import next from "next";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
const nextApp = next({
  dev: process.env.NODE_ENV !== "production",
});
const nextHandler = nextApp.getRequestHandler();

const start = async () => {
  // forward routes from express to nextjs
  app.use((req, res) => nextHandler(req, res));

  // Think it runs when the next app finishes startup
  nextApp.prepare().then(() => {
    // initialize express server to listen on port
    app.listen(PORT, async () => {
      console.log(`\n   ▲ Next.js App`);
      console.log(`   - Port:    ${process.env.PORT}`);
      console.log(`   - App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}\n`);
    });
  });
};

start();
