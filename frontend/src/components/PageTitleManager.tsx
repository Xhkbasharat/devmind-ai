
import { useLocation } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/login": "Login",
  "/register": "Create Account",
  "/dashboard": "Dashboard",
  "/dashboard/code": "AI Code Generator",
  "/dashboard/debug": "AI Debugger",
  "/dashboard/explain": "Code Explainer",
  "/dashboard/analysis": "Code Analyzer",
  "/dashboard/github": "GitHub Workspace",
  "/dashboard/projects": "My Projects",
  "/dashboard/reviews": "Code Reviews",
};

export default function PageTitleManager() {
  const { pathname } = useLocation();

  const title =
    pageTitles[pathname.replace(/\/$/, "")] ||
    (pathname.startsWith("/dashboard") ? "Developer Workspace" : "Page Not Found");

  useDocumentTitle(title);

  return null;
}
