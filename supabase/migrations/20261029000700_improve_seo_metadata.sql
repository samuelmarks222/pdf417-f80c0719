alter table public.site_settings
  alter column meta_title set default 'PDF417 Barcode Generator | AAMVA & U.S. States',
  alter column meta_description set default 'Generate PDF417 and Code 128 barcode previews for AAMVA and U.S. state formats. Review fields, export PNGs, and test barcode data online.',
  alter column meta_keywords set default 'PDF417 barcode generator, AAMVA barcode generator, driver''s license barcode, US driver license barcode, state barcode formats, PDF417 barcode preview, Code 128 generator, barcode testing tool',
  alter column hero_description set default 'Create PDF417 barcode previews for AAMVA and U.S. state formats. Review your fields, explore state-specific formats, and export a PNG for educational and testing use.';

update public.site_settings
set meta_title = 'PDF417 Barcode Generator | AAMVA & U.S. States',
    meta_description = 'Generate PDF417 and Code 128 barcode previews for AAMVA and U.S. state formats. Review fields, export PNGs, and test barcode data online.',
    meta_keywords = 'PDF417 barcode generator, AAMVA barcode generator, driver''s license barcode, US driver license barcode, state barcode formats, PDF417 barcode preview, Code 128 generator, barcode testing tool',
    hero_description = 'Create PDF417 barcode previews for AAMVA and U.S. state formats. Review your fields, explore state-specific formats, and export a PNG for educational and testing use.',
    updated_at = now()
where id = 1
  and meta_title = 'PDF417 Barcode Generator for USA & Canada | PDF417.PRO'
  and meta_description = 'Create, preview, and download PDF417 barcode images for USA and Canada workflows. Explore available U.S. state formats and generate Code 128 barcodes for free.';
