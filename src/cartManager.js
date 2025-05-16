const fs = require("fs");
const crypto = require("crypto"); // Para generar cartID único

class CartManager {
  constructor() {
    this.carts = [];
    this.path = "./carts.json";
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
      return this.carts;
    } catch (error) {
      console.warn(
        "No se pudo leer el archivo, devolviendo lista vacía.",
        error.message
      );
      return [];
    }
  }
  async createCart(products) {
    console.log(products);
    try {
      const cartID = crypto.randomUUID(); // Genera un cartID
      const cart = {
        id: cartID, // ID único del carrito
        products: products, // Array de productos
      };
      this.carts.push(cart); // Agrega el carrito a la lista de carritos
      const newCarts = JSON.stringify(this.carts, null, "\t");
      fs.promises.writeFile(this.path, newCarts, "utf-8");
      return cart; // Devuelve el carrito recién creado
    } catch (error) {
      console.error("No se pudo crear el carrito", error.message);
    }
  }
  // Método para agregar un producto a un carrito existente

  async getCartByID(id) {
    try {
      this.carts = await this.getCarts();
      const cartByID = this.carts.find((cart) => cart.id === id);
      // console.log(cartByID);
      if (!cartByID) {
        console.log("No hay ningun carrito con ese ID");
      }
      return cartByID;
    } catch (error) {
      console.error("Hubo un error al buscar el carrito", error.message);
    }
  }
  async addProductToCart(cartID, productID, quantity) {
    this.carts = await this.getCarts(); // Traes todos los carritos
    const cartIndex = this.carts.findIndex((cart) => cart.id === cartID); // Encuentras el índice del carrito
    if (cartIndex === -1) {
      return 'No hay un carrito con ese ID';
    }
    const cart = this.carts[cartIndex]; // Obtienes el carrito correspondiente
    // Busca el producto dentro del carrito
    const productoExistente = cart.products.find(product => parseInt(product.id) === parseInt(productID));
    if (productoExistente) {
      // Si el producto ya existe, actualiza la cantidad
      productoExistente.quantity = (parseInt(productoExistente.quantity) + parseInt(quantity)).toString();
    } else {
      // Si el producto no existe, lo agrega al array de productos
      cart.products.push({
        id: productID,
        quantity: quantity.toString(),
      });
    }
    // Actualiza el carrito dentro de `this.carts`
    this.carts[cartIndex] = cart;
    const updateCartsJSON = JSON.stringify(this.carts, null, "\t")
    await fs.promises.writeFile(this.path, updateCartsJSON, 'utf-8')
    // Retorna el carrito actualizado
    return cart;
    } catch (error) {
      console.error(error.messagge)
    }
  }

module.exports = CartManager;
