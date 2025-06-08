import { FormEventHandler, useState } from "react";
import { supabase } from "../../supabaseClient";

import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Input } from "../../components/inputs";

export const Route = createFileRoute("/auth/login")({
  component: Login,
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: "/" });
    }
  },
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Your password"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button className={"button block"} disabled={loading}>
            {loading ? <span>Loading</span> : <span>Login</span>}
          </button>
        </div>
      </form>
      <button className={"button block"} disabled={loading}>
        {loading ? (
          <span>Loading</span>
        ) : (
          <Link to={"/auth/forgot-password"}>Forgot password</Link>
        )}
      </button>
    </>
  );
}
