# FIRECYCLE — Image & EO Provenance Policy

## Rule
No image may be presented as representing Pinofranqueado–Las Hurdes unless its geographic and temporal provenance is explicit. Generic/stock photography is excluded from C1/C3 operational views.

## Current approved visual sources
- NASA EOSDIS GIBS WMS — date-specific NOAA-20 VIIRS Corrected Reflectance True Color.
- NASA EOSDIS GIBS WMS — date-specific NOAA-20 VIIRS Thermal Anomalies 375 m overlay.
- Copernicus Data Space STAC — Sentinel-2 L2A item discovery for PRE/POST selection.

## Truth-state rules
- `OBSERVED`: the dated EO visualization or catalogue item is returned by the named remote-sensing service.
- `VERIFIED`: requires a reproducible reference or retained artifact plus provenance/checksum registered in M02.
- `CALCULATED`: requires a reproducible derived-product pipeline, e.g. NBR/dNBR, with parent evidence IDs and processing metadata.
- `HOLD`: any perimeter, hotspot coordinate list, severity class, DEMO geometry, hydrology/Natura intersection or other spatial assertion without an incorporated authoritative source.

## Removed
Generic Unsplash/stock images and simulated cartographic overlays have been removed from the C1/C3 operational experience.

## Pending exact fire chronology
Historical NASA FIRMS CSV ingestion for 18–21 August 2026 with `latitude`, `longitude`, `acq_date`, `acq_time`, `satellite`, `instrument`, `confidence`, `frp`, `daynight` and version. MAP_KEY must not be committed to this public repository.
