import { Home, PlusCircle, X } from "lucide-react"
import { Button } from "./ui/button"
import { ReactNode } from "react"
import { useRecoilState } from "recoil";
import { isSidebarOpen, Todos } from "@/lib/recoil/atoms";
import { useRouter } from "next/navigation";
import { TodoForm } from "./addTodo";
import { TodoInterface } from "@/types/types";
import { addTodo } from "@/lib/todo_fn/todosFunctions";
import axios from "axios";
import { toast } from "sonner";

interface ISidebarOptions {
    children?: ReactNode;
    href ?: string;
    onclick? : () => void;
}

export const SidebarOptions = ({children , href , onclick}:ISidebarOptions) =>{
    const router = useRouter()
    const handleClick = () => {
        href ? router.push(href) : onclick ? onclick() : null
    }
    return (
        <Button className="flex justify-start gap-2" variant="ghost" onClick={handleClick}>
            {children}
        </Button>
    )
}
export const CreateTask = () =>{
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
  
        setTodos((prevTodos : Omit<TodoInterface[], "_id" | "createdAt">)=> [...prevTodos, todoWithId]);
        toast.success("New task added successfully!");
      } catch (error) {
        console.error('Failed to add new todo in backend:', error);
        toast.error("Failed to add new task!");
      }
    };
    return (
        <TodoForm onSubmit={addNewTodo}/>
    )
}
export const CloseButton = () =>{
    const [isOpen, setIsOpen] = useRecoilState(isSidebarOpen);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };
    return(
        <button className="self-end" onClick={handleToggle} aria-label="Close sidebar">
          <X />
        </button>
    )
}