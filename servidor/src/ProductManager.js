const fs = require("fs");
const path = require("path");

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, "products.json");
    }

    async getProducts() {
        if (!fs.existsSync(this.path)) {
            return [];
        }
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();

        const newProduct = {
            id: Date.now().toString(), // id autogenerado
            status: true,
            ...product
        };

        products.push(newProduct);
        await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, 2)
        );

        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return null;
        }

        products[index] = {
            ...products[index],
            ...updatedFields,
            id: products[index].id // el id no se modifica
        };

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, 2)
        );

        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(p => p.id !== id);

        if (products.length === filteredProducts.length) {
            return false;
        }

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(filteredProducts, null, 2)
        );

        return true;
    }
}

module.exports = ProductManager;