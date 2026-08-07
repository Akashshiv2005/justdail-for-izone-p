import re
import urllib.request
from typing import Tuple, Optional

def extract_coordinates_from_url(url: str) -> Optional[Tuple[float, float]]:
    if not url:
        return None
        
    def extract_from_string(s: str) -> Optional[Tuple[float, float]]:
        match = re.search(r'@([-.\d]+),([-.\d]+)', s)
        if match:
            try:
                return float(match.group(1)), float(match.group(2))
            except ValueError:
                return None
        return None

    coords = extract_from_string(url)
    if coords:
        return coords
        
    # Try to resolve short URL
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        res = urllib.request.urlopen(req, timeout=5)
        resolved_url = res.url
        return extract_from_string(resolved_url)
    except Exception as e:
        return None
