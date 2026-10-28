alter table public.site_settings
  alter column meta_title set default 'PDF417 Barcode Generator for USA & Canada | PDF417.PRO',
  alter column meta_description set default 'Create, preview, and download PDF417 barcode images for USA and Canada workflows. Explore available U.S. state formats and generate Code 128 barcodes for free.',
  alter column meta_keywords set default 'PDF417 barcode generator, USA PDF417, Canada PDF417, barcode generator, Code 128',
  alter column hero_badge set default 'PDF417 BARCODE GENERATOR · USA & CANADA',
  alter column hero_title set default 'PDF417 barcode generator',
  alter column hero_highlight set default 'for USA & Canada.',
  alter column hero_description set default 'Create and download PDF417 barcode previews for USA and Canada workflows. Explore available U.S. state formats, review your barcode, and export a PNG.';

update public.site_settings
set meta_title = 'PDF417 Barcode Generator for USA & Canada | PDF417.PRO',
    meta_description = 'Create, preview, and download PDF417 barcode images for USA and Canada workflows. Explore available U.S. state formats and generate Code 128 barcodes for free.',
    meta_keywords = 'PDF417 barcode generator, USA PDF417, Canada PDF417, barcode generator, Code 128',
    hero_badge = 'PDF417 BARCODE GENERATOR · USA & CANADA',
    hero_title = 'PDF417 barcode generator',
    hero_highlight = 'for USA & Canada.',
    hero_description = 'Create and download PDF417 barcode previews for USA and Canada workflows. Explore available U.S. state formats, review your barcode, and export a PNG.',
    updated_at = now()
where id = 1
  and hero_title = 'Build, preview, and download'
  and hero_highlight = 'in one place.'
  and hero_description = 'A focused workspace for creating PDF417 and Code 128 barcodes with state-aware fields, useful helpers, and clear credit controls.';
