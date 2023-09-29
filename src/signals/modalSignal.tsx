import { createSignal } from "solid-js";

export const [modal, setModal] = createSignal<"SEARCH" | "EDIT" | null>(null);
