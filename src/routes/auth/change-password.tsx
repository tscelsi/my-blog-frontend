import { createFileRoute, redirect } from "@tanstack/react-router";
import { FormEventHandler, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Input } from "../../components/inputs";
import { useAuth } from "../../hooks/useAuth";

export const Route = createFileRoute("/auth/change-password")({
  component: ChangePassword,
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/auth/login" });
    }
  },
});

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const [newPassword, setNewPassword] = useState("");

  const handleLogin: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      email: session?.user.email,
      password: newPassword,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully!");
      redirect({ to: "/" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="flex flex-col gap-4">
        <Input
          type="password"
          placeholder="Your new password"
          value={newPassword}
          required={true}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <button className={"button block"} disabled={loading}>
          {loading ? <span>Loading</span> : <span>Update</span>}
        </button>
      </div>
    </form>
  );
}
