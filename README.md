## Mangalopolis, la red social de los otakus

Este proyecto para la clase de seguridad informatica del ciclo 2026-I utiliza NEXT.JS para una pagina web

El repositorio es publico, por lo que se puede clonar
Instalacion

```bash
git clone https://github.com/CesarEmiliano79/mangalopolis
cd mangalopolis
```

Una vez descargado el proyecto, iniciar el archivo start.js, para ingresar una clave de MongoDB y una firma para el JWT_SECRET

```bash
node start.js
```

## Puesta en produccion

Para poner en produccion ingresar los siguientes comandos

Para descargar dependencias

```bash
npm i
```

Para preparar el codigo

```bash
npm run build
```

Para mandar a produccion

```bash
npm run start
```

Una vez inicializado, se accede por http://localhost:3000 o con la ip asignada por NEXT.JS por el puerto 3000
