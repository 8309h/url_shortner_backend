const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.get("/allusers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.post("/newtoken", userController.newtoken);
userRouter.get('/logout', userController.logout);
userRouter.delete("/delete/:id", userController.deleteUser);
userRouter.patch("/updateName", userController.updateName);
userRouter.patch("/updatePassword/:id", userController.updatePassword);

module.exports = userRouter;

