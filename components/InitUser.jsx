// components/InitUser.tsx
"use client";

import { saveUserToDb } from "@/app/actions/saveUser";
import { useEffect } from "react";
// import { saveUserToDb } from "@/app/actions/save-user";

export default function InitUser() {
  useEffect(() => {
    saveUserToDb(); // call server action from client
  }, []);

  return null;
}
