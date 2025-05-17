const { Router } = require("express");
const ProductManager = require("../productManager");

const viewsRouter = Router();
const pm = new ProductManager();

viewsRouter.get("/login", async (req, res) => {
  res.render("login", {
    style: "login.css",
  });
});

viewsRouter.get("/home", async (req, res) => {
  try {
    const products = await pm.getProducts();
    if (products === undefined) res.send("No hay articulos para mostrar");
    res.render("home", { style: "general.css", products });
  } catch (error) {
    console.error(error);
  }
});

viewsRouter.get('/chat', async(req, res)=> {
  try {
    res.render('chat', {
      style: 'chat.css',
      title: 'Chat'
    })
  } catch (error) {
    
  }
})

module.exports = viewsRouter;
