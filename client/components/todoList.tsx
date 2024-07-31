import React, { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import TodoCard from "./todo";
import { isDraggingState, Todos } from "@/lib/recoil/atoms";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TodoStatus, TodoInterface, statusColumns } from "@/types/types";
import { TodoForm } from "./addTodo";
import { DroppableColumn, isColumnId } from "./algo";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

export const TodoListByStatus: React.FC = () => {
  const [todos, setTodos] = useRecoilState<TodoInterface[]>(Todos);
  const [isDragging, setIsDragging] = useRecoilState(isDraggingState);
  const [activeId, setActiveId] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const session = await getSession();
    if (!userId || !session?.user) {
      toast.error("You are not signed in", {
        action: {
          label: 'Login',
          onClick: () => {
            window.location.href = '/login';
          }
        }
      });
      return;
    }
    try {
      const res = await axios.get<TodoInterface[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos?id=${userId}`);
      setTodos(res.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      toast.error("Failed to load tasks!");
    }
  }, [setTodos]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setIsDragging(true);
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;
  
    if (!over) {
      setActiveId(null);
      return;
    }
  
    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const activeItem = items[oldIndex];
        let newIndex: number;
        let newStatus: TodoStatus | any = activeItem.status;
  
        if (isColumnId(over.id)) {
          newStatus = (over.id).toString().split('-')[1] as TodoStatus;
          newIndex = items.filter(item => item.status === newStatus).length;
        } else {
          const overItemIndex = items.findIndex((item) => item._id === over.id);
          newIndex = overItemIndex;
          newStatus = items[overItemIndex].status;
        }
  
        let updatedItems = [...items];
        updatedItems.splice(oldIndex, 1);
        updatedItems.splice(newIndex, 0, { ...activeItem, status: newStatus });
  
        const updateIndices = (status: TodoStatus) => {
          const columnItems = updatedItems.filter(item => item.status === status);
          updatedItems = updatedItems.map(item => 
            item.status === status 
              ? { ...item, index: columnItems.findIndex(ci => ci._id === item._id) }
              : item
          );
          columnItems.forEach((item, index) => {
            updateTodoIndex(item._id, index);
          });
        };
  
        if (activeItem.status !== newStatus) {
          updateIndices(activeItem.status as TodoStatus);
          updateTodoStatus(activeItem._id, newStatus, newIndex);
        } else {
          updateTodoIndex(activeItem._id, newIndex);
        }
        
        updateIndices(newStatus);
  
        return updatedItems;
      });
    }
  
    setActiveId(null);
}, [setIsDragging, setTodos]);

  const updateTodoStatus = useCallback(async (todoId: string, newStatus: TodoStatus, newIndex: number) => {
    try {
      const userId = sessionStorage.getItem('userId');
      const todo = {
        id: userId,
        todoId,
        status: newStatus,
        index: newIndex
      }
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`, todo);
    } catch (error) {
      console.error('Failed to update todo status in backend:', error);
      toast.error("Failed to update task status!");
    }
  }, []);
  
  const updateTodoIndex = useCallback(async (todoId: string, newIndex: number) => {
    try {
      const userId = sessionStorage.getItem('userId');
      const todo = {
        id: userId,
        todoId,
        index: newIndex
      }
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`, todo);
    } catch (error) {
      console.error('Failed to update todo index in backend:', error);
      toast.error("Failed to update task order!");
    }
  }, []);

  const filterTodosByStatus = useCallback((status: TodoStatus): TodoInterface[] => {
    return todos
      .filter((todo) => todo.status === status)
      .sort((a, b) => (a.index || 0) - (b.index || 0));
  }, [todos]);

  const addNewTodo = useCallback(async (newTodo: Omit<TodoInterface, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`, { todo: newTodo });
      const newId = res.data;

      const todoWithId: TodoInterface = {
        ...newTodo,
        _id: newId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTodos(prevTodos => [...prevTodos, todoWithId]);
      toast.success("New task added successfully!");
    } catch (error) {
      console.error('Failed to add new todo in backend:', error);
      toast.error("Failed to add new task!");
    }
  }, [setTodos]);
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 border rounded-md shadow-lg">
        {statusColumns.map((column) => {
          const columnTodos = filterTodosByStatus(column.status);
          return (
            <DroppableColumn key={column.status} id={`column-${column.status}`}>
              <h2 className="text-xl font-bold mb-4">{column.title}</h2>
              <SortableContext
                items={columnTodos.map((todo) => todo._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4 p-4 rounded-lg  min-w-80 min-h-[200px]">
                  {columnTodos.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No todos in this status
                    </div>
                  ) : (
                    columnTodos.map((todo) => (
                      <TodoCard 
                        key={todo._id} 
                        todo={todo} 
                        isDragging={isDragging}
                        isBeingDragged={activeId === todo._id}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
              <TodoForm status={column.status} addTodo={addNewTodo} />
            </DroppableColumn>
          );
        })}
      </div>
      <DragOverlay>
        {activeId ? (
          <TodoCard todo={todos.find((todo) => todo._id === activeId) as TodoInterface} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};