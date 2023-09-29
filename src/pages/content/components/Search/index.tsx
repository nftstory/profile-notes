import { modal } from "@src/signals/modalSignal"
import { search, getLocalForage } from "@src/utils"
import { createEffect, createSignal } from "solid-js"
import Mark from 'mark.js';
import styles from "./Search.module.css";
import { themeColor } from "@src/signals/color";

type SearchResult = Awaited<ReturnType<typeof search>>;

function highlightRange(domElement, start, end) {
    const markInstance = new Mark(domElement);

    markInstance.markRanges([{
        start: start,
        length: (end + 1) - start
    }], {
        "element": "span",
        "className": "notes-search-highlight",
    });
}

export default () => {

    const [query, setQuery] = createSignal("")
    const [results, setResults] = createSignal<SearchResult>([])
    const [selection, setSelection] = createSignal(-1)

    let data = []

    createEffect(async () => {
        if (modal() == 'SEARCH') {
            const storage = await getLocalForage()

            const notes = []

            await storage.iterate(function (value: any, key, iterationNumber) {
                if (typeof value.name === 'string' && typeof value.note === 'string' && typeof value.handle === 'string') {
                    notes.push({ author: value.name, text: value.note, handle: value.handle, thumbnailURL: value.thumbnailURL })
                }
            })

            data = notes
        }
    })

    createEffect(async () => {
        const q = query();
        const results = await search(data, q);
        setResults(results)
        setSelection(0)
    })

    let myRef;

    createEffect(() => {
        if (modal()) {
            if (myRef) {
                myRef.focus()
            }
        }
    })

    const resultsRefs = []
    const authorsRefs = []
    const notesRefs = []

    createEffect(() => {
        const res = results()

        res.forEach((e, i) => {
            e.matches.forEach(({ indices, key }) => {
                indices.forEach(([start, end]) => {
                    if ((start != end)) {
                        if (key === 'author' && authorsRefs[i]) {
                            highlightRange(authorsRefs[i], start, end)
                        }

                        if (key === 'text' && notesRefs[i]) {
                            highlightRange(notesRefs[i], start, end)
                        }
                    }
                })
            })
        })
    })

    return (
        <div class="w-[36rem] main-background-color rounded-lg shadow-lg p-6 z-50">
            <input
                onInput={(e) => {
                    setQuery((e.target as HTMLInputElement).value)
                }}
                onKeyPress={(event) => {
                    if (event.key == 'Enter') {
                        const selected = resultsRefs.find(ref => ref && ref.getAttribute('aria-selected') == 'true')

                        if (selected) {
                            selected.click()
                        }
                    }
                }}
                onKeyDown={(event) => {

                    const moveUp = () => {
                        const currentSelection = selection()

                        event.preventDefault();
                        event.stopPropagation()
                        setSelection((currentSelection - 1 + results().length) % results().length)
                    }

                    const moveDown = () => {
                        const currentSelection = selection()

                        event.preventDefault();
                        event.stopPropagation()
                        setSelection((currentSelection + 1) % results().length)
                    }


                    if ((event.metaKey || event.ctrlKey)) {
                        const currentSelection = selection()

                        if (event.key == 'k') {
                            moveDown()
                        }

                        if (event.key == 'j') {
                            moveUp()
                        }
                    }

                    if (event.key == 'ArrowUp') {
                        moveUp()
                    }

                    if (event.key == 'ArrowDown') {
                        moveDown()
                    }
                }}
                ref={myRef}
                style={`background-color: ${themeColor() == 'LIGHT' ? '#eff3f4' : '#25282d'}; line-height: 2.5`}
                class="w-full rounded-xl main-text-color pl-1"
                placeholder="Search notes"
            ></input>

            <div class={`${styles.results} main-text-color overflow-y-auto max-h-[300px] overflow-x-hidden`}>

                {results().map((e, i) => {

                    let matches = e.matches;

                    return <a ref={(ref) => {
                        resultsRefs[i] = ref
                    }}
                        aria-selected={i == selection()}
                        href={`https://twitter.com/${e.item.handle}`}
                        class={`block rounded-lg p-2 mb-2 ${themeColor() === 'LIGHT' ? styles.light : styles.dark} ${styles.result} ${i == selection() ? styles.selectedResult : ''}`}>
                        <h2 ref={(ref) => {
                            authorsRefs[i] = ref
                        }} class="flex items-center">
                            <img src={e.item.thumbnailURL} alt={`${e.item.author}'s thumbnail`} class="w-8 h-8 rounded-full mr-2" />
                            {e.item.author}
                        </h2>
                        <div class="whitespace-pre text-sm" ref={(ref) => {
                            notesRefs[i] = ref
                        }}>
                            {e.item.text}
                        </div>
                    </a>
                })}
            </div>
        </div>
    );
}