const { Router } = require('express');
const CartManager = require('../cartManager')

const cm = new CartManager()
const cartRouter = Router();

cartRouter.get('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      console.log(cid)
      const cartByID = await cm.getCartByID(cid); // No es necesario usar parseInt, ya que cm.getCartByID lo maneja
      if (!cartByID) {
        return res.status(404).send({ status: 'error', payload: 'No hay un carrito con ese ID' });
      }
      return res.send({ status: 'success', payload: cartByID });
    } catch (error) {
      console.error("Error en GET /:cid:", error.message);
      return res.status(500).send({ status: 'error', payload: 'Hubo un error al buscar el carrito' });
    }
  });
  cartRouter.post('/', async (req, res) => {
    try {
      const products = [req.body];
      console.log(products) // Asegúrate de que el body incluya un array de productos
      if (!Array.isArray(products)) {
        return res.status(400).send({ status: 'error', payload: 'Debes incluir un array de productos válido' });
      }
  
      const newCart = await cm.createCart(products);
      return res.status(201).send({ status: 'success', payload: newCart });
    } catch (error) {
      console.error("Error en POST /:", error);
      return res.status(500).send({ status: 'error', payload: 'Hubo un error al crear el carrito' });
    }
  });

cartRouter.post('/:cid/product/:pid', async(req, res) =>{
    try {
        const {cid, pid}= req.params;
        const {quantity} = req.body
        const newCart = await cm.addProductToCart(cid, pid, quantity)
        // console.log(newCart)
        res.send(newCart)
    } catch (error) {
        console.error(error.message)
    }

    
})

module.exports = cartRouter