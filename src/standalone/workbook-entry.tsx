import { createRoot } from "react-dom/client";
import StaticWorkbook from "./StaticWorkbook";

const el = document.getElementById("root");
if (el) createRoot(el).render(<StaticWorkbook />);
