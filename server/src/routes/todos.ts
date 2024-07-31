import express from "express"
import cors from "cors"
import { TodoInterface, todos } from "../db";

const todo = express.Router();
todo.use(express.json())
todo.use(cors())

todo.get('/', async (req, res) => {
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).send({ message: 'User ID is required' });
    }
  
    try {
      const todosList = await todos.find({ userId : id });
      res.status(200).send(todosList);
    } catch (e) {
      console.error(e);
      res.status(400).send({ message: 'Error fetching todos' });
    }
  });
  
  todo.post('/', async (req, res) => {
    console.log(req.body)
    const { title, description, status, priority, deadline, index, id , bid } = req.body.todo;
  
    if (!id) {
      return res.status(402).send({ message: 'User ID is required' });
    }
    try {
      const user = await todos.create({ title, description, status, priority, deadline, index, userId : id , boardId : bid });
      res.status(200).send(user._id);
    } catch (e) {
      console.error(e);
      res.status(400).send({ message: 'Error creating todo' });
    }
  });
  
  todo.put('/', async (req, res) => {
    let data;
    if(req.body.todo){
      data = req.body.todo
    }
    else{
      data = req.body
    }
    const { title, description, status, priority, deadline, index, id  , todoId} = data;
  
    if (!id) {
      return res.status(400).send({ message: 'User ID is required' });
    }
  
    try {
      const todo = await todos.findByIdAndUpdate(
        { userId : id , _id : todoId },
        { title, description, status, priority, deadline, index },
        { new: true }
      );
      res.status(200).send(todo);
    } catch (e) {
      console.error(e);
      res.status(400).send({ message: 'Error updating todo' });
    }
  });
  
  todo.delete('/', async (req, res) => {
    const { id, todoId } = req.body;
  
    if (!id) {
      return res.status(400).send({ message: 'User ID is required' });
    }
  
    try {
      await todos.findByIdAndDelete({ _id: todoId, id });
      res.status(200).send({ message: 'Todo deleted successfully' });
    } catch (e) {
      console.error(e);
      res.status(400).send({ message: 'Error deleting todo' });
    }
  });

export default todo;

