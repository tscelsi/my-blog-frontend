import axios from "axios";
import { supabase } from "../supabaseClient";

export const createAxiosClient = () => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
  });

  client.interceptors.request.use(
    (config) =>
      new Promise((resolve) => {
        supabase.auth
          .getSession()
          .then(({ data: { session } }) => {
            if (session) {
              config.headers.Authorization = `Bearer ${session.access_token}`;
              resolve(config);
            } else {
              resolve(config);
            }
          })
          .catch(() => resolve(config));
      })
  );
  return client;
};
