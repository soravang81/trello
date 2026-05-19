"use client"

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation"; 
import { getSession, signIn } from "next-auth/react";
import { SigninSchema } from "../../lib/zod/schema";
import { toast } from "sonner";
import { Eye } from "lucide-react";

export default function SigninComp() {
  const [email,setcurEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [type, setType] = useState<"text" | "password">("password");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  
  const handleClick = async (e:FormEvent) => {
    e.preventDefault()
    setError("");
    try {
      const parsedData = SigninSchema.safeParse({
        email,
        password,
      });
      if (!parsedData.success) {
        setError(parsedData.error.issues[0].message);
        return;
      }
      
      setIsSubmitting(true);
      const res = await signIn('credentials', {
        email,
        password,
        action : "signin",
        redirect : false
      });

      if (res?.ok) {
        const session = await getSession();
        toast.success("Signed in successfully");
        if (session?.user) {
          sessionStorage.setItem("userId", session.user.id);
          sessionStorage.setItem("email", session.user.email ?? "");
          sessionStorage.setItem("username", session.user.name ?? "");
        }

        router.push("/");
        router.refresh();
      } else {
        setError("Invalid email or password.");
        toast.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error); 
      setError("Unable to sign in right now.");
      toast.error("Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center align-middle lg:mt-40 md:mt-28 sm:mt-18 mt-10 ">
      <div className="flex flex-col justify-center align-middle border shadow-xl p-8 lg:w-[40rem] md:w-80 w-72  gap-8 rounded-2xl">
        <h1 className=" text-4xl font-semibold text-center">Welcome to <span className="text-purple-800">Workflo</span>!</h1>
        <div className="flex flex-col justify-center align-middle gap-8">
          <input className=" p-4 rounded-xl bg-gray-100 w-80%" type="text" placeholder="Email" onChange={(e) => setcurEmail(e.target.value)} />
          {error ? <div className="text-sm text-red-500 text-start pl-2">{`* ${error}`}</div> : null}
          <div className="flex w-full flex-col items-end justify-between">
          <input className=" p-4 rounded-xl bg-gray-100 w-full" type={type} placeholder="Password"  onChange={(e) => setPassword(e.target.value)} />
          <button className=" absolute self-end p-4 hover:bg-gray-200 w-fit" onClick={()=>{
            if(type === "password"){
              setType("text")
            }
            else{
              setType("password")
            }
          }}><Eye size={24}/></button>
          </div>
          <button 
            className=" bg-blue-500 p-4 rounded-lg hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70" 
            disabled={isSubmitting}
            onClick={handleClick}>{isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
        <div className="flex justify-center">
            <span>Don’t have an account? Create a <a href="/signup" className="text-blue-800 hover:underline"> new account</a></span>
        </div>
      </div>
    </div>
  );
};
