import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Cual es tu MONGODB URI: ", (URIMONGO) => {
  fs.writeFileSync(".env.local", `MONGODB_URI=${URIMONGO}\n`);
  console.log("Archivo .env.local creado con éxito");
  rl.close();
});