const { Router } = require('express')
const UserManager = require('../userManager.js')
const ProductManager = require('../productManager.js')

const router = Router()
const um = new UserManager('./users.json')
const pm = new ProductManager();

router.get('/',async (req, res)=>{
    const { limit } = req.query;
    if(!limit) return res.send(await pm.getProducts());
    const products = await pm.getProducts()
    res.send(products.slice(0,parseInt(limit)))
});
router.get('/:pid', async (req, res) =>{
    const { pid } = req.params;
    res.send(await pm.getProductById(parseInt(pid)))
})

router.post('/', async(req, res) => {
    try {
        const product = req.body;
        console.log(product.stock)
        if(!product.title || !product.description || !product.price || !product.stock || !product.category) {
            return res.status(400).send({status:'error', error:'Falta ingresar datos'});
        }
        await pm.addProduct(product)
        console.log(await pm.getProducts())
        res.status(200).send({status: 'success', payload: product})
    } catch (error) {
        console.error('Hubo un error al intentar agregar el producto', error)
    }
})
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productToUpdate = req.body;
    await pm.updateProduct(parseInt(pid), productToUpdate)
    res.status(200).send({status: 'success', error: await pm.getProductById(parseInt(pid))})
})
router.delete('/:pid', async (req, res) =>{
    const { pid } = req.params;
    const productsA = await pm.getProducts().length
    const product = await pm.getProductById(parseInt(pid));
    await pm.deleteProduct(parseInt(pid));
    const productsB = await pm.getProducts().length
    if (productsA === productsB) return res.status(400).send({status:'error', payload:'No hay ningun producto con ese ID'});
    res.status(200).send({status: 'success', payload: product})
})

module.exports = router