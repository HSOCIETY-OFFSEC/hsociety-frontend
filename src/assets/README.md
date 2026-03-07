## Asset Rules

Use these conventions for all static assets in `src/assets`.

- Naming: lowercase kebab-case only (`example-image.png`).
- No spaces, no underscores, no mixed case.
- Keep one canonical filename per asset; avoid near-duplicates.
- Prefer WebP/AVIF for large images when quality allows.

## Folder Layout

- `services-images/`: service and landing service visuals.
- `why-choose-hsociety-images/`: landing "why choose us" visuals.
- `partners/`: partner logos.
- `brand-images/`: brand-specific imagery.
- `bootcamps/`: bootcamp and module emblems.
- `icons/`: UI and payment icons.

## Public vs Src

- Put files in `public/` only when they must be referenced by absolute URL (favicons, manifest icons, deployment files).
- Put all imported app images in `src/assets/`.

## Cleanup Checklist

- Remove orphan files not referenced by code.
- Remove empty directories.
- Update imports immediately when renaming files.
