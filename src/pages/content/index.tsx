
import { render } from "solid-js/web";
import App from "./components/Notes";
import Modal from "./components/Modal";
import { setModal } from "@src/signals/modalSignal";
import { createEffect } from "solid-js";
import { currentTwitterProfile } from "@src/signals/twitterID";
import "@src/styles/index.css";
import { themeColor } from "@src/signals/color";

function matchesRule(element, rule) {
    // Check if the rule's selector applies to the element
    return Array.from(document.querySelectorAll(rule.selectorText)).includes(element);
}

function hasFlexDirectionRow(element) {
    for (let sheet of Array.from(document.styleSheets)) {
        try {
            for (let rule of sheet.cssRules as any as CSSStyleRule[]) {
                if (matchesRule(element, rule) && rule.style && rule.style.flexDirection === 'row') {
                    return true;
                }
            }
        } catch (error) {
            return false
        }
    }
    return false;
}

function findClosestParentWithFlexRow(element) {
    if (!element || element === document.body) return null; // Base case

    if (hasFlexDirectionRow(element)) {
        return element;
    } else {
        return findClosestParentWithFlexRow(element.parentElement); // Recursive call
    }
}


function waitForElement(selector: string | string[], timeout = 30000): Promise<HTMLElement> {
    const selectors = typeof selector === 'string' ? [selector] : selector
    return new Promise((resolve, reject) => {
        const found: HTMLElement[] = selectors.map(selector => document.querySelector(selector))

        if (found.some(f => !!f)) {
            return resolve(found.find(f => !!f));
        }

        const observer = new MutationObserver(mutations => {
            const found: HTMLElement[] = selectors.map(selector => document.querySelector(selector))

            if (found.some(f => !!f)) {
                resolve(found.find(f => !!f));
                observer.disconnect();
            }


        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error('Timeout waiting for element'));
        }, timeout);
    });
}



async function attachContent(slug = null) {
    console.trace()
    if (Array.from(document.getElementsByClassName('twitter-notes')).length > 0) {
        return
    }

    let urlSlug

    if (!slug) {
        // get the path from the current URL
        let path = window.location.pathname;

        // trim and split the path by the slashes
        let parts = path.split('/').filter(part => part.trim() !== '');

        // check if there's a single slug
        urlSlug = parts[0];
    } else {
        urlSlug = slug
    }

    await waitForElement([`[href="/${urlSlug}/followers"]`, `[href="/${urlSlug}/verified_followers"]`])

    // Find the follower count element by its text
    const potentialElements = Array.from(document.querySelectorAll("*"))
        .filter(element => element.textContent.match(/(\d+,?\d*\.?\d*[KMBT]?) Followers/));

    // Step 2: Filter out any element that has a child which also matches the pattern
    const followerCountElements = potentialElements.filter(element => {
        return !Array.from(element.querySelectorAll("*"))
            .some(child => child.textContent.match(/(\d+,?\d*\.?\d*[KMBT]?) Followers/));
    });

    // Find the closest parent with 'flex-direction: row;' CSS
    const targetElements = followerCountElements.map(el => findClosestParentWithFlexRow(el))

    if (targetElements.length === 1) {

        let div = document.createElement('div')
        div.className = 'twitter-notes'
        targetElements[0].parentElement.appendChild(div)

        render(App, div);
    }


}

createEffect(() => {
    const user = currentTwitterProfile()

    if (user) {
        attachContent(user.handle);
    }
})

createEffect(() => {
    const theme = themeColor()

    if(theme == 'LIGHT'){
        document.body.style.setProperty('--main-color', 'black');
        document.body.style.setProperty('--main-background-color', 'white');

    }else {
        document.body.style.setProperty('--main-color', 'white');
        document.body.style.setProperty('--main-background-color', 'black');
    }
})


function attachModal() {
    const modalContainer = document.createElement('div');
    document.body.appendChild(modalContainer)

    render(Modal, modalContainer);
}

if (document.readyState !== 'loading') {
    attachModal();
} else {
    document.addEventListener('DOMContentLoaded', attachModal);
}

document.addEventListener('keydown', async function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setModal('SEARCH')
    }

    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'E') {
        setModal('EDIT')
    }
});