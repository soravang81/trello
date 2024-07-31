import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const url = process.env.REACT_APP_DATABASE_URL || "";

export const connect = async () => {
    try {
        await mongoose.connect(url);
        const db = mongoose.connection.db;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

enum TodoStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  UNDER_REVIEW = "UNDER_REVIEW",
  FINISHED = "FINISHED"
}
enum TodoPriorities {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  URGENT = "URGENT"
}

export interface UserInterface {
  name : string
  password: string;
  email :String,
}
export interface TodoInterface {
  title: string;
  description?: string;
  status: TodoStatus;
  index? : number; 
  priority? : TodoPriorities;
  deadline?: Date;
  createdAt : Date
  updatedAt : Date
  userId: mongoose.Schema.Types.ObjectId;
  boardId: mongoose.Schema.Types.ObjectId;
}

export interface BoardInterface {
  name : string,
  userId: mongoose.Schema.Types.ObjectId
}
const BoardSchema = new mongoose.Schema<BoardInterface>({
  name : { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'}
})
const UserSchema = new mongoose.Schema<UserInterface>({
  name : { type: String, required: true},
  password: { type: String, required: true },
  email : { type: String, required: true},
});
const TodosSchema = new mongoose.Schema<TodoInterface>({
  title: { type: String, required: true },
  description: String,
  index : Number,
  status: { type: String, enum: Object.values(TodoStatus), default: TodoStatus.TODO , required: true },
  priority : { type : String , enum : Object.values(TodoPriorities)},
  deadline: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'boards' }
});

const users = mongoose.model<UserInterface>('users', UserSchema , "users");
const todos = mongoose.model<TodoInterface>('todos', TodosSchema , "todos");
const boards = mongoose.model<BoardInterface>('boards', BoardSchema , "boards");

export { users, todos ,boards, TodoStatus , TodoPriorities , UserSchema ,TodosSchema , BoardSchema };
