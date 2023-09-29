import { createEffect, createSignal } from "solid-js";

const [currentTwitterProfile, setCurrentTwitterProfile] = createSignal<{ id: string, name: string, handle: string, thumbnailURL: string} | null>(null);

createEffect(() => {
    const observer = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (let addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE &&
                        (addedNode as Element).tagName === 'SCRIPT' &&
                        (addedNode as Element).getAttribute('type') === 'application/ld+json') {

                        const newData = JSON.parse(addedNode.textContent);

                        const author = newData?.author;

                        if (author) {
                            setCurrentTwitterProfile({ id: author.identifier, name: author.givenName, handle: author.additionalName, thumbnailURL: author.image.thumbnailUrl })
                        }
                    }
                }
            }
        }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.head, { childList: true, subtree: true });

})

export { currentTwitterProfile }