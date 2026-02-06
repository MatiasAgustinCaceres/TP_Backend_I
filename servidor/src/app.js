const express = require("express");

const app = express();

app.listen(8080, ()=> {
    console.log("Hola Mundo desde el puerto 8080")
});