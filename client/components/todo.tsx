import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { TodoInterface } from "@/types/types";
import { getTimeDifference } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TodoForm } from "./addTodo";
import { editTodo } from "@/lib/todo_fn/todosFunctions";
import { toast } from "sonner";
import { useMouseInteraction } from "./algo";
import { Clock3, Trash2 } from "lucide-react";
import { useRecoilState } from "recoil";
import { Todos } from "@/lib/recoil/atoms";
import axios from "axios";

const TodoCard: React.FC<{
  todo: TodoInterface,
  isDragging?: boolean,
  isBeingDragged?: boolean
}> = React.memo(({ todo, isDragging, isBeingDragged }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { interactionType, handlers } = useMouseInteraction();
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [todos, setTodos] = useRecoilState<TodoInterface[]>(Todos);
  const userId = sessionStorage.getItem('userId');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo._id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition]);

  const handleClick = useCallback(() => {
    if (!isDragging && !isBeingDragged && interactionType === 'clicking') {
      setIsEditing(true);
    }
  }, [isDragging, isBeingDragged, interactionType]);

  useEffect(() => {
    if (interactionType === 'clicking') {
      handleClick();
    }
  }, [interactionType, handleClick]);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleTodoUpdate = useCallback(async (updatedTodo: Omit<TodoInterface, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const updatedTodoFromBackend = await editTodo(updatedTodo);
      setTodos((prevTodos) => 
        prevTodos.map((t) => 
          t._id === todo._id ? { ...t, ...updatedTodoFromBackend } : t
        )
      );
      setIsEditing(false);
      toast.success("Todo updated successfully");
    } catch (error) {
      console.error(`[TodoCard ${todo._id}] Error updating todo:`, error);
      toast.error("Failed to update todo");
    }
  }, [todo._id, setTodos]);

  const handleDialogChange = useCallback((open: boolean) => {
    if (!open) {
      setIsEditing(false);
    }
  }, []);
  const handleDelete = useCallback(async (e: React.MouseEvent) => {
    console.log('Delete button clicked'); // Add this line
    e.stopPropagation();
    e.preventDefault();
    console.log('handleDelete')
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos?id=${userId}?todoId=${todo._id}`);
      setTodos((prevTodos) => prevTodos.filter((t) => t._id !== todo._id));
      toast.success("Todo deleted successfully");
    } catch (error) {
      console.error(`[TodoCard ${todo._id}] Error deleting todo:`, error);
      toast.error("Failed to delete todo");
    }
  }, [todo._id, setTodos, userId, attributes]);

  const priorityClass = useMemo(() => {
    switch (todo.priority) {
      case "LOW": return "bg-green-500";
      case "MEDIUM": return "bg-orange-400";
      case "URGENT": return "bg-red-600";
      default: return "";
    }
  }, [todo.priority]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      {...handlers}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClick();
        }
      }}
      className={`relative bg-white shadow-md rounded-md border p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer select-none ${isBeingDragged ? 'opacity-50' : ''}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(e);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-500 transition-colors duration-200 z-10"
        aria-label="Delete todo"
      >
        <Trash2 size={16} />
      </button>
      <div className="mt-2">
        <h3 className="text-xl font-medium">{todo.title}</h3>
        {todo.description && (
          <p className="text-base text-gray-600 mt-1">{todo.description}</p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {todo.priority && (
          <span className={`text-sm font-medium ${priorityClass} text-white py-1 px-2 rounded`}>
            {todo.priority}
          </span>
        )}
      </div>
      {(todo.deadline || todo.updatedAt) && (
        <div className="mt-2 text-base text-gray-500">
          {todo.deadline && (
            <p className="flex gap-2 items-center"><Clock3 /> {new Date(todo.deadline).toDateString()}</p>
          )}
          {todo.updatedAt && (
            <p>{getTimeDifference(new Date(todo.updatedAt))}</p>
          )}
        </div>
      )}
      <TodoForm
        onSubmit={handleTodoUpdate}
        todoToEdit={todo}
        open={isEditing}
        onopenchange={handleDialogChange}
      />
    </div>
  );
});

TodoCard.displayName = 'TodoCard';
export default TodoCard;