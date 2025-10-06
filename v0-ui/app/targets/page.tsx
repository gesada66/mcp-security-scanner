"use client";

import { useEffect } from "react";

export default function TargetsAliasPage() {
  useEffect(() => {
    window.location.replace("/manage-targets");
  }, []);
  return null;
}


