import { Sidebar } from "@/components/sidebar";
import { TodoArea } from "@/components/todoArea";
import { getServerSession } from "next-auth";

export default function Home() {
  const session = getServerSession()
  if(!session) return;
  return (
    <div className="flex gap-2 bg-gray-200 min-h-screen">
      <Sidebar/>
      <TodoArea/>
    </div>
  );
}
