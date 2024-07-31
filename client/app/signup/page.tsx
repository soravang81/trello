"use client"
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { SignupSchema } from "../../lib/zod/schema";
import { toast } from "sonner";
import { Eye } from "lucide-react";

export default function SignupComp() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [type, setType] = useState<"text" | "password">("password");
  const router = useRouter();

  const handleClick = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = SignupSchema.safeParse({
        email,
        username,
        password,
      });
      if (!parsedData.success) {
        setError(parsedData.error.issues[0].message);
        setIsError(true);
      } else {
        console.log(email, username, password);
        const res = await signIn('credentials', {
          email,
          password,
          username,
          action: "signup",
          redirect: false
        });
        if (res?.ok) {
          const session = await getSession();
          console.log("Signup successful");
          console.log(session?.user);
          router.push("/");
          toast.success("Signed up successfully");
          if (session?.user) {
            sessionStorage.setItem("userId", session.user.id.toString());
            sessionStorage.setItem("email", session.user.email?.toString() || "");
            sessionStorage.setItem("username", session.user.name?.toString() || "");
          } else {
            console.log("Invalid session", session);
          }
        } else {
          console.error("Signup failed");
          toast.error("Signup failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during signup");
    }
  };

  return (
    <div className="flex justify-center align-middle lg:mt-40 md:mt-28 sm:mt-18 mt-10">
      <div className="flex flex-col justify-center align-middle border shadow-xl p-8 lg:w-[40rem] md:w-80 w-72 gap-8 rounded-2xl">
        <h1 className="text-4xl font-semibold text-center">Welcome to <span className="text-purple-800">Workflo</span>!</h1>
        <div className="flex flex-col justify-center align-middle gap-8">
          <input 
            className="p-4 rounded-xl bg-gray-100 w-full" 
            type="text" 
            placeholder="Full name" 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            className="p-4 rounded-xl bg-gray-100 w-full" 
            type="text" 
            placeholder="Your email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <div className="flex w-full flex-col items-end justify-between">
            <input 
              className="p-4 rounded-xl bg-gray-100 w-full" 
              type={type} 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button 
              className="absolute self-end p-4 hover:bg-gray-200 w-fit" 
              onClick={() => setType(type === "password" ? "text" : "password")}
            >
              <Eye size={24}/>
            </button>
          </div>
          {isError && <div className="text-sm text-red-500 text-start pl-2">{`* ${error}`}</div>}
          <button
            className="bg-blue-500 p-4 rounded-lg hover:bg-blue-800 text-white"
            onClick={handleClick}
          >
            Sign Up
          </button>
        </div>
        <div className="flex justify-center">
          <span>Already have an account? <a href="/login" className="text-blue-800 hover:underline">Log in</a></span>
        </div>
      </div>
    </div>
  );
}