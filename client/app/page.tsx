import { Sidebar } from "@/components/sidebar";
import { TodoArea } from "@/components/todoArea";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex gap-2 bg-gray-200 min-h-screen">
      <Sidebar/>
      <TodoArea/>
    </div>
  );
}
