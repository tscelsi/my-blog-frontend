import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { getAccountQueryOptions } from "../queries/auth_service";
import { Account } from "../types";

type AuthContextType = {
  session: Session | null;
  isAuthenticated: boolean;
  account: Account | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const { data: account } = useQuery(getAccountQueryOptions());
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <AuthContext.Provider
      value={{ session, isAuthenticated: !!session, account: account || null }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
