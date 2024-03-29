import { promises as fs } from "fs"
import { nanoid } from "nanoid";

class ProductManager {
    constructor() {
        this.path = "./src/models/products.json"
    }

    exist = async (id) => {
        let products = await this.readProducts();
        return products.find(prod => prod.id === id)
    }

    readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8")
        return JSON.parse(products)
    }

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product))
    }

    addProducts = async (product) => {
        let productsOld = await this.readProducts();
        product.id = nanoid()
        let productALL = [...productsOld, product];
        await this.writeProducts(productALL);
        return "Producto Agregado";
    };

    getProducts = async () => {
        return await this.readProducts()
    };

    getProductsbyId = async (id) => {
        let productsById = await this.exist(id)
        if (!productsById) return "producto no encontrado"
        return productsById
    };

    updateProducts = async (id, product) => {
        let productsById = await this.exist(id)
        if (!productsById) return "producto no encontrado"
        await this.deleteProducts(id)
        let productsOld = await this.readProducts() 
        let products = [{ product, id: id }, ...productsOld]
        await this.writeProducts(products)
        return "producto actualizado"
    }



    deleteProducts = async (id) => {
        let products = await this.readProducts();
        let existProducts = products.some(prod => prod.id === id)
        if (existProducts) {
            let filterProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "producto eliminado"
        }

        return "producto a eliminar no inexistente"


    }

}

export default ProductManager



