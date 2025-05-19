import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Session } from "@supabase/supabase-js";

type ConfirmParams = {
  token_hash: string;
  type: "email";
};

export const Route = createFileRoute("/auth/confirm")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): ConfirmParams => {
    return {
      type: search.type as "email",
      token_hash: search.token_hash as string,
    };
  },
});

function RouteComponent() {
  const { token_hash, type } = Route.useSearch();
  const [session, setSession] = useState<Session | null>(null);
  const verify = useCallback(async () => {
    const { error, data } = await supabase.auth.verifyOtp({
      type: type,
      token_hash: token_hash,
    });
    if (error) {
      alert(error.message);
    } else {
      setSession(data.session);
    }
  }, [token_hash, type]);

  useEffect(() => {
    verify();
  }, [verify]);

  if (session) {
    return <Navigate to="/" />;
  }
  return <div>confirming...</div>;
}
