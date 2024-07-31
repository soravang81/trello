"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prioritiesColumns, statusColumns, TodoInterface, TodoPriorities, TodoStatus } from "@/types/types";
import { CalendarIcon, Pencil, Plus } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { toast } from 'sonner';
import { isDialogOpen, Todos } from '@/lib/recoil/atoms';
import { useRecoilState } from 'recoil';
import axios from 'axios';

export function TodoForm({ status, onSubmit, todoToEdit, open, onopenchange, addTodo }: {
  status?: TodoStatus;
  onSubmit?: (todo: Omit<TodoInterface, "createdAt" | "updatedAt" | any>) => void;
  todoToEdit?: TodoInterface;
  open?: boolean;
  onopenchange?: (open: boolean) => void;
  addTodo?: (todo: Omit<TodoInterface, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
}) {
  const [todos,setTodos] = useRecoilState<TodoInterface[]>(Todos);
  const [title, setTitle] = useState(todoToEdit?.title || "");
  const [newStatus, setStatus] = useState<TodoStatus | undefined>(todoToEdit?.status || status);
  const [priority, setPriority] = useState<TodoPriorities | undefined>(todoToEdit?.priority);
  const [deadline, setDeadline] = useState<Date | undefined>(todoToEdit?.deadline ? new Date(todoToEdit.deadline) : new Date());
  const [description, setDescription] = useState(todoToEdit?.description || "");
  const [isDialog, setIsDialog] = useRecoilState<boolean>(isDialogOpen);

  useEffect(() => {
    if (todoToEdit && open) {
      setTitle(todoToEdit.title);
      setStatus(todoToEdit.status);
      setPriority(todoToEdit.priority || undefined);
      setDeadline(todoToEdit.deadline ? new Date(todoToEdit.deadline) : undefined);
      setDescription(todoToEdit.description || "");
    }
  }, [todoToEdit, open]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus && !status) {
      toast.error("Status must not be empty!");
      return;
    }
    if (!title) {
      toast.error("Title must not be empty!");
      return;
    }
    let userId
    if(typeof window !== "undefined"){
      userId = sessionStorage.getItem("userId");
      if (!userId) {
        toast.error("Invalid user");
        return;
    }
    }

    const todoData: Omit<TodoInterface , "createdAt" | "updatedAt" |  any> = {
      id: userId,
      title,
      description,
      status: status ?? newStatus!,
      priority,
      deadline,
      index: todos.filter(todo => todo.status === (status ?? newStatus)).length,
    };

    
  try {
    if (addTodo) {
      await addTodo(todoData);
    } else if (onSubmit) {
      if (todoToEdit) {
        onSubmit({ ...todoData, todoId: todoToEdit._id });
      } else {
        onSubmit(todoData);
      }
    }
      onopenchange && onopenchange(false);
      // toast.success("Task saved successfully!");
    } catch (error) {
      console.error('Failed to save todo:', error);
      toast.error("Failed to save task!");
    }
  }, [title, newStatus, description, priority, deadline, todoToEdit, onSubmit, onopenchange, addTodo, todos, status]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    onopenchange && onopenchange(newOpen);
    if (!newOpen && isEditing) {
      setTitle(todoToEdit?.title || "");
      setStatus(todoToEdit?.status || status);
      setPriority(todoToEdit?.priority);
      setDeadline(todoToEdit?.deadline ? new Date(todoToEdit.deadline) : new Date());
      setDescription(todoToEdit?.description || "");
    }
  }, [onopenchange, todoToEdit, status]);
  
  
  if(typeof window !== "undefined"){
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      toast.error("Invalid user");
      return;
  }
  }

  const isEditing = !!todoToEdit;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEditing ? null
        : (
          <Button className="w-full py-3 rounded-lg bg-blue-500 text-white flex justify-between" onClick={() => {setStatus(status);setIsDialog(true)}}>
            Add new <Plus/>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] transition-transform duration-200 ease-in-out">
        <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogDescription>{isEditing ? "Edit your task details." : "Add a new task to your list."}</DialogDescription>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2">
            <div className="flex items-center gap-4">
              <Input
                id="title"
                value={title}
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-4 border-none p-0  text-2xl"
                style={{ boxShadow: 'none' }}
              />
            </div>
            <div className="flex items-center justify-between ml-2 mr-12 gap-4">
              <Label htmlFor="status" className="col-span-4">Status</Label>
              <Select 
                value={newStatus} 
                onValueChange={(value: TodoStatus) => setStatus(value)}
              >
                <SelectTrigger className="w-[60%]">
                  <SelectValue placeholder="Select a Status" />
                </SelectTrigger>
                <SelectContent className="">
                  <SelectGroup>
                    {statusColumns.map((s) => (
                      <SelectItem key={s.status} value={s.status}>
                        {s.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          <div className="flex items-center justify-between ml-2 mr-12 gap-4">
            <Label htmlFor="status" className="col-span-4">Priority</Label>
            <Select 
              value={priority} 
              onValueChange={(value:TodoPriorities) => setPriority(value)}>
                <SelectTrigger className="w-[60%]">
                    <SelectValue placeholder="Select a Priority" />
                </SelectTrigger>
                <SelectContent className="">
                    <SelectGroup>
                    {prioritiesColumns.map((priority) => (
                    <SelectItem key={priority.priority} value={priority.priority} >
                        {priority.title}
                    </SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-4 ml-2 mr-12">
            <Label htmlFor="description" className="col-span-4">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-4 w-[60%]"
            />
          </div>
          <div className="flex items-center justify-between gap-4 ml-2 mr-12">
            <Label className="col-span-4">Deadline</Label>
            <Popover>
            <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={"w-[60%] pl-3 text-left font-normal text-muted-foreground"}
                >
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 " align="start">
              <div>
              <Calendar
                className="z-10"
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                disabled={(date) => date < new Date()}
              />
            </div>
              </PopoverContent>
            </Popover>
            </div>
            </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">{isEditing ? "Update Task" : "Save Task"}</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}