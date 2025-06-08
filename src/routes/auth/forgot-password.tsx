import { createFileRoute } from "@tanstack/react-router";
import { FormEventHandler, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Input } from "../../components/inputs";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPassword,
});

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPassword: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/change-password`,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the password reset link!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <div className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button className={"button block"} disabled={loading}>
          {loading ? <span>Loading</span> : <span>Send login link</span>}
        </button>
      </div>
    </form>
  );
}
