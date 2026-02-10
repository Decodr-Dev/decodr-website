# Decodr Website

The official marketing website for the [Decodr Chrome Extension](https://chromewebstore.google.com/detail/decodr-notebooklm-power-t/llpbgcbafdoncakinkecfinjadhnngag).

Decodr enhances Google's NotebookLM with essential organization tools like folders, tags, and bulk imports.

## Features

- **Folders & Tags:** Group notebooks by project or topic.
- **Bulk Imports:** Import YouTube playlists, multiple PDFs, and more.
- **Prompt Library:** Save and reuse your best prompts.
- **Privacy First:** Runs locally in your browser.

## Built With

- **HTML5 & CSS3** (Vanilla, modern features)
- **JavaScript** (ES6+, no frameworks)
- **Vercel** (Hosting)

## Development

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/decodr-website.git
    ```
2.  Open `index.html` in your browser or use a local server:
    ```bash
    npx http-server .
    ```

## Deployment (Netlify)

Your site is hosted on **Netlify**. It is connected to your GitHub repository.

### How to Update the Website
Whenever you make changes to the code, simply push them to GitHub. Netlify will detect the changes and automatically redeploy the site.

Run these commands in your terminal:

```bash
# 1. Stage all changes
git add .

# 2. Commit the changes (replace the message with your own)
git commit -m "Describe your changes here"

# 3. Push to GitHub -> Triggers Netlify Deploy
git push
```

Your site will update in about 15-30 seconds.
