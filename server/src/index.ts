import express from "express"
import { connect, users, UserSchema } from "./db";
import cors from "cors"
import user from "./routes/users";
import todo from "./routes/todos";

const app = express()
app.use(express.json())
app.use(cors())

app.use("/user" , user)
app.use("/todos" , todo)

connect()

app.listen(8080)