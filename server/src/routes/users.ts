import express from "express"
import cors from "cors"
import { users } from "../db";
import bcrypt from "bcrypt";

const saltRounds = 10
const user = express.Router();
user.use(express.json())
user.use(cors())

user.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: "Invalid email or password" });
        }

        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});
user.post("/signup", async (req, res) => {
    try {    
        const { username, email, password } = req.body;

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await users.create({ name : username, email, password: hashedPassword, });

        res.status(200).send(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});
user.put("/" , async (req, res) => {
    try{    
        const { name, email, password , image} = req.body;
        await users.updateOne({ name,password,email,image});
        res.status(200).send(true)
    }
    catch(e){
        console.error(e)
        res.status(400).send(false)
    }
})
user.delete("/" , async (req, res) => {
    try{    
        const { name, email, password , image} = req.body;
        await users.deleteOne({ name,password,email,image});
        res.status(200).send(true)
    }
    catch(e){
        console.error(e)
        res.status(400).send(false)
    }
})
export default user;

