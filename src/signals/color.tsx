import { createMemo, createSignal } from "solid-js";

const [cssThemeColor, setCssThemeColor] = createSignal("");

const themeColor = createMemo(() => {
    const color = cssColorToRgbObject(cssThemeColor() || '#ffffff')

    if (color.r == 255 && color.g == 255 && color.b == 255) {
        return 'LIGHT';
    } else {
        return 'DARK'
    }

})

// Function to get computed background color of body
function getComputedBackgroundColor() {
    return window.getComputedStyle(document.body).backgroundColor;
}


function cssColorToRgbObject(cssColor) {
    // Removing spaces and converting to lowercase for uniformity
    cssColor = cssColor.toLowerCase().trim();

    // Handle rgb and rgba formats
    if (cssColor.startsWith('rgb')) {
        const match = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (match) {
            return {
                r: parseInt(match[1], 10),
                g: parseInt(match[2], 10),
                b: parseInt(match[3], 10)
            };
        }
    }
    // Handle hexadecimal format
    else if (cssColor.startsWith('#')) {
        const hex = cssColor.substring(1);
        if (hex.length === 3 || hex.length === 6) {
            const r = hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2);
            const g = hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4);
            const b = hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6);
            return {
                r: parseInt(r, 16),
                g: parseInt(g, 16),
                b: parseInt(b, 16)
            };
        }
    }

    // Return null if the format is not recognized
    return null;
}

setCssThemeColor(getComputedBackgroundColor())
// Store the initial computed background color

// Function to check and log if the background color has changed
function checkForBackgroundColorChange() {
    const newBackgroundColor = getComputedBackgroundColor();
    if (newBackgroundColor !== cssThemeColor()) {
        console.log('Background color changed to', newBackgroundColor);
        setCssThemeColor(newBackgroundColor)
    }
}

// Create a MutationObserver to observe changes and check the background color
const observer = new MutationObserver(checkForBackgroundColorChange);

// Start observing the body element for attribute modifications
observer.observe(document.body, {
    attributes: true, // observe attributes
    attributeFilter: ['style'], // specifically, the style attribute
    subtree: true, // also, observe the subtree
});

// Start observing the head element for childList modifications
observer.observe(document.head, {
    childList: true, // observe childList changes
    subtree: true, // also, observe the subtree
});



export { themeColor }