import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { TodoInterface } from "@/types/types";
import { getTimeDifference } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TodoForm } from "./addTodo";
import { editTodo } from "@/lib/todo_fn/todosFunctions";
import { toast } from "sonner";
import { useMouseInteraction } from "./algo";
import { Clock3 } from "lucide-react";
import { useRecoilState } from "recoil";
import { Todos } from "@/lib/recoil/atoms";

export const TodoCard: React.FC<{
  todo: TodoInterface,
  isDragging?: boolean,
  isBeingDragged?: boolean
}> = React.memo(({ todo, isDragging, isBeingDragged }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { interactionType, handlers } = useMouseInteraction();
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [todos, setTodos] = useRecoilState<TodoInterface[]>(Todos);

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
    if (!isDragging && !isBeingDragged) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      clickTimeoutRef.current = setTimeout(() => {
        setIsEditing(true);
      }, 50);
    }
  }, [isDragging, isBeingDragged]);

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
      onClick={handleClick}
      className={`bg-white shadow-md rounded-md border p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer select-none ${isBeingDragged ? 'opacity-50' : ''}`}
    >
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
        <div className="mt-2 text-base text-gray-600">
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