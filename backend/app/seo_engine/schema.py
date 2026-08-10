import os
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

class JSONLDSchemaBuilder:
    @staticmethod
    def build_local_business_schema(business_data: Dict[str, Any], base_url: Optional[str] = None) -> Dict[str, Any]:
        if base_url is None:
            base_url = os.getenv("FRONTEND_URL", "").rstrip("/")
        
        path_url = f"/business/{business_data.get('id')}"
        full_url = f"{base_url}{path_url}" if base_url else path_url
        logo_url = business_data.get("logo_url") or (f"{base_url}/default-logo.png" if base_url else "/default-logo.png")

        return {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": business_data.get("business_name"),
            "image": logo_url,
            "@id": full_url,
            "url": full_url,
            "telephone": business_data.get("phone") or "",
            "priceRange": "₹₹",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": business_data.get("address") or "",
                "addressLocality": business_data.get("city") or "Trichy",
                "postalCode": business_data.get("pincode") or "",
                "addressCountry": "IN"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": str(business_data.get("average_rating") or 4.5),
                "reviewCount": str(business_data.get("total_reviews") or 1)
            }
        }

    @staticmethod
    def build_breadcrumb_schema(items: List[Dict[str, str]], base_url: Optional[str] = None) -> Dict[str, Any]:
        if base_url is None:
            base_url = os.getenv("FRONTEND_URL", "").rstrip("/")
        list_items = []
        for idx, item in enumerate(items, start=1):
            url = item.get('url', '')
            full_item_url = f"{base_url}{url}" if base_url else url
            list_items.append({
                "@type": "ListItem",
                "position": idx,
                "name": item.get("name"),
                "item": full_item_url
            })
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": list_items
        }

    @staticmethod
    def build_faq_schema(faqs: List[Dict[str, str]]) -> Dict[str, Any]:
        main_entity = []
        for faq in faqs:
            main_entity.append({
                "@type": "Question",
                "name": faq.get("question"),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.get("answer")
                }
            })
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": main_entity
        }
