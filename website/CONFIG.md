# Dynamic Configuration Guide

## Adding Projects

Edit `public/data/projects.json` to add new projects. Each project should have:

```json
{
  "id": 4,
  "title": "Project Title",
  "description": "Project description",
  "technologies": ["Tech1", "Tech2", "Tech3"],
  "link": "https://example.com",
  "color": "#646cff"
}
```

**Fields:**
- `id`: Unique number
- `title`: Project name
- `description`: Short description
- `technologies`: Array of tech stack items
- `link`: URL to the project (optional)
- `color`: Hex color for styling

## Adding Pages

Edit `public/data/pages.json` to create new pages. Example:

```json
[
  {
    "id": "home",
    "name": "Home",
    "sections": ["hero", "projects", "contact"]
  },
  {
    "id": "about",
    "name": "About",
    "sections": ["hero", "contact"]
  }
]
```

**Available sections:** `hero`, `projects`, `contact`

**To add a new section type:**
1. Create the component in `src/components/`
2. Export it with a default export
3. Add it to the `sectionComponents` object in `src/App.tsx`
4. Add the section ID to the `pages.json` sections array

## Current Structure

- `public/data/projects.json` - Project data
- `public/data/pages.json` - Page configuration
- `src/App.tsx` - Dynamic page renderer
- `src/components/Projects.tsx` - Dynamically loads from projects.json
