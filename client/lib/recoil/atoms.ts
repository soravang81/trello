import { TodoInterface, TodoPriorities, TodoStatus } from "@/types/types";
import { atom } from "recoil";

export const isSidebarOpen = atom({
    key: "isSidebarOpen",
    default: true,
})
export const isDialogOpen = atom({
    key: "isDialogOpen",
    default: false,
})
export const Todos = atom<any>({
    key: "Todos",
    default : []
})
export const isDraggingState = atom({
    key: 'isDraggingState',
    default: false,
  });