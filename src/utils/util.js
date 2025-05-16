const multer = require('multer');
const path = require('path');

//definimos como se va a almacenar en mi computadora en el objeto de configuracion
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,path.join(__dirname, '/public/uploads'))
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const uploader = multer({storage})
module.exports = uploader