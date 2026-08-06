import os
from typing import Dict, Any

class SEOTemplateEngine:
    @staticmethod
    def render_template(template_str: str, context: Dict[str, Any]) -> str:
        if not template_str:
            return ""
        rendered = template_str
        for key, value in context.items():
            placeholder = f"{{{key}}}"
            rendered = rendered.replace(placeholder, str(value or ""))
        return rendered

    @classmethod
    def generate_meta_for_landing(cls, category: str, city: str, area: str = None, total_count: int = 0) -> Dict[str, Any]:
        cat_title = category.replace('-', ' ').title() if category else "Businesses"
        city_title = city.replace('-', ' ').title() if city else "Trichy"
        area_title = f", {area.replace('-', ' ').title()}" if area else ""

        title = f"Top {total_count or '10+'} Best {cat_title} in {city_title}{area_title} | Ratings, Phone & Reviews - BizDial"
        description = (
            f"Find the best {cat_title} in {city_title}{area_title}. Compare top rated listings, "
            f"view addresses, contact numbers, customer reviews, ratings, and instant quotes on BizDial."
        )
        heading = f"Top {cat_title} in {city_title}{area_title}"
        
        faqs = [
            {
                "question": f"How to find the best {cat_title} in {city_title}?",
                "answer": f"Browse BizDial to view verified listings of {cat_title} in {city_title} sorted by user reviews, ratings, and popularity."
            },
            {
                "question": f"What are the typical charges for {cat_title} in {city_title}?",
                "answer": f"Pricing varies depending on the specific service or product. Contact the listed {cat_title} directly via phone or WhatsApp for quotes."
            }
        ]

        return {
            "title": title,
            "description": description,
            "heading": heading,
            "faqs": faqs,
            "canonical": f"/search?category={category}&city={city}" + (f"&area={area}" if area else "")
        }
