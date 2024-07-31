"use client"
import { TodoListByStatus } from "./todoList"
import React from "react"
import {Features} from "./features"
import { FunctionsBar } from "./functionBar"
import { getGreeting } from "@/lib/utils"
import { CircleHelp } from "lucide-react"

export const TodoArea = ()=>{
    const greeting = getGreeting()
    let username
    if(typeof window !== "undefined"){
        username = sessionStorage.getItem("username");
      }
    return (
        <div className="bg-gray-100 flex flex-col shadown-md gap-4 h-fit rounded-lg p-8">
            <div className="flex justify-between">
                <h1 className="text-4xl">{greeting} , {username} !</h1>
                <h3 className="flex gap-2 items-center hover:cursor-pointer hover:underline hover:scale-105">Help & Feedback <CircleHelp size={24}/></h3>
            </div>
            <Features />
            <FunctionsBar/>
            <TodoListByStatus/>
        </div>
    )
}