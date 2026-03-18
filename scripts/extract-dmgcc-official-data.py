#!/usr/bin/env python3
"""Extract public hole data from https://dmgcc.org/golf into JSON.

Usage:
  python3 scripts/extract-dmgcc-official-data.py > /tmp/dmgcc-official.json
"""

from __future__ import annotations

import html
import json
import re
import urllib.request

URL = "https://dmgcc.org/golf"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"


def fetch() -> str:
    request = urllib.request.Request(URL, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", errors="ignore")


def clean_text(value: str) -> str:
    value = re.sub(r"<br\s*/?>", " ", value)
    value = re.sub(r"<[^>]+>", "", value)
    value = html.unescape(value).replace("\xa0", " ")
    value = " ".join(value.split())
    return value


def parse_section(section_html: str):
    blocks = re.findall(
        r'<div class="hole-wrap">(.*?)</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*\n\n<!-- End Mini-Page',
        section_html,
        re.S,
    )

    holes = []
    for block in blocks:
        number_match = re.search(r"<h2>Hole #(\d+)</h2>", block)
        par_match = re.search(r"<span>Par\s*(\d+)</span>", block)
        handicap_m_match = re.search(r"Handicap:\s*([^<]+)\(M\)", block)
        image_match = re.search(r'<img src="([^"]+getImage\.gif\?ID=\d+)"', block)

        if not (number_match and par_match and handicap_m_match and image_match):
            continue

        tees = dict(re.findall(r'<span class="(black|green|blue|gold)">([^<]+)</span>', block))
        paragraphs = re.findall(r"<p>(.*?)</p>", block, re.S)

        description = " ".join(clean_text(p) for p in paragraphs)
        description = description.replace("Hole Description", "").strip(" :")

        holes.append(
            {
                "number": int(number_match.group(1)),
                "par": int(par_match.group(1)),
                "handicap_m": int("".join(re.findall(r"\d+", handicap_m_match.group(1))) or 0),
                "tee_black_raw": tees.get("black", ""),
                "tee_green_raw": tees.get("green", ""),
                "tee_blue_raw": tees.get("blue", ""),
                "tee_gold_raw": tees.get("gold", ""),
                "image_url": image_match.group(1),
                "description": description,
            }
        )

    return sorted(holes, key=lambda hole: hole["number"])


def main():
    html_text = fetch()

    course_1_start = html_text.index('<div class="course-tour opt3 active" id="course-1">')
    course_2_start = html_text.index('<div class="course-tour opt3" id="course-2">')
    after_courses = html_text.index('<div class="card-panels opt4 has-video">')

    north_section = html_text[course_1_start:course_2_start]
    south_section = html_text[course_2_start:after_courses]

    print(
        json.dumps(
            {
                "source": URL,
                "north": parse_section(north_section),
                "south": parse_section(south_section),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
