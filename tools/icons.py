"""Redraws the dashboard's 32px-only icons as SVGs (site/assets/images/<dir>/ico_<name>.svg) in the console's
icon style: translucent white body (takes the background colour like the originals), dark drop shadow down-right, soft white shine. Run: python3 tools/icons.py"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / 'site/assets/images'

DEFS = '''<defs>
<linearGradient id="f" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".55" stop-color="#f2f2f2" stop-opacity=".7"/><stop offset="1" stop-color="#ddd" stop-opacity=".55"/></linearGradient>
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="d" x="-20%" y="-20%" width="150%" height="150%"><feDropShadow dx="1.6" dy="2" stdDeviation=".9" flood-color="#000" flood-opacity=".45"/></filter>
</defs>'''

# each icon: body (drawn with the gradient + shadow), optional shine (drawn over it), optional cut (holes, drawn darker)
LOCK = '<rect x="38" y="40" width="20" height="16" rx="3"/><path d="M42 41v-6a6 6 0 0 1 12 0v6h-3.5v-6a2.5 2.5 0 0 0-5 0v6z"/>'
PAD = '<path d="M26 40c3-3 8-3 11-1h10c3-2 8-2 11 1l3 12c1 4-3 6-6 3l-4-4H33l-4 4c-3 3-7 1-6-3z"/>'
ICONS = {
  'gamesbla/ico_demos': dict(
    body='<path fill-rule="evenodd" d="M32 6a26 26 0 1 1 0 52a26 26 0 1 1 0-52zm0 20a6 6 0 1 0 0 12a6 6 0 1 0 0-12z"/>',
    shine='<path d="M12 22a22 22 0 0 1 14-12l3 13a8 8 0 0 0-4 4z"/>',
    extra='<path d="M32 10a22 22 0 0 1 0 44" fill="none" stroke="#fff" stroke-width="3.5" stroke-dasharray="5 3.5"/>'),
  'dashmain/ico_console': dict(
    body='<path fill-rule="evenodd" d="M20 4h24q-3 28 0 56H20q3-28 0-56zm12 30a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9z"/>',
    shine='<path d="M22 6h8q-2 26 0 52h-6q2-26-2-52z"/>'),
  'dashmain/ico_network': dict(
    body='<path d="M16 42Q8 26 26 14l2 3Q14 27 20 41zM24 48q14 6 26-6l3 2Q39 59 22 51zM34 12q14-2 18 12l-4 1Q45 15 34 16z"/>'
         '<circle cx="28" cy="13" r="8"/><circle cx="51" cy="33" r="9"/><circle cx="15" cy="47" r="10"/>',
    shine='<circle cx="26" cy="11" r="4"/><circle cx="49" cy="30" r="4.5"/><circle cx="12" cy="44" r="5"/>'),
  'dashcomm/ico_Eject': dict(
    body='<path d="M30 14v36L10 32z"/><rect x="38" y="12" width="10" height="40" rx="2"/>',
    shine='<path d="M27 19v10H16z"/><rect x="40" y="14" width="4" height="18" rx="2"/>'),
  'gamesbla/ico_arcade': dict(
    body='<circle cx="22" cy="14" r="9"/><path d="M19 20h6l2 22h-10z"/><path d="M8 42l44-6q3 0 3 3l1 10q0 3-3 3L12 58q-3 0-3-3z"/>',
    shine='<circle cx="20" cy="11" r="4.5"/><path d="M11 44l40-5 1 4-40 6z"/>'),
  'shrdres/ico_Mail': dict(
    body='<path d="M6 22l46-12q3-1 4 2l5 26q1 3-2 4L13 54q-3 1-4-2L4 26q-1-3 2-4z"/>',
    shine='<path d="M7 24l48-12-22 22z"/>',
    extra='<path d="M7 24l25 14 26-26" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linejoin="round"/>'),
  'dashmain/ico_parentalControl': dict(
    body='<circle cx="22" cy="12" r="9"/><path d="M8 26q14-4 28 0l-2 30H14z"/><circle cx="38" cy="24" r="6"/><path d="M30 33q8-3 16 0l-1 12H31z"/>',
    shine='<circle cx="20" cy="10" r="4.5"/><path d="M11 28q11-3 22 0l-1 8H12z"/>',
    extra=f'<g fill="url(#f)" stroke="#fff" stroke-width="1.5" filter="url(#d)">{LOCK}</g>'),
  'dashmain/ico_systemSet': dict(
    body='<path fill-rule="evenodd" d="M10 4h16q-2 22 0 46H10q2-24 0-46zm8 22a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z"/>' + PAD,
    shine='<path d="M12 6h6q-1 20 0 40h-4q1-20-2-40z"/><path d="M28 42c3-2 7-2 9-1h10c3-1 7-1 9 1l1 4H27z"/>'),
}

for name, ic in ICONS.items():
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"{" opacity=" + chr(34) + ic["opacity"] + chr(34) if "opacity" in ic else ""}>{DEFS}'
           f'<g fill="url(#f)" filter="url(#d)">{ic["body"]}</g>'
           f'<g fill="url(#s)">{ic.get("shine", "")}</g>{ic.get("extra", "")}</svg>\n')
    (ROOT / f'{name}.svg').write_text(svg)
    print(name)
