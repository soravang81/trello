import { TodoInterface } from "@/types/types";
import axios from "axios";
import { toast } from "sonner";

export const editTodo = async(todo : Omit<TodoInterface, "_id" | "createdAt" | "updatedAt">) =>{
    try {
      const todos = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`, { todo });console.log(todos.data)
      return todos.data
    } catch (error) {
      console.error('Failed to update todo status in backend:', error);
      toast.error("Failed to update task status!");
    }
  }
export const addTodo = async(newTask : Omit<TodoInterface, "_id" | "createdAt" | "updatedAt">) =>{
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`, { newTask });
    } catch (error) {
      console.error('Failed to add new todo in backend:', error);
      toast.error("Failed to add new task !");
    }
  }