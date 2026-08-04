from typing import Dict, Any

class SearchRankingEngine:
    @staticmethod
    def calculate_ranking_score(business: Any) -> float:
        """
        Ranking Score Formula:
        Score = Rating (0-5 * 20) + Reviews Count (capped at 50) + Premium Bonus (30) 
                + Verification Bonus (20) + Profile Completion (0-20)
        """
        score = 0.0
        
        # Rating contribution (0 - 100 pts)
        rating = getattr(business, 'average_rating', 0) or 0
        score += float(rating) * 20.0

        # Review count contribution (max 50 pts)
        reviews = getattr(business, 'total_reviews', 0) or 0
        score += min(float(reviews) * 2.0, 50.0)

        # Verification Status (20 pts)
        if getattr(business, 'is_verified', False):
            score += 20.0

        # Approval Status (10 pts)
        if getattr(business, 'approval_status', '') == 'Approved':
            score += 10.0

        # Profile Completeness (0-20 pts)
        completion_score = 0
        fields_to_check = ['phone', 'whatsapp', 'address', 'city', 'pincode', 'description', 'website', 'logo_url']
        for field in fields_to_check:
            if getattr(business, field, None):
                completion_score += 2.5
        score += completion_score

        return round(score, 2)
