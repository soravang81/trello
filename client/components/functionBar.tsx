import React from "react";
import { Input } from "./ui/input";
import { TodoForm } from "./addTodo";
import { useRecoilState, useRecoilValue } from 'recoil';
import { Todos } from '@/lib/recoil/atoms';
import { TodoInterface } from "@/types/types";
import axios from "axios";
import { toast } from "sonner";

export const FunctionsBar: React.FC = () => {
    const [todos, setTodos] = useRecoilState(Todos);
  
    const addNewTodo = async (newTodo: Omit<TodoInterface, "_id" | "createdAt" | "updatedAt">) => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`, { todo: newTodo });
        const newId = res.data;
  
        const todoWithId: TodoInterface = {
          ...newTodo,
          _id: newId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
  
        setTodos((prevTodos : Omit<TodoInterface[], "_id" | "createdAt" >)=> [...prevTodos, todoWithId]);
        toast.success("New task added successfully!");
      } catch (error) {
        console.error('Failed to add new todo in backend:', error);
        toast.error("Failed to add new task!");
      }
    };
  
    return (
      <div className="flex justify-between px-8 py-4">
        <Input className="w-72 p-2" height={40} type="text" placeholder="Search" />
        <div className="w-72 p-2">
          <TodoForm addTodo={addNewTodo} />
        </div>
      </div>
    );
  };