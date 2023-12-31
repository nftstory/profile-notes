# Profile Notes

Profile Notes is web browser extension that adds searchable offline notes to X/Twitter profiles.

## Getting Started

1. Install extension (Drag directory or zip into Extensions settings page. You may have to turn Developer mode turned on)
2. Go to a profile on X/Twitter
3. Click the notepad icon below the profile bio
4. Enter and save a note
5. Type `cmd+k` to open the search modal and search through your notes

## Import/Export

Export notes to save a backup. Import notes to restore a backup or to import notes from another browser.

1. Click the Extension icon in the browser toolbar.
2. Import / Export notes database file (`.json`).

## Building from source

1. Clone this repo 
2. Run `pnpm i`
3. Run `pnpm vite build`
4. The `dist/` directory will contain the built extension. You can drag this into your browser's Extensions settings page.

## Keyboard Shortcuts

### Anywhere

`cmd+k` : Open search modal

### Inside search

`cmd+k` / arrowup : select result above

`cmd+j` / arrowdown : select result below

`enter` : go to selected profile

### On a profile

`cmd+shift+e` : Edit profile note

`cmd+enter` : save note

`escape` : close modal

## Bugs

Please report bugs via this Github's Issues page.

## Credit

A public good by nftstory.

- Product architecture + sponsorship by https://x.com/nnnnicholas
- Developed by https://github.com/thomasgauthier
