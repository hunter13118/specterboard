import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const base = import.meta.env.BASE_URL || "/";

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

createRoot(document.getElementById("root")).render(
  publishableKey ? (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl={base}>
      {app}
    </ClerkProvider>
  ) : (
    app
  ),
);
