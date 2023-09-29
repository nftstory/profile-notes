import { setModal } from "@src/signals/modalSignal";
import styles from "./Notes.module.css";
import { createEffect, createSignal, onMount } from "solid-js";
import { notes, setNotes } from "@src/signals/store";
import { currentTwitterProfile } from "@src/signals/twitterID";
import { getLocalForage } from "@src/utils";
import { SavedNote } from "@src/types";
import Autolinker from 'autolinker';

const Notes = () => {


  const [isExpanded, setExpanded] = createSignal(false);
  const [showButton, setShowButton] = createSignal(false);

  const buttonText = () => isExpanded() ? 'Show Less' : 'Show More';

  function toggleText() {
    setExpanded(!isExpanded());
  }


  let paragraphRef = null;

  function handleTruncation() {
    if (noteText().includes('\n')) {
      setShowButton(true)
    } else {
      if (paragraphRef) {
        if (paragraphRef.scrollWidth > paragraphRef.clientWidth) {
          setShowButton(true)
        } else if (!isExpanded()) {
          setShowButton(false)
        }
      }
    }
  }

  onMount(() => {
    handleTruncation();
  })

  createEffect(async () => {
    const currentProfile = currentTwitterProfile()

    if (currentProfile) {
      const id = currentProfile.id;
      const storage = await getLocalForage()
      const data = await storage.getItem<SavedNote>(`${id}-notes`)

      if (data) {
        setNotes({ [id]: data.note })
        handleTruncation()
      }
    }
  })

  createEffect(() => {
    const currentProfile = currentTwitterProfile()

    if (currentProfile) {
      const id = currentProfile.id;
      if (notes[id]) {
        handleTruncation()
      }
    }

  })

  const noteText: () => string = () => {
    const currentProfile = currentTwitterProfile()

    if (currentProfile) {
      const id = currentProfile.id;
      return notes[id] || '';
    }

    return ''
  }

  const shownTextHtml: () => string = () => {
    const text = isExpanded() ? noteText() : noteText().split('\n')[0]

    return Autolinker.link(text);
  }

  createEffect(() => {
    const text = noteText()
    handleTruncation()
  })


  createEffect(() => {
    const text = noteText();
    setExpanded(false);
  })

  return (
    <>
      <div class="w-full flex">
        <svg onClick={() => {
          setModal("EDIT")
        }} class={`${styles.noteIcon} w-6 h-6 shrink-0`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>


        <div class={`w-full flex main-text-color ${styles.noteText} ${isExpanded() ? 'flex-col items-start' : ''}`}>
          <div ref={paragraphRef} class={`${isExpanded() ? 'flex-grow w-full break-words break-all whitespace-pre-line' : 'truncate max-h-16 max-w-sm'}`} innerHTML={shownTextHtml()}>
          </div>
          {(showButton()) && <button class={`${styles.expandButton} ${!isExpanded() ? 'ml-1' : ''}`} style="text-wrap: nowrap;" onClick={toggleText}>{buttonText()}</button>}
        </div>
      </div>
    </>
  );
};

export default Notes;
