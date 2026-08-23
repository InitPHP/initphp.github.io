# src/icons

`astro-icon` looks here for local SVG icons, referenced in components by their bare
filename (e.g. `<Icon name="my-icon" />`). This directory is empty because every icon
this project uses comes from the pinned `@iconify-json/fa6-solid` and
`@iconify-json/fa6-brands` icon sets instead. It exists only so `astro-icon` finds a
real directory to scan, keeping the build output free of its "directory not found"
warning.
