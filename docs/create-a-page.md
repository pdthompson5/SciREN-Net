# Pages in Next.js
Next.js makes it easy to create and organize pages by holding them all under the `src/pages/` directory. Adding a new page file like `mypage.tsx` to this folder creates a URL route on the website under `https:://oursitename.com/mypage`. With a couple simple functions and a bite sized chunk of HTML, creating and iterating over page structure is really simple.

We're all figuring this out as we go, so this doc is less of a comprehensive guide and more of a shared notepad on how this stack works.

## What a page needs
To render HTML on this page, your file should have a default export function that returns a JSX element (see an example in `profile.tsx`), which is also a react component. These are both essential pieces of the site that we'll become excruciatingly familiar.

The `Next.Head` component determines metadata for the webpage like title, icon, viewport, and information for webcrawlers (i think).


## Styling and Format
Link css file by creating it with the format `{StyleName}.module.css` and importing it. 

