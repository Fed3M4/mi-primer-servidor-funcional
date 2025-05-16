const fs = require('fs')
const crypto = require('crypto')

class UserManager{
    constructor(){
        this.path = './users.json'
    }

    viewUsers = async () => {
        try {
            const usersJSON = await fs.promises.readFile(this.path, 'utf-8');
            const users = JSON.parse(usersJSON)
            return users
        } catch (error) {
            return []
        }
    }

    generateId = async () => {
        try {
            const users = await this.viewUsers(); // Lee los usuarios del archivo de manera asincrónica
            const lastUser = users[users.length - 1]; // Selecciona el último usuario
            if(users.length === 0){
                return 1
            } else {
                lastUser.id = lastUser.id + 1
                return lastUser.id
            }
        } catch (error) {
            console.error('Error al intentar generar un nuevo ID', error);
        }
    };    
    createUser = async newUser => {
        try {
            const users = await this.viewUsers()
            newUser.id = await this.generateId()
            const salt = crypto.randomBytes(128).toString('base64');
            const password = crypto.createHmac('sha256', salt).update(newUser.password).digest('hex');
            newUser.contrasenia = password;
            newUser.salt = salt
            users.push(newUser)
            await fs.promises.writeFile(this.path, JSON.stringify(users, null, '\t'), 'utf-8')
            return newUser
        } catch (error) {
            console.error('Error al crear nuevo usuario')
        }
    }
    validateUser = async(username, password) => {
        try {
            const users = await this.viewUsers();
            const userIdx = users.findIndex(user => username === user.username);
            if(userIdx === -1) {
                return 'User no encontrado'
            }
            const user = users[userIdx];
            const newHas = crypto.createHmac('sha256', user.salt).update(password).digest('hex');
            if (newHas !== user.contrasenia) {
                return 'No coincide'
            }
            return 'Correcto'
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = UserManager

// const um = new UserManager('./users.json');
// um.createUser({
//     firstName: 'ricardo',
//     lastName: 'lapalma',
//     username: 'cruda214',
//     password: 'pesitos'}
// )
// um.validateUser('cruda214','pesitos').then(users =>console.log(users))

// (async () => {
//     await createUser('Facundo', 'González', 25, 'JavaScript avanzado');
//     await addUser('Leandro', 'Chayanne', 56, 'JavaScript avanzado')
//     await viewUsers(); // Visualizamos los usuarios después de crearlos
// })();