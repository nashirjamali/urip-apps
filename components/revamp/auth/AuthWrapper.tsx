"use client";

import React from "react";
import { ProtectedRoute } from "./ProtectedRoute";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  requireAuth = true
}) => {
  return (
    <ProtectedRoute requireAuth={requireAuth}>
      {children}
    </ProtectedRoute>
  );
};
