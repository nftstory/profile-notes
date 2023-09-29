import { createEffect, createSignal } from "solid-js";
import { modal, setModal } from "@src/signals/modalSignal";
import { currentTwitterProfile } from "@src/signals/twitterID";
import { getLocalForage } from "@src/utils";
import { setNotes } from "@src/signals/store";
import { SavedNote } from "@src/types";

export default function () {

    const [text, setText] = createSignal("");

    let myRef;

    createEffect(() => {
        if (modal()) {
            if (myRef) {
                myRef.focus()
            }
        }
    })

    createEffect(async () => {
        const currentProfile = currentTwitterProfile();

        if (currentProfile) {
            const id = currentProfile.id;


            if (id) {
                const storage = await getLocalForage()
                const data = await storage.getItem<SavedNote>(`${id}-notes`)

                setText(data?.note || "")
            }
        }
    })

    async function save() {
        const currentProfile = currentTwitterProfile();

        if (currentProfile) {
            const id = currentProfile.id;

            const storage = await getLocalForage()

            if(text().length > 0){
                await storage.setItem<SavedNote>(`${id}-notes`, { name: currentProfile.name, handle: currentProfile.handle, note: text(), thumbnailURL: currentProfile.thumbnailURL })
            }else {
                await storage.removeItem(`${id}-notes`)
            }

            setNotes({ [id]: text() })
            setModal(null)
        }
    }

    return <div class="main-background-color rounded-2xl shadow-lg w-96 p-4 z-50 main-text-color">
        <h2 class="text-xl font-bold mb-3">{modal() == 'EDIT' ? "Edit note" : "Search notes"}</h2>

        <textarea
            value={text()}
            ref={myRef}
            onInput={(e) => {
                setText((e.target as HTMLTextAreaElement).value)
            }}
            onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey)) {
                    if (event.key == 'Enter') {
                        event.preventDefault();
                        event.stopPropagation()
                        save();
                    }
                }
            }}
            class="w-full p-2 border rounded-md focus:border-blue-400 focus:outline-none resize-none main-background-color main-text-color"
            rows="5"
            placeholder="What's happening?"
        ></textarea>

        <div class="flex mt-4">
            {modal() == 'EDIT' && <button
                class={`ml-auto px-4 py-2 twitter-blue-bg text-white font-semibold rounded-3xl ${false && 'opacity-50 cursor-not-allowed'}`}
                disabled={false}
                onClick={save}
            >
                Save
            </button>}
        </div>
    </div>



}