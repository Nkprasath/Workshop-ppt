import { createRoot } from "react-dom/client";
import Deck from "./app/deck/Deck";

// Entry point for the single file build. The deck is the whole application here: no
// router, no server, no network. Everything it needs is inlined into one .html.
const el = document.getElementById("root");
if (el) createRoot(el).render(<Deck />);
