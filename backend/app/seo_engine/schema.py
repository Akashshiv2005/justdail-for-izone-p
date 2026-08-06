from typing import Dict, Any, List

class JSONLDSchemaBuilder:
    @staticmethod
    def build_local_business_schema(business_data: Dict[str, Any], base_url: str = "http://localhost:5173") -> Dict[str, Any]:
        return {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": business_data.get("business_name"),
            "image": business_data.get("logo_url") or f"{base_url}/default-logo.png",
            "@id": f"{base_url}/business/{business_data.get('id')}",
            "url": f"{base_url}/business/{business_data.get('id')}",
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
    def build_breadcrumb_schema(items: List[Dict[str, str]], base_url: str = "http://localhost:5173") -> Dict[str, Any]:
        list_items = []
        for idx, item in enumerate(items, start=1):
            list_items.append({
                "@type": "ListItem",
                "position": idx,
                "name": item.get("name"),
                "item": f"{base_url}{item.get('url')}"
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
