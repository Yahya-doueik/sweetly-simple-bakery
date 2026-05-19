import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: ContactRedirect,
});

function ContactRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/", hash: "contact" });
  }, [navigate]);
  return null;
}
