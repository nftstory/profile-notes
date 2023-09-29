import "@src/styles/index.css";
import { getLocalForage } from "@src/utils";
import { SavedNote } from "@src/types";
import { is, assert, object, string, define } from 'superstruct';
import Checkmark from "./Checkmark";
import { Setter, createSignal } from "solid-js";


const SavedNoteStruct = object({
  name: string(),
  handle: string(),
  note: string(),
  thumbnailURL: string(),
});


const NotesDatabase = define('NotesDatabase', (value) => {
  return typeof value === 'object' && Object.keys(value).every(key => is(value[key], SavedNoteStruct))
})

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}


const onFileChange = (e: HTMLInputEvent, setShowCheckMark: Setter<boolean>) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = JSON.parse(e.target.result as string);
        assert(content, NotesDatabase);

        const keys = Object.keys(content);

        const storage = await getLocalForage()


        if (confirm(`This will import ${keys.length} notes, are you sure you want to proceed?
        
Existing notes will be overwritten`)) {
          for (let key of keys) {
            await storage.setItem<SavedNote>(key, content[key])
          }


          setShowCheckMark(true)
          setTimeout(() => {
            window.close();
          }, 1000)
        }

      } catch (error) {
        alert("Invalid import")
      }
    };
    reader.readAsText(file);
  }
};

let ref: HTMLInputElement | null = null;

const Popup = () => {
  const [showCheckMark, setShowCheckMark] = createSignal(false)

  return (
    <div class="flex flex-col items-center justify-evenly h-full">
      <input ref={ref} class="hidden" type="file" onChange={(e) => onFileChange(e as any as HTMLInputEvent, setShowCheckMark)} accept=".json" />
      {showCheckMark() ? <Checkmark /> : <>
        <button
          class={`px-4 py-2 twitter-blue-bg text-white font-semibold rounded-3xl`}
          onClick={() => {
            if (ref) {
              ref.click();
            }
          }}
        >
          Choose file
        </button>
      </>}
    </div>
  );
};

export default Popup;
