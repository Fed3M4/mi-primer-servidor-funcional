const { Router } = require("express");
const UserManager = require("../userManager");

const router = Router();
const um = new UserManager();
// const midduno = (req, res, next) => {
//     req.apellido = 'Nuñez';
//     console.log(req.apellido)
//     next()
// } //los middlewares se ponen en el endopoint sin ejecutar

// const middos = (req, res, next) => {
//     req.role = 'admin';
//     if(req.role === 'admin'){
//         next()
//     }
//     res.send('Este usuario no es admin')
// }
router.get("/", async (req, res) => {
    const { gender } = req.query;
    const agent = {
      name: "Agustina",
      lastName: "Defrance",
      role: "admin",
    };
    if (!gender || (gender !== "Masculino" && gender !== "Femenino")) return res.render('userGender', {usersFiltered: await um.viewUsers(), isAdmin: agent.role==='admin', style: 'users.css'}); //aca es importante poner el return por que si no lo pongo va a leer los 2 res.send y se va a buggear la app
    const users = await um.viewUsers();
    const usersFiltered = users.filter((g) => g.gender === gender);
    console.log(await um.viewUsers() )

    res.render('userGender', {
      usersFiltered:usersFiltered,
      isAdmin: agent.role==='admin',
      style: 'users.css'
    })
});
router.get("/:uid", async(req, res) => {
  const { uid } = req.params;
  const users = await um.viewUsers()
  const user = users.find((u) => u.id === parseInt(uid));
  console.log(typeof user);
  res.render("users", {user, style: 'users.css'});
  // res.send(`El nombre del usuario es ${user.nombre} con apellido ${user.apellido} y tiene genero ${user.genero}`)
});
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, gender, userName, email, password } = req.body;
    const usersFiltered = await um.createUser({
      firstName,
      lastName,
      gender,
      userName,
      email,
      password,
    });
    console.log(typeof usersFiltered);
    res.status(200).send({ status: "success", payload: usersFiltered });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
