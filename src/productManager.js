const fs = require('fs');

class ProductManager {
    constructor () {
        this.path = './products.json';
        this.products;
    }

    generateId = async () => {
        try {
            // Lee los productos del archivo de manera asincrónica
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            // Obtén el último ID y genera uno nuevo
            const lastProduct = this.products[this.products.length - 1];
            const lastId = lastProduct ? lastProduct.id : 0; // Si no hay productos, inicia con 0
            return lastId + 1;
        } catch (error) {
            console.log('Error al leer los productos o archivo vacío, iniciando IDs desde 1.');
            return 1; // Si no hay archivo o productos, retorna 1 como primer ID
        }
    };

    generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Letras mayúsculas, minúsculas y números
        let randomCode = '';
        for (let i = 0; i < 15; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length); // Genera un índice aleatorio
            randomCode += characters[randomIndex]; // Añade el carácter correspondiente al código
        }
        return randomCode;
    }

    getProducts = async () => {
        try {
            this.products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            return this.products
        } catch (error) {
            console.log('No hay ningun stock de productos')
        }
    }

    addProduct = async (product) => {
        product.id = await this.generateId();
        product.code = this.generateRandomCode()
        product.status = true
        try {
            this.products = await this.getProducts();
            if(this.products == undefined){
                this.products = [product]
                await fs.promises.writeFile(this.path,JSON.stringify(this.products, null, 4))
                console.log(this.products)
            } else {
                this.products = await this.getProducts()
                this.products.push(product)
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 4))
                console.log("lista definitiva", this.products)
            }
        } catch (error) {
            console.error(error)
        }
    }

    getProductById = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            let productById = this.products.find(elemento => elemento.id === id);
            if(productById===undefined) {
                console.log('No existe un producto con ese ID')
                return 'No existe un producto con ese ID'
            } else {
                console.log(productById)
                return productById
            }

        } catch (error) {
            console.error('No existe el archivo de DB')
        }
    }

    updateProduct = async (id, updates) => {
        try {
            // Leer los productos actuales del archivo
            this.products = await this.getProducts();
            // Buscar el producto por id
            let productIndex = this.products.findIndex(p => p.id === id);
            if (productIndex === -1) {
                console.log(`Producto con id ${id} no encontrado.`);
                return res.status(400).send({status:'error', error:'No existe un producto con ese ID'});
            }
            // Asegurarse de que el id no se modifique
            const { id: _, ...camposActualizables } = updates; // Elimina el campo "id" si está en las actualizaciones
            // Lista de campos permitidos para actualizar
            const camposValidos = ["title", "description", "price", "thumbnail", "stock"];
            // Filtrar los campos válidos y asignar las actualizaciones
            Object.keys(camposActualizables).forEach(campo => {
                if (camposValidos.includes(campo)) {
                    this.products[productIndex][campo] = camposActualizables[campo];
                }
            })
            // Escribir los productos actualizados de vuelta al archivo
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 4));          
            console.log(`Producto actualizado:`, this.products[productIndex]);
            return this.products[productIndex];
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            return null;
        }
    }

    deleteProduct = async (id) => {
        try {
            // Leer los productos actuales del archivo
            this.products = await this.getProducts();
    
            // Buscar el índice del producto a eliminar
            const productIndex = this.products.findIndex(p => p.id === id);
    
            if (productIndex === -1) {
                console.log(`Producto con id ${id} no encontrado.`);
                return null;
            }
    
            // Eliminar el producto del array
            const productoEliminado = this.products.splice(productIndex, 1); // Eliminar 1 elemento en esa posición
    
            // Escribir los productos actualizados de vuelta al archivo
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 4));
    
            console.log(`Producto eliminado:`, productoEliminado[0]);
            return productoEliminado[0];
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            return null;
        }
    }
}

// let pm = new ProductManager;
// pm.getProducts();
// pm.addProduct("Zapas LECOQ", "TOTAL", 1100, "c/fotosLECOQ", 24);
// pm.getProductById(2342);
// pm.updateProduct(2, {title: "prueba de cambio de title"})
// pm.deleteProduct(2)

module.exports = ProductManager