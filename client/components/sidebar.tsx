"use client"
import { ArrowDownToLine, ChartSpline, Home, KanbanSquare, LogIn, LogOut, Menu, PlusCircle, Settings, Users, X } from "lucide-react";
import { Button } from "./ui/button";
import "lucide-react"
import { useState } from "react";
import { CloseButton, CreateTask, SidebarOptions } from "./sidebarButtons";
import { useRecoilState, useRecoilValue } from "recoil";
import { isSidebarOpen } from "@/lib/recoil/atoms";

export function Sidebar() {
  const [isSideBar,setSidebar] = useRecoilState(isSidebarOpen);

  return (
    <>
    <div
      className={`flex flex-col justify-between p-4 h-screen shadow-lg bg-white border transition-transform duration-300 ease-in-out ${
        isSideBar ? "transform translate-x-0 w-64 " : "transform -translate-x-full hidden"
      }`}
    >
      <div className="flex flex-col">
        <CloseButton/>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex">
            <SidebarOptions href="/login"><LogIn /> Login</SidebarOptions>
            <SidebarOptions href="/signup"><LogOut /> Signup</SidebarOptions>
          </div>
          <SidebarOptions><Home /> Home</SidebarOptions>
          <SidebarOptions><KanbanSquare /> Boards</SidebarOptions>
          <SidebarOptions><Settings /> Settings</SidebarOptions>
          <SidebarOptions><Users /> Teams</SidebarOptions>
          <SidebarOptions><ChartSpline /> Analytics</SidebarOptions>
          <CreateTask/>
        </div>
      </div>
      <div className="mt-auto">
        <Button className="flex gap-2" variant="ghost">
          <ArrowDownToLine /> Download the app
        </Button>
      </div>
    </div>
    {!isSideBar && <Button variant={"outline"} className="h-fit" onClick={()=>setSidebar(true)}><Menu/></Button>}
    </>
  );
}