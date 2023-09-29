import "@src/styles/index.css";
import { getLocalForage } from "@src/utils";
import { SavedNote } from "@src/types";

const downloadFile = (data) => {
  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(data)], { type: 'application/json' });


  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${day}-${monthNames[monthIndex]}-${year}_${hours}-${minutes}-${seconds}`;

  element.href = URL.createObjectURL(file);
  element.download = `twitter-notes_${formattedDate}.json`;

  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}



const Popup = () => {

  return (
    <div class="flex flex-col items-center justify-evenly h-full">

      <button
        class={`px-4 py-2 twitter-blue-bg text-white font-semibold rounded-3xl`}
        onClick={() => {
          window.open(chrome.runtime.getURL("src/pages/importpopup/index.html"), "_blank");
        }}
      >
        Import
      </button>


      <button
        class={`px-4 py-2 twitter-blue-bg text-white font-semibold rounded-3xl`}
        onClick={async () => {
          const storage = await getLocalForage()

          const notes: Record<string, SavedNote> = {}

          await storage.iterate(function (value: any, key, iterationNumber) {
            if (typeof value.name === 'string' && typeof value.note === 'string' && typeof value.handle === 'string') {
              notes[key] = value
            }
          })

          downloadFile(notes)
        }}
      >
        Export
      </button>
    </div>
  );
};

export default Popup;
