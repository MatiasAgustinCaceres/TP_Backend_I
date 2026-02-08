const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());

// Ruta del archivo de persistencia
const productsPath = path.join(__dirname, "products.json");

const getProducts = async () => {
    if (!fs.existsSync(productsPath)) return [];
    const data = await fs.promises.readFile(productsPath, "utf-8");
    return JSON.parse(data);
};

const saveProducts = async (products) => {
    await fs.promises.writeFile(
        productsPath,
        JSON.stringify(products, null, 2)
    );
};

//RUTAS

app.get("/api/products", async (req, res) => {
    const products = await getProducts();
    res.json(products);
});

app.get("/api/products/:pid", async (req, res) => {
    const products = await getProducts();
    const product = products.find(p => p.id === req.params.pid);

    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
});

app.post("/api/products", async (req, res) => {
    const {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const products = await getProducts();

    const newProduct = {
        id: Date.now().toString(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);
    await saveProducts(products);

    res.status(201).json(newProduct);
});

app.put("/api/products/:pid", async (req, res) => {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === req.params.pid);

    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    products[index] = {
        ...products[index],
        ...req.body,
        id: products[index].id
    };

    await saveProducts(products);
    res.json(products[index]);
});

app.delete("/api/products/:pid", async (req, res) => {
    const products = await getProducts();
    const filteredProducts = products.filter(p => p.id !== req.params.pid);

    if (products.length === filteredProducts.length) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    await saveProducts(filteredProducts);
    res.json({ message: "Producto eliminado correctamente" });
});

//SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});