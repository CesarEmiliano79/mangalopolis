import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Preguntar URI primero
rl.question("Cual es tu MONGODB URI: ", (URIMONGO) => {
  // Preguntar JWT_SECRET dentro del callback para que se haga después
  rl.question("Cual es tu JWT_SECRET: ", (JWTSECRET) => {
    // Escribir ambas variables en el archivo
    fs.writeFileSync(".env.local", `MONGODB_URI=${URIMONGO}\nJWT_SECRET=${JWTSECRET}\n`);
    console.log("Archivo .env.local creado con éxito");
    rl.close();
  });
});
