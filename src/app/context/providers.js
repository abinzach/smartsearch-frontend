'use client';

import { AuthContextProvider } from "./AuthContext";


export function Providers({ children }) {
  return (
      <AuthContextProvider>{children}</AuthContextProvider>
  );
}