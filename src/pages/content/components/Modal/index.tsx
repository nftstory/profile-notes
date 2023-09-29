import { modal, setModal } from "@src/signals/modalSignal";
import Edit from "../Edit";
import Search from "../Search";
import { createEffect, onCleanup } from "solid-js";

function Modal() {
    createEffect(() => {
        const onKey: (this: Document, ev: KeyboardEvent) => any = async (event) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                setModal(null)
            }
        }

        document.addEventListener('keydown', onKey);

        onCleanup(() => {
            document.removeEventListener('keydown', onKey);
        });
    });

    return (
        <>
            {modal() && (
                <div class="fixed inset-0 flex items-center justify-center p-4">
                    <div
                        class="absolute inset-0"
                        style="background: rgba(91, 112, 131, 0.4);"
                        onClick={() => setModal(null)}
                    ></div>
                    {modal() === 'EDIT' ? <Edit /> : <Search />}
                </div>
            )}
        </>
    );
}

export default Modal;
