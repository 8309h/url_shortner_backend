// const userRouter = require("express").Router()
const {UserModel} = require("../models/userModel")
const bcrypt = require("bcrypt")
const blacklist = require("../models/blacklistModel")
// const authenticate = require("../middlewares/authentication")
const jwt = require("jsonwebtoken")
// const redisclient  = require('../configs/redis') ;


// Controller function for getting all users
async function getAllUsers(req, res) {
    try {
        const allUsersData = await UserModel.find({});
        res.json(allUsersData);
    } catch (error) {
        console.log(error);
        res.status(400).send({"msg": "Error in getting all users"});
    }
}

// Controller function for user signup
async function signup(req, res) {
    try {
        const {name, email, password} = req.body;
        const isUser = await UserModel.findOne({email});
        if (isUser) return res.send({msg: "User already present please login"});
        const hashedPass = bcrypt.hashSync(password, 5);
        const user = new UserModel({name, email, password: hashedPass});
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send({msg: "Error while registering"}, error);
    }
}

const tokenStore = {};

// Controller function for user login
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (!user) return res.status(404).json({ msg: "User not found" });

        const isCorrect = bcrypt.compareSync(password, user.password);
        if (!isCorrect) return res.status(400).json({ msg: "Wrong Credentials" });

        const normaltoken = jwt.sign({ userId: user._id }, process.env.normalkey, { expiresIn: "1h" });
        const refreshtoken = jwt.sign({ userId: user._id }, process.env.refreshkey, { expiresIn: "6h" });

        // Store tokens in memory
        tokenStore[user.email] = {normaltoken, refreshtoken };

        // Send tokens in response
        res.json({ msg: "Login Successful", normaltoken, refreshtoken,user});

        console.log(tokenStore)

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error while logging in" });
    }
}

// Controller function for generating new token
async function newtoken(req, res) {
    try {
        const { email } = req.body;

        // Check if user's email exists in token store
        if (!tokenStore[email]) {
            return res.status(401).json({ msg: "No token found for this user" });
        }

        // Generate new token for the user
        const newToken = jwt.sign({ userId: tokenStore[email].userId }, process.env.normalkey, { expiresIn: "1h" });
        
        // Update token in memory
        tokenStore[email].normaltoken = newToken;

        // Send new token in response
        res.status(200).json({ msg: "New token generated successfully", token: newToken });

    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Error while generating new token" });
    }
}

// Controller function for user logout
async function logout(req, res) {
    try {
        const { email } = req.body;

        // Check if user's email exists in token store
        if (!tokenStore[email]) {
            return res.status(401).json({ msg: "No token found for this user" });
        }

        // Remove tokens from memory
        delete tokenStore[email];

        // Send logout confirmation
        res.status(200).json({ msg: "Logout Successful" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error while logging out" });
    }
}

// Controller function for deleting a user
async function deleteUser(req, res) {
    const _id = req.params.id;
    try {
        const user = await UserModel.findByIdAndDelete({ _id });
        res.json({ "msg": "User deleted successfully"});
    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error in deleting "});
    }
}

// Controller function for updating user name
async function updateName(req, res) {
    const {name, email,password} = req.body;
    try {
        const data = await UserModel.findOne({ email });
        if (name) {
            data.name = name;
        }
        await data.save();
    } catch (error) {
        console.log(error);
        res.json({"msg": "Something wrong"});
    }
}

// Controller function for updating user password
async function updatePassword(req, res) {
    const _id = req.params.id;
    const {password} = req.body;
    try {
        bcrypt.hash(password, 5, async(err, hash) => {
            if(err){
                console.log(err);
                res.json({"error": err});
            }
            else{
                const updateData = await UserModel.findByIdAndUpdate({_id}, {password: hash});
                res.json({"msg":"Password Updated Successfully"});
            }
        });
    } catch (error) {
        res.json({"Error": error});
    } 
}

// Exporting all controller functions
module.exports = {
    getAllUsers,
    signup,
    login,
    newtoken,
    logout,
    deleteUser,
    updateName,
    updatePassword
};