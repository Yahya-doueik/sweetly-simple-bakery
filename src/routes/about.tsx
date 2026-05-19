import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutRedirect,
});

function AboutRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/", hash: "about" });
  }, [navigate]);
  return null;
}
