// const { IAMMenuModel } = require("aloux-iam");
// const Permission = require('../models/Permission')
// const Function = require('../models/Functions.js')
// const User = require('../models/User.js')
// const bcrypt = require("bcryptjs")

const self = module.exports;

// self.loadDataTables =  async (req, res) => {
//     try {
//         // Crea menu IAM
//         const menu = new Menu({_id : "61b06de713a90b4d6dce7172", label: "IAM", url: "/app/IAM/user", icon: "mdi-cog", index:1})
//         menu.date = (new Date()).getTime()
//         menu.isActive = true
//         let menuItem = await Menu.updateMany({_id:menu._id}, menu, {upsert: true, setDefaultsOnInsert: true})

//         // Crea Permisos
//         let permissionsIDs = []
//         let permissions = [
//             {
//               _id:"61b06de713a90b4d6dce7173",
//               "name": "root",
//               "front": "iam.permission.propietario",
//               "api": "/",
//               "_menu": menuItem._id
//             },
//             {
//               _id:"61b06de713a90b4d6dce7174",
//               "name": "Ver todos los elementos de menú",
//               "front": "iam.menu.retrieve",
//               "api": "GET/v0/iam/menu",
//               "_menu": menuItem._id
//             },
//             {
//               _id:"61b06de813a90b4d6dce7175",
//               "name": "Crear elementos de menú",
//               "front": "iam.menu.create",
//               "api": "POST/v0/IAM/menu",
//               "_menu": menuItem._id
//             }
//           ]

//           for(let i in permissions){
//             const permission = new Permission(permissions[i])
//             permission.date = (new Date()).getTime()
//             permission.isActive = true
//             permissions[i] = await Permission.updateMany({_id:permission._id}, permission, {upsert: true, setDefaultsOnInsert: true} )
//             permissionsIDs.push(permission._id)
//           }

//           // Crea Function
//             const functions = new Function({  _id:"61b06de813a90b4d6dce7176", "_permission": permissionsIDs, "_menu": [ menu._id ],  "name": "Propietario", "description": "Todos los permisos" })
//             functions.date = (new Date()).getTime()
//             functions.isActive = true
//             let functionsItem = await Function.updateMany({_id:functions._id}, functions, {upsert: true, setDefaultsOnInsert: true} )
        
//             // Crear usuario
//           const user = new User({ _id: "61b06de813a90b4d6dce7177", "name": "Developer", "lastName": "Aloux", pwd: await bcrypt.hash("Cc12345", 8) ,  "email": "developer@aloux.mx", "phone": "5567087001", "_functions": [ functions._id ]  })
//           user.date = (new Date()).getTime()
//           user.isActive = true
//           let userItem = await User.updateMany({_id:user._id}, user, {upsert: true, setDefaultsOnInsert: true} ).lean()
    
//           res.status(201).send(user)
//         } catch (error) {
//             res.status(400).send({error:error.message})
//         }
// }

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

self.sleep = async (sleepTime) => {
  await timeout(sleepTime);
};