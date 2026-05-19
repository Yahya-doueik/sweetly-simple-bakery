import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/menu")({
  component: MenuRedirect,
});

function MenuRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/", hash: "menu" });
  }, [navigate]);
  return null;
}
