from app.models.business_extras import Product, Service, GalleryImage, Lead, LeadStatus, Staff, StaffRole, Invoice
from app.models.review import Review
import sys
import random
import asyncio
import re
import os
from datetime import datetime, timedelta

from app.database import engine, SessionLocal, Base
from sqlalchemy.orm import Session

import app.models.business
import app.models.business_service_mapping
import app.models.testimonial
import app.models.subcategory
import app.models.review
import app.models.location
import app.models.verification_models
import app.models.user
import app.models.business_extras
import app.models.category
import app.models.seo_models
import app.models.brand
import app.models.category_keyword
import app.models.master_service
import app.models.business_category_mapping

from app.models.business_service_mapping import BusinessServiceMapping
from app.models.user import User, RoleEnum
from app.models.location import Country, State, District, City, Area, Locality, LocationSEO, LocationSlug, LocationKeyword
from app.models.seo_models import SEOKeyword, CitySEO, CategorySEO
from app.models.business import Business
from app.models.category_keyword import CategoryKeyword
from app.models.category import Category
from app.models.business_category_mapping import BusinessCategoryMapping
from app.models.subcategory import Subcategory
from app.models.master_service import MasterService
from app.auth_utils import get_password_hash

# ========================================
# seed_all.py
# ========================================

# 1. Drop all tables and recreate them to ensure a clean structured DB
print("Dropping existing tables and recreating them...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Database has been wiped clean. No dummy data was inserted.")

db = Session(bind=engine)

def seed_seed_all():
    # 2. Create Users
    admin = User(name="System Admin", email="admin@bizdial.com", hashed_password=get_password_hash("password123"), role=RoleEnum.admin)
    owner = User(name="Rajesh Kumar", email="owner@mobileplanet.com", hashed_password=get_password_hash("password123"), role=RoleEnum.owner)
    db.add_all([admin, owner])
    db.commit()

    # 3. Create Business
    biz = Business(
        owner_id=owner.id,
        business_name="Shree Mobile Store",
        category="Mobile Shop",
        description="Best mobile shop in town. Authorized dealer.",
        address="Opposite to GH, Puthur",
        city="Trichy",
        pincode="620017",
        is_verified=True,
        average_rating=4.8,
        total_reviews=420,
        phone="08128653822",
        whatsapp="08128653822",
        email="contact@shreemobiles.com",
        logo_url="https://images.unsplash.com/photo-1601784551446-20c9e07cdbfd?auto=format&fit=crop&q=80&w=200",
        approval_status="Approved"
    )
    db.add(biz)
    db.commit()

    # 4. Create Products
    products = [
        Product(business_id=biz.id, name="iPhone 15 Pro", category="Smartphones", price=120000.0, stock_quantity=15),
        Product(business_id=biz.id, name="Samsung Galaxy S24", category="Smartphones", price=95000.0, stock_quantity=20),
        Product(business_id=biz.id, name="AirPods Pro", category="Accessories", price=24000.0, stock_quantity=50),
        Product(business_id=biz.id, name="Silicone Phone Case", category="Accessories", price=500.0, stock_quantity=100)
    ]
    db.add_all(products)

    # 5. Create Services
    services = [
        Service(business_id=biz.id, name="Screen Replacement", duration="2 Hours", base_price=4500.0, popularity_score=95),
        Service(business_id=biz.id, name="Battery Replacement", duration="1 Hour", base_price=2500.0, popularity_score=80)
    ]
    db.add_all(services)

    # 6. Create Gallery
    gallery = [
        GalleryImage(business_id=biz.id, image_url="https://images.unsplash.com/photo-1556656793-08538906a9f8", title="Storefront", category="Exterior", views_count=1500),
        GalleryImage(business_id=biz.id, image_url="https://images.unsplash.com/photo-1601784551446-20c9e07cdbfd", title="Inside Shop", category="Interior", views_count=800)
    ]
    db.add_all(gallery)

    # 7. Create Leads
    leads = [
        Lead(business_id=biz.id, customer_name="Amit Singh", customer_phone="+91 9876543210", service_interest="Screen Repair", status=LeadStatus.pending),
        Lead(business_id=biz.id, customer_name="Priya Patel", customer_phone="+91 9876512345", service_interest="Buy iPhone", status=LeadStatus.contacted)
    ]
    db.add_all(leads)

    # 8. Create Staff
    staff = [
        Staff(business_id=biz.id, name="Vikram Verma", role=StaffRole.manager, email="vikram@shreemobiles.com", phone="9988776655"),
        Staff(business_id=biz.id, name="Rahul Sharma", role=StaffRole.technician, email="rahul@shreemobiles.com", phone="8877665544")
    ]
    db.add_all(staff)

    db.commit()
    print("Successfully seeded all dummy data from the dashboard into the Database!")


# ========================================
# seed_locations.py
# ========================================

def slugify(text):
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text

def seed_locations():
    db = Session(bind=engine)
    try:
        # 1. Country
        country = db.query(Country).filter(Country.slug == "india").first()
        if not country:
            country = Country(name="India", slug="india")
            db.add(country)
            db.commit()
            db.refresh(country)
            print("Seeded Country: India")

        # 2. State
        state = db.query(State).filter(State.slug == "tamil-nadu").first()
        if not state:
            state = State(name="Tamil Nadu", slug="tamil-nadu", country_id=country.id)
            db.add(state)
            db.commit()
            db.refresh(state)
            print("Seeded State: Tamil Nadu")

        # 3. 38 Districts of Tamil Nadu
        districts_list = [
            "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
            "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
            "Kanniyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
            "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
            "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
            "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
            "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvarur", "Tiruvannamalai",
            "Vellore", "Viluppuram", "Virudhunagar"
        ]

        districts_map = {}
        for d_name in districts_list:
            slug = slugify(d_name)
            d_obj = db.query(District).filter(District.slug == slug).first()
            if not d_obj:
                d_obj = District(name=d_name, slug=slug, state_id=state.id)
                db.add(d_obj)
                db.commit()
                db.refresh(d_obj)
            districts_map[d_name] = d_obj

        print(f"Seeded {len(districts_map)} Districts.")

        # 4. Cities and Areas per District
        # Trichy (Tiruchirappalli) special data
        trichy_district = districts_map["Tiruchirappalli"]
        
        trichy_cities = ["Trichy", "Srirangam", "Thiruverumbur", "Manapparai", "Lalgudi", "Thuraiyur", "Musiri"]
        trichy_areas = ["Thillai Nagar", "Cantonment", "Chathiram", "Woraiyur", "KK Nagar", "TVS Tolgate", "Edamalaipatti Pudur", "Puthur", "Golden Rock", "BHEL Township", "Palakkarai", "Melachinthamani", "Crawford", "Airport Area"]

        # Let's seed Trichy Cities and Areas
        for c_name in trichy_cities:
            c_slug = slugify(c_name)
            city_obj = db.query(City).filter(City.slug == c_slug, City.district_id == trichy_district.id).first()
            if not city_obj:
                city_type = "Major City" if c_name in ["Trichy", "Srirangam"] else "Municipality"
                city_obj = City(name=c_name, slug=c_slug, district_id=trichy_district.id, type=city_type)
                db.add(city_obj)
                db.commit()
                db.refresh(city_obj)

            # Seed areas under Trichy City
            if c_name == "Trichy":
                for a_name in trichy_areas:
                    a_slug = slugify(a_name)
                    area_obj = db.query(Area).filter(Area.slug == a_slug, Area.city_id == city_obj.id).first()
                    if not area_obj:
                        area_obj = Area(name=a_name, slug=a_slug, city_id=city_obj.id)
                        db.add(area_obj)
                        db.commit()

        # Seed other districts with dynamic standard major cities and areas
        for d_name, d_obj in districts_map.items():
            if d_name == "Tiruchirappalli":
                continue
            
            # Seed 1 Major City, 1 Municipality, 1 Town Panchayat
            cities_to_seed = [
                (d_name, "Major City"),
                (f"{d_name} Municipality", "Municipality"),
                (f"{d_name} Town", "Town Panchayat")
            ]
            for c_name, c_type in cities_to_seed:
                c_slug = slugify(c_name)
                city_obj = db.query(City).filter(City.slug == c_slug, City.district_id == d_obj.id).first()
                if not city_obj:
                    city_obj = City(name=c_name, slug=c_slug, district_id=d_obj.id, type=c_type)
                    db.add(city_obj)
                    db.commit()
                    db.refresh(city_obj)

                # Seed 2 popular areas under each city
                areas_to_seed = [
                    f"North {c_name}",
                    f"South {c_name}",
                    f"Market Area {d_name}"
                ]
                for a_name in areas_to_seed:
                    a_slug = slugify(a_name)
                    area_obj = db.query(Area).filter(Area.slug == a_slug, Area.city_id == city_obj.id).first()
                    if not area_obj:
                        area_obj = Area(name=a_name, slug=a_slug, city_id=city_obj.id)
                        db.add(area_obj)
                        db.commit()

        print("Seeded all Cities and Areas for all Districts.")

        # 5. Populate Location Slugs and SEO
        # Clear existing slugs and seo to generate clean entries
        db.query(LocationSlug).delete()
        db.query(LocationSEO).delete()
        db.commit()

        # Add State slug
        db.add(LocationSlug(slug="state/tamil-nadu", entity_type="state", entity_id=state.id))
        # Base SEO for State
        db.add(LocationSEO(
            entity_type="state",
            entity_id=state.id,
            seo_title="Verified Businesses and Services in Tamil Nadu | BizDial",
            meta_description="Find top-rated businesses, services, shops, and professionals in Tamil Nadu. Browse listings, view reviews, contact numbers, and maps on BizDial.",
            keywords="tamil nadu, businesses, services, shops, local search"
        ))

        # Add District slugs and SEO
        all_districts = db.query(District).all()
        for d in all_districts:
            d_slug = f"state/tamil-nadu/{d.slug}"
            db.add(LocationSlug(slug=d_slug, entity_type="district", entity_id=d.id))
            db.add(LocationSEO(
                entity_type="district",
                entity_id=d.id,
                seo_title=f"Best Businesses and Services in {d.name}, Tamil Nadu | BizDial",
                meta_description=f"Explore top local business listings in {d.name}, Tamil Nadu. Find contact info, ratings, and reviews of dentists, hotels, salons, and more on BizDial.",
                keywords=f"{d.name} business, {d.name} services, local directory"
            ))

        # Add Category & Location combination SEO pages
        categories = db.query(Category).all()
        # Fallback category names if empty
        category_list = [c.name for c in categories] if categories else ["Mobile Shops", "Restaurants", "Hospitals", "Hotels", "Electricians", "Plumbers", "Salons"]
        category_slugs = [slugify(c) for c in category_list]

        # For every category & district combo, and category & area combo
        all_cities = db.query(City).all()
        all_areas = db.query(Area).all()

        for c_idx, c_name in enumerate(category_list):
            c_slug = category_slugs[c_idx]
            
            # District level Category pages (using first city of the district as landing name)
            for d in all_districts:
                slug_str = f"{c_slug}/{d.slug}"
                db.add(LocationSlug(slug=slug_str, entity_type="category_district", entity_id=d.id, category_id=c_idx + 1))
                
                db.add(LocationSEO(
                    entity_type="category_district",
                    entity_id=d.id,
                    category_id=c_idx + 1,
                    seo_title=f"Best {c_name} in {d.name} | Top Rated Services - BizDial",
                    meta_description=f"Find the best {c_name.lower()} in {d.name}. Compare ratings, reviews, directions, products and business details on BizDial.",
                    keywords=f"{c_name.lower()} {d.name}, best {c_name.lower()} in {d.name}"
                ))

            # Area level Category pages (like mobile-shops/thillai-nagar-trichy)
            for a in all_areas:
                # Get parent city and district
                city_parent = db.query(City).filter(City.id == a.city_id).first()
                dist_parent = db.query(District).filter(District.id == city_parent.district_id).first() if city_parent else None
                
                slug_str = f"{c_slug}/{a.slug}"
                if city_parent:
                    slug_str += f"-{city_parent.slug}"
                
                db.add(LocationSlug(slug=slug_str, entity_type="category_area", entity_id=a.id, category_id=c_idx + 1))
                
                db.add(LocationSEO(
                    entity_type="category_area",
                    entity_id=a.id,
                    category_id=c_idx + 1,
                    seo_title=f"Best {c_name} in {a.name}, {dist_parent.name if dist_parent else ''} | BizDial",
                    meta_description=f"Find the best {c_name.lower()} in {a.name}, {dist_parent.name if dist_parent else ''}. Compare ratings, reviews, directions, products and business details on BizDial.",
                    keywords=f"{c_name.lower()} {a.name}, best {c_name.lower()} in {a.name}"
                ))

        db.commit()
        print("Seeded Location Slugs & SEO Page Metadata.")

        # 6. Map Businesses to correct districts, cities, and areas
        businesses = db.query(Business).all()
        for b in businesses:
            # Try to match city
            db_city = db.query(City).filter(City.name.ilike(f"%{b.city or ''}%")).first()
            if db_city:
                b.city_id = db_city.id
                b.district_id = db_city.district_id
                # Match area under this city
                if b.area:
                    db_area = db.query(Area).filter(Area.city_id == db_city.id, Area.name.ilike(f"%{b.area}%")).first()
                    if db_area:
                        b.area_id = db_area.id
            else:
                # Default fallback to Trichy
                trichy_c = db.query(City).filter(City.name == "Trichy").first()
                if trichy_c:
                    b.city_id = trichy_c.id
                    b.district_id = trichy_c.district_id
                    if b.area:
                        db_area = db.query(Area).filter(Area.city_id == trichy_c.id, Area.name.ilike(f"%{b.area}%")).first()
                        if db_area:
                            b.area_id = db_area.id

            b.state_id = state.id
            b.country_id = country.id
            
        db.commit()
        print("Successfully mapped all businesses to their correct Location Hierarchy nodes!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding locations: {e}")
    finally:
        db.close()


# ========================================
# seed_master_categories.py
# ========================================

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

CATEGORIES_DATA = [
    {
        "name": "Shopping",
        "subcategories": [
            {
                "name": "Mobile Shops",
                "services": ["Mobile Sales", "Mobile Repair", "Phone Exchange", "Accessories", "SIM Cards", "Recharge", "Tempered Glass", "Mobile Covers", "Battery Replacement", "Screen Replacement", "Software Update", "Warranty Support", "EMI Available", "Doorstep Repair"],
                "keywords": ["mobile shop", "mobile showroom", "iphone store", "cell phone shop", "android phones", "phone accessories", "mobile repair", "electronics", "smartphone store", "Samsung Dealer", "Apple Dealer", "OnePlus Store"]
            },
            {
                "name": "Laptop Stores",
                "services": ["Laptop Sales", "Laptop Repair", "RAM Upgrade", "SSD Upgrade", "Screen Replacement", "Motherboard Repair", "Data Recovery", "Antivirus Installation"],
                "keywords": ["laptop shop", "computer store", "macbook repair", "windows laptop", "gaming laptops", "dell dealer", "hp showroom", "lenovo store"]
            },
            {
                "name": "Electronics Stores",
                "services": ["TV Sales", "Refrigerator Sales", "AC Sales", "Washing Machine Sales", "Appliance Repair", "Home Theater Setup"],
                "keywords": ["electronics shop", "home appliances", "tv store", "ac dealer", "refrigerator shop", "washing machine dealer"]
            },
            {
                "name": "Furniture Stores",
                "services": ["Sofa Sales", "Bed Sales", "Dining Table Sales", "Office Furniture", "Custom Furniture", "Furniture Assembly", "Home Delivery"],
                "keywords": ["furniture shop", "wooden furniture", "office chair", "sofa set", "dining table", "bed showroom", "interior decoration"]
            },
            {
                "name": "Clothing Stores",
                "services": ["Men's Clothing", "Women's Clothing", "Kids Wear", "Custom Tailoring", "Alterations"],
                "keywords": ["clothing shop", "boutique", "fashion store", "mens wear", "womens clothing", "kids fashion", "ready made garments"]
            }
        ]
    },
    {
        "name": "Restaurants & Food",
        "subcategories": [
            {
                "name": "North Indian Restaurants",
                "services": ["Dine-in", "Takeaway", "Home Delivery", "Catering", "Party Orders", "Buffet"],
                "keywords": ["north indian food", "punjabi dhaba", "tandoori", "butter chicken", "naan", "curry house", "fine dining"]
            },
            {
                "name": "South Indian Restaurants",
                "services": ["Dine-in", "Takeaway", "Home Delivery", "Breakfast", "Meals", "Catering"],
                "keywords": ["south indian food", "dosa", "idli", "filter coffee", "meals", "andhra meals", "kerala food", "udupi hotel"]
            },
            {
                "name": "Fast Food",
                "services": ["Burgers", "Pizza", "Fried Chicken", "Drive-thru", "Takeaway", "Late Night Delivery"],
                "keywords": ["fast food", "burger joint", "pizza delivery", "french fries", "snacks", "quick bites"]
            },
            {
                "name": "Cafes",
                "services": ["Coffee", "Tea", "Bakery Items", "Free Wi-Fi", "Outdoor Seating", "Live Music"],
                "keywords": ["cafe", "coffee shop", "espresso", "cappuccino", "bakery", "pastries", "hangout spot"]
            }
        ]
    },
    {
        "name": "Healthcare",
        "subcategories": [
            {
                "name": "Hospitals",
                "services": ["Emergency Care", "ICU", "Surgery", "Maternity", "Pediatrics", "Cardiology", "Orthopedics", "Neurology", "Oncology", "Radiology", "Pharmacy", "Ambulance"],
                "keywords": ["hospital", "medical center", "multi specialty hospital", "clinic", "emergency room", "healthcare facility"]
            },
            {
                "name": "Clinics",
                "services": ["General Consultation", "Vaccination", "Health Checkup", "ECG", "Blood Test Collection"],
                "keywords": ["clinic", "doctor", "physician", "health clinic", "medical consultation", "checkup"]
            },
            {
                "name": "Pharmacies",
                "services": ["Prescription Drugs", "OTC Medicines", "Surgical Items", "Baby Care Products", "Home Delivery", "24/7 Service"],
                "keywords": ["pharmacy", "medical store", "chemist", "drug store", "medicines", "health supplements"]
            },
            {
                "name": "Diagnostic Centers",
                "services": ["Blood Test", "Urine Test", "X-Ray", "Ultrasound", "MRI Scan", "CT Scan", "Home Collection"],
                "keywords": ["diagnostic center", "pathology lab", "blood test lab", "x-ray clinic", "mri center", "ct scan", "health checkup package"]
            }
        ]
    },
    {
        "name": "Hotels & Travel",
        "subcategories": [
            {
                "name": "Hotels",
                "services": ["AC Rooms", "Non-AC Rooms", "Free Breakfast", "Wi-Fi", "Swimming Pool", "Gym", "Restaurant", "Room Service", "Laundry", "Parking"],
                "keywords": ["hotel", "lodge", "resort", "accommodation", "stay", "guest house", "luxury hotel", "budget hotel"]
            },
            {
                "name": "Travel Agents",
                "services": ["Flight Booking", "Train Ticketing", "Bus Booking", "Tour Packages", "Visa Assistance", "Passport Assistance", "Travel Insurance"],
                "keywords": ["travel agency", "tour operator", "flight tickets", "holiday packages", "vacation planner", "visa agent"]
            },
            {
                "name": "Car Rentals",
                "services": ["Local Outstation", "Self Drive", "With Driver", "Airport Drop", "Monthly Rental", "Luxury Cars"],
                "keywords": ["car rental", "taxi service", "cab booking", "rent a car", "travels", "outstation cab", "airport taxi"]
            }
        ]
    },
    {
        "name": "Beauty & Wellness",
        "subcategories": [
            {
                "name": "Beauty Parlours",
                "services": ["Haircut", "Hair Coloring", "Facial", "Manicure", "Pedicure", "Bridal Makeup", "Threading", "Waxing"],
                "keywords": ["beauty parlour", "salon", "hair salon", "makeup artist", "bridal makeup", "facial", "spa", "hair care"]
            },
            {
                "name": "Spas",
                "services": ["Body Massage", "Ayurvedic Massage", "Steam Bath", "Sauna", "Aromatherapy", "Foot Reflexology"],
                "keywords": ["spa", "massage center", "wellness center", "body massage", "ayurvedic spa", "relaxation"]
            },
            {
                "name": "Gyms",
                "services": ["Cardio Training", "Weight Training", "Personal Training", "Zumba", "Yoga", "Aerobics", "Nutrition Counseling"],
                "keywords": ["gym", "fitness center", "health club", "workout", "bodybuilding", "weight loss", "personal trainer"]
            }
        ]
    },
    {
        "name": "Home Services",
        "subcategories": [
            {
                "name": "Plumbers",
                "services": ["Pipe Leak Repair", "Tap Installation", "Water Tank Cleaning", "Drain Cleaning", "Bathroom Fitting", "Motor Installation"],
                "keywords": ["plumber", "plumbing service", "pipe repair", "water leak", "drainage block", "sanitary fitting"]
            },
            {
                "name": "Electricians",
                "services": ["Wiring", "Switch Repair", "Fan Installation", "MCB Tripping Issue", "Inverter Installation", "Lighting Setup"],
                "keywords": ["electrician", "electrical repair", "wiring service", "power cut issue", "short circuit repair", "electrical contractor"]
            },
            {
                "name": "Carpenters",
                "services": ["Furniture Repair", "Door Lock Changing", "Wood Polishing", "Custom Wardrobe", "Modular Kitchen", "Window Repair"],
                "keywords": ["carpenter", "wood work", "furniture repair", "door fitting", "modular kitchen maker", "wardrobe design"]
            },
            {
                "name": "Pest Control",
                "services": ["Termite Control", "Cockroach Control", "Bed Bug Treatment", "Rat Control", "Mosquito Control", "Wood Borer Treatment"],
                "keywords": ["pest control", "termite treatment", "bug spray", "exterminator", "cockroach killer", "rat poison"]
            }
        ]
    },
    {
        "name": "Automotive",
        "subcategories": [
            {
                "name": "Car Repair",
                "services": ["General Service", "Oil Change", "Engine Repair", "Denting & Painting", "AC Repair", "Wheel Alignment", "Car Wash", "Battery Replacement"],
                "keywords": ["car repair", "mechanic", "garage", "car service center", "auto repair", "denting painting", "car ac repair"]
            },
            {
                "name": "Bike Repair",
                "services": ["General Service", "Engine Work", "Water Wash", "Tyre Puncture", "Oil Change", "Electrical Work"],
                "keywords": ["bike repair", "two wheeler mechanic", "motorcycle service", "bike garage", "scooter repair", "bullet mechanic"]
            },
            {
                "name": "Tyre Shops",
                "services": ["New Tyres", "Puncture Repair", "Wheel Balancing", "Wheel Alignment", "Alloy Wheels", "Nitrogen Filling"],
                "keywords": ["tyre shop", "puncture shop", "wheel alignment", "mrf dealer", "ceat tyres", "apollo tyres", "alloy wheels"]
            }
        ]
    },
    {
        "name": "Education",
        "subcategories": [
            {
                "name": "Schools",
                "services": ["Pre-KG", "LKG", "UKG", "Primary", "Middle School", "High School", "Higher Secondary", "CBSE", "State Board", "ICSE", "Day Care", "Transport"],
                "keywords": ["school", "education", "cbse school", "kindergarten", "high school", "public school", "matriculation"]
            },
            {
                "name": "Colleges",
                "services": ["Arts & Science", "Engineering", "Medical", "Law", "Management", "Hostel", "Placement Cell", "Library", "Sports Facility"],
                "keywords": ["college", "university", "engineering college", "medical college", "higher education", "degree college", "mba college"]
            },
            {
                "name": "Tuition Centers",
                "services": ["Maths Tuition", "Science Tuition", "Language Classes", "Board Exam Coaching", "Entrance Exam Coaching", "Home Tuition", "Online Classes"],
                "keywords": ["tuition", "coaching center", "private tutor", "maths class", "neet coaching", "jee coaching", "home tutor"]
            }
        ]
    },
    {
        "name": "Real Estate",
        "subcategories": [
            {
                "name": "Real Estate Agents",
                "services": ["Buying Property", "Selling Property", "Renting Property", "Commercial Property", "Residential Property", "Agricultural Land", "Property Valuation", "Legal Assistance"],
                "keywords": ["real estate agent", "property broker", "house for sale", "plot for sale", "commercial space", "real estate consultant", "property dealer"]
            },
            {
                "name": "Builders & Developers",
                "services": ["Apartment Construction", "Villa Construction", "Commercial Complex", "Layout Development", "Promoters", "Joint Venture"],
                "keywords": ["builder", "developer", "promoter", "construction company", "flats for sale", "villas", "new projects"]
            },
            {
                "name": "Architects",
                "services": ["Building Design", "Interior Design", "Landscape Architecture", "Urban Planning", "3D Modeling", "Structural Engineering", "Project Management"],
                "keywords": ["architect", "building designer", "interior designer", "house plan", "elevation design", "structural engineer", "architectural firm"]
            }
        ]
    },
    {
        "name": "Professional Services",
        "subcategories": [
            {
                "name": "Chartered Accountants",
                "services": ["Income Tax Filing", "GST Registration", "GST Filing", "Company Incorporation", "Audit", "Accounting Services", "Financial Advisory", "Project Report"],
                "keywords": ["chartered accountant", "ca", "tax consultant", "gst practitioner", "auditor", "company registration", "income tax return"]
            },
            {
                "name": "Lawyers",
                "services": ["Civil Cases", "Criminal Cases", "Family Law", "Corporate Law", "Property Law", "Documentation", "Legal Advice", "Notary Public"],
                "keywords": ["lawyer", "advocate", "legal advisor", "attorney", "high court lawyer", "divorce lawyer", "property lawyer"]
            },
            {
                "name": "Event Organizers",
                "services": ["Wedding Planning", "Corporate Events", "Birthday Parties", "Stage Decoration", "Catering", "Photography", "Entertainment", "Venue Booking"],
                "keywords": ["event organizer", "event planner", "wedding planner", "party organizer", "decorator", "corporate event management"]
            }
        ]
    }
]

def seed_seed_master_categories():
    db: Session = SessionLocal()
    try:
        print("Starting massive seed...")
        for cat_data in CATEGORIES_DATA:
            cat_name = cat_data["name"]
            # Create Category
            category = db.query(models.category.Category).filter(models.category.Category.name == cat_name).first()
            if not category:
                category = models.category.Category(
                    name=cat_name,
                    icon="",
                    slug=cat_name.lower().replace(" & ", "-").replace(" ", "-"),
                    seo_title=f"Top {cat_name} Businesses in Your City",
                    seo_description=f"Find the best {cat_name} services, reviews, and ratings.",
                    is_active=True
                )
                db.add(category)
                db.commit()
                db.refresh(category)
                print(f"Created Category: {cat_name}")
            else:
                print(f"Category already exists: {cat_name}")

            # Create Subcategories
            for sub_data in cat_data["subcategories"]:
                sub_name = sub_data["name"]
                subcategory = db.query(models.subcategory.Subcategory).filter(
                    models.subcategory.Subcategory.name == sub_name,
                    models.subcategory.Subcategory.category_id == category.id
                ).first()

                if not subcategory:
                    subcategory = models.subcategory.Subcategory(
                        category_id=category.id,
                        name=sub_name,
                        icon="",
                        slug=sub_name.lower().replace(" & ", "-").replace(" ", "-"),
                        seo_title=f"Best {sub_name} Near You",
                        seo_description=f"Discover top-rated {sub_name}. Check reviews, addresses, and phone numbers.",
                        is_active=True
                    )
                    db.add(subcategory)
                    db.commit()
                    db.refresh(subcategory)
                    print(f"  Created Subcategory: {sub_name}")

                # Create Master Services
                for svc_name in sub_data["services"]:
                    svc = db.query(models.master_service.MasterService).filter(
                        models.master_service.MasterService.name == svc_name,
                        models.master_service.MasterService.subcategory_id == subcategory.id
                    ).first()
                    if not svc:
                        svc = models.master_service.MasterService(
                            subcategory_id=subcategory.id,
                            name=svc_name,
                            is_active=True
                        )
                        db.add(svc)
                        db.commit()
                
                # Create Keywords
                for kw in sub_data["keywords"]:
                    kw_obj = db.query(models.category_keyword.CategoryKeyword).filter(
                        models.category_keyword.CategoryKeyword.keyword == kw,
                        models.category_keyword.CategoryKeyword.subcategory_id == subcategory.id
                    ).first()
                    if not kw_obj:
                        kw_obj = models.category_keyword.CategoryKeyword(
                            category_id=category.id,
                            subcategory_id=subcategory.id,
                            keyword=kw
                        )
                        db.add(kw_obj)
                        db.commit()

        print("Seed completed successfully.")
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()


# ========================================
# seed_real_data.py
# ========================================

db = Session(bind=engine)

def seed_real_data():
    categories_data = [
        ("Car Hire", "🚕", "car-hire", 1),
        ("Caterers", "🍲", "caterers", 2),
        ("Chartered Accountant", "🧮", "chartered-accountant", 3),
        ("Computer Training Institutes", "🖥️", "computer-training", 4),
        ("Courier Services", "📦", "courier-services", 5),
        ("Computer & Laptop Repair", "💻", "computer-repair", 6),
        ("Car Repair & Services", "🚗", "car-repair", 7),
        ("Dermatologists", "👩‍⚕️", "dermatologists", 8),
        ("Dentists", "🦷", "dentists", 9),
        ("Electricians", "🔌", "electricians", 10),
        ("Event Organizer", "🎉", "event-organizer", 11),
        ("Real Estate", "🏠", "real-estate", 12),
        ("Fabricators", "🏭", "fabricators", 13),
        ("Furniture Repair Services", "🪑", "furniture-repair", 14),
        ("Hospitals", "🏥", "hospitals", 15),
        ("House keeping Services", "🧹", "housekeeping", 16),
        ("Hobbies", "🎨", "hobbies", 17),
        ("Interior Designers", "🛋️", "interior-designers", 18),
        ("Internet Website Designers", "🌐", "web-designers", 19),
        ("Jewellery Showrooms", "💎", "jewellery", 20),
        ("Lawyers", "⚖️", "lawyers", 21),
        ("Transporters", "🚚", "transporters", 22),
        ("Photographers", "📸", "photographers", 23),
        ("Nursing Services", "🩺", "nursing", 24),
        ("Printing & Publishing", "🖨️", "printing", 25),
        ("Placement Services", "👔", "placement", 26),
        ("Pest Control Services", "🪲", "pest-control", 27),
        ("Painting Contractors", "🖌️", "painting", 28),
        ("Packers & Movers", "📦", "packers-movers", 29),
        ("Scrap Dealers", "♻️", "scrap-dealers", 30),
        ("Scrap Buyers", "💰", "scrap-buyers", 31),
        ("Registration Consultants", "📝", "registration", 32),
        ("Security System", "🛡️", "security-system", 33),
        ("Coaching", "👨‍🏫", "coaching", 34),
        ("Vocational training", "🎓", "vocational-training", 35),
        ("Home Services", "🔧", "home-services", 36),
        ("Beauty Salons", "💇", "beauty-salons", 37),
        ("Photography Studio", "📷", "photography-studio", 38),
        ("Finance", "💳", "finance", 39),
        ("HVAC Services", "❄️", "hvac-services", 40),
        ("Technology", "🌍", "technology", 41),
    ]

    for name, icon, slug, order in categories_data:
        category = db.query(Category).filter(Category.slug == slug).first()
        if not category:
            category = Category(name=name, icon=icon, slug=slug, display_order=order, is_active=True)
            db.add(category)
        else:
            category.name = name
            category.icon = icon
            category.display_order = order
            category.is_active = True

    db.commit()

    # 1. Create Owners
    owners_data = [
        {"name": "Dr. Sri Kiruthiga Manohar", "email": "dr.kiruthiga@kingsdental.com", "phone": "+91 87789 51171"},
        {"name": "Revy M", "email": "revy@zentonez.com", "phone": "+91 97512 31239"},
        {"name": "Mr. Mohan Gurumoorthy", "email": "mohan@ssgloans.com", "phone": "+91 98943 37117"},
        {"name": "Abdul Kather", "email": "abdul@mansacoolcare.com", "phone": "+91 9894300001"},
        {"name": "Sahaya Raj", "email": "sahaya@zeropixcel.com", "phone": "+91 9894300002"},
        {"name": "Velimir Gayevskiy", "email": "vel@vel.bio", "phone": "+91 9894300003"}
    ]
    
    owner_objs = []
    for o in owners_data:
        # Check if exists
        user = db.query(User).filter(User.email == o["email"]).first()
        if not user:
            user = User(
                name=o["name"],
                email=o["email"],
                phone=o["phone"],
                hashed_password=get_password_hash("123"), # default password
                role=RoleEnum.owner
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            user.name = o["name"]
            user.phone = o["phone"]
        owner_objs.append(user)

    customer_data = [
        {"name": "Arun Kumar", "email": "arun.customer@bizdial.com", "phone": "+91 9000011111"},
        {"name": "Priya S", "email": "priya.customer@bizdial.com", "phone": "+91 9000011112"},
        {"name": "Mohanraj P", "email": "mohanraj.customer@bizdial.com", "phone": "+91 9000011113"},
    ]

    customer_objs = []
    for c in customer_data:
        customer = db.query(User).filter(User.email == c["email"]).first()
        if not customer:
            customer = User(
                name=c["name"],
                email=c["email"],
                phone=c["phone"],
                hashed_password=get_password_hash("123"),
                role=RoleEnum.customer
            )
            db.add(customer)
            db.commit()
            db.refresh(customer)
        else:
            customer.name = c["name"]
            customer.phone = c["phone"]
        customer_objs.append(customer)

    db.commit()

    # 2. Create Businesses
    businesses_data = [
        {
            "owner_id": owner_objs[0].id,
            "business_name": "Kings Dental Academy",
            "category": "Dentists",
            "description": "Premium dental academy and clinic run by Dr. Sri Kiruthiga Manohar.",
            "phone": "+91 87789 51171",
            "whatsapp": "+91 86088 58885",
            "website": "https://kingsdentalacademy.in/",
            "address": "Cantonment, Trichy, Tamil Nadu",
            "city": "Trichy",
            "pincode": "620001",
            "is_verified": True,
            "average_rating": 4.9,
            "total_reviews": 120,
            "approval_status": "Approved"
        },
        {
            "owner_id": owner_objs[1].id,
            "business_name": "Zen Tonez Women Salon",
            "category": "Beauty Salons",
            "description": "Exclusive women's salon offering premium beauty and grooming services.",
            "phone": "+91 97512 31239",
            "whatsapp": "+91 97885 36913",
            "website": "https://www.instagram.com/p/DS1cqLYkv_s/",
            "address": "Thillai Nagar, Trichy, Tamil Nadu",
            "city": "Trichy",
            "pincode": "620018",
            "is_verified": True,
            "average_rating": 4.8,
            "total_reviews": 85,
            "approval_status": "Approved"
        },
        {
            "owner_id": owner_objs[2].id,
            "business_name": "SSG Loans / Sri Sai Groups",
            "category": "Finance",
            "description": "Trusted loan and financial services provided by Sri Sai Groups.",
            "phone": "+91 98943 37117",
            "whatsapp": "+91 80723 69355",
            "website": "0431-4217117 / 0431-4011117",
            "address": "Salai Road, Trichy, Tamil Nadu",
            "city": "Trichy",
            "pincode": "620003",
            "is_verified": True,
            "average_rating": 4.7,
            "total_reviews": 210,
            "approval_status": "Approved"
        },
        {
            "owner_id": owner_objs[3].id,
            "business_name": "Mansa Cool Care",
            "category": "HVAC Services",
            "description": "Professional AC cooling and repair services. B2B dispatch available.",
            "phone": "BNI dispatch network",
            "website": "Regional Trichy BNI dispatch",
            "address": "KK Nagar, Trichy, Tamil Nadu",
            "city": "Trichy",
            "pincode": "620021",
            "is_verified": True,
            "average_rating": 4.5,
            "total_reviews": 45,
            "approval_status": "Approved"
        },
        {
            "owner_id": owner_objs[4].id,
            "business_name": "Zero Pixcel",
            "category": "Photography Studio",
            "description": "Professional studio and corporate session photography.",
            "phone": "BNI Gladiators hub",
            "website": "Studio dates via regional BNI hub",
            "address": "Woraiyur, Trichy, Tamil Nadu",
            "city": "Trichy",
            "pincode": "620003",
            "is_verified": True,
            "average_rating": 4.8,
            "total_reviews": 60,
            "approval_status": "Approved"
        },
        {
            "owner_id": owner_objs[5].id,
            "business_name": "Vel Bio",
            "category": "Technology",
            "description": "Digital contact and secure portal inquiries at vel.bio.",
            "phone": "Portal inquiry",
            "website": "https://www.vel.bio/",
            "address": "Global remote service",
            "city": "Global",
            "pincode": "N/A",
            "is_verified": True,
            "average_rating": 5.0,
            "total_reviews": 32,
            "approval_status": "Approved"
        }
    ]

    for b_data in businesses_data:
        biz = db.query(Business).filter(Business.business_name == b_data["business_name"]).first()
        if not biz:
            biz = Business(**b_data)
            db.add(biz)
        else:
            for key, value in b_data.items():
                setattr(biz, key, value)
            
    db.commit()

    business_map = {biz.business_name: biz for biz in db.query(Business).all()}

    leads_data = [
        ("Kings Dental Academy", "Arun Kumar", "+91 9000011111", "Dental course enquiry", LeadStatus.pending),
        ("Zen Tonez Women Salon", "Priya S", "+91 9000011112", "Salon appointment", LeadStatus.contacted),
        ("SSG Loans / Sri Sai Groups", "Mohanraj P", "+91 9000011113", "Business loan support", LeadStatus.converted),
    ]

    for business_name, customer_name, customer_phone, interest, status in leads_data:
        biz = business_map.get(business_name)
        if not biz:
            continue
        lead = (
            db.query(Lead)
            .filter(Lead.business_id == biz.id, Lead.customer_phone == customer_phone, Lead.service_interest == interest)
            .first()
        )
        if not lead:
            db.add(
                Lead(
                    business_id=biz.id,
                    customer_name=customer_name,
                    customer_phone=customer_phone,
                    service_interest=interest,
                    status=status,
                )
            )

    reviews_data = [
        ("Kings Dental Academy", customer_objs[0].id, 5.0, "Excellent guidance and very professional training."),
        ("Zen Tonez Women Salon", customer_objs[1].id, 4.5, "Very good service and friendly staff."),
        ("SSG Loans / Sri Sai Groups", customer_objs[2].id, 4.7, "Helpful support through the loan process."),
    ]

    for business_name, user_id, rating, comment in reviews_data:
        biz = business_map.get(business_name)
        if not biz:
            continue
        review = db.query(Review).filter(Review.business_id == biz.id, Review.user_id == user_id).first()
        if not review:
            db.add(Review(business_id=biz.id, user_id=user_id, rating=rating, comment=comment))
        else:
            review.rating = rating
            review.comment = comment

    owner_support_data = [
        ("Kings Dental Academy", "Advanced Implantology Workshop", "Training", 25000.0, 42),
        ("Zen Tonez Women Salon", "Bridal Styling Package", "Beauty", 12000.0, 28),
        ("SSG Loans / Sri Sai Groups", "Business Loan Consultation", "Finance", 0.0, 51),
        ("Mansa Cool Care", "Commercial AC Annual Service", "HVAC", 8500.0, 18),
        ("Zero Pixcel", "Corporate Brand Shoot", "Photography", 30000.0, 12),
        ("Vel Bio", "Founder Discovery Session", "Technology", 0.0, 9),
    ]

    for idx, (business_name, product_name, product_category, price, stock) in enumerate(owner_support_data, start=1):
        biz = business_map.get(business_name)
        if not biz:
            continue

        product = db.query(Product).filter(Product.business_id == biz.id, Product.name == product_name).first()
        if not product:
            db.add(
                Product(
                    business_id=biz.id,
                    name=product_name,
                    category=product_category,
                    price=price,
                    stock_quantity=stock,
                )
            )

        service = db.query(Service).filter(Service.business_id == biz.id, Service.name == f"{product_name} Service").first()
        if not service:
            db.add(
                Service(
                    business_id=biz.id,
                    name=f"{product_name} Service",
                    duration="60 mins",
                    base_price=price if price > 0 else 1500.0,
                    popularity_score=80 + idx,
                )
            )

        gallery = db.query(GalleryImage).filter(GalleryImage.business_id == biz.id, GalleryImage.title == "Main Showcase").first()
        if not gallery:
            db.add(
                GalleryImage(
                    business_id=biz.id,
                    image_url=f"https://picsum.photos/seed/owner-{idx}/800/600",
                    title="Main Showcase",
                    category="Cover",
                    views_count=500 + idx * 75,
                )
            )

        staff = db.query(Staff).filter(Staff.business_id == biz.id, Staff.email == f"team{idx}@bizdial.local").first()
        if not staff:
            db.add(
                Staff(
                    business_id=biz.id,
                    name=f"Team Lead {idx}",
                    role=StaffRole.manager,
                    email=f"team{idx}@bizdial.local",
                    phone=f"+91 90000{idx:05d}",
                )
            )

        invoice = db.query(Invoice).filter(Invoice.business_id == biz.id, Invoice.description == "BizDial Premium Plan").first()
        if not invoice:
            db.add(
                Invoice(
                    business_id=biz.id,
                    amount=4999.0 + idx * 500,
                    description="BizDial Premium Plan",
                    status="Paid",
                )
            )

    db.commit()
    print("Successfully seeded REAL business data into the database!")


# ========================================
# seed_trichy_mobiles.py
# ========================================
"""
BizDial – Seed 15 Realistic Mobile Shop Businesses in Tiruchirappalli (Trichy)
===============================================================================
Category: Shopping & Retail → Mobile & Accessories
Location: Tiruchirappalli, Tamil Nadu, India

Run from backend/:
    python seed_trichy_mobiles.py

Idempotent – skips records that already exist (checked by business slug).
"""


sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


# ═══════════════════════════════════════════════════════════════
#  CONSTANTS
# ═══════════════════════════════════════════════════════════════

CITY = "Tiruchirappalli"
CITY_SHORT = "Trichy"
STATE = "Tamil Nadu"
COUNTRY = "India"
CATEGORY_SLUG = "shopping-retail"
SUBCATEGORY_SLUG = "mobile-accessories"
PASSWORD = "BizDial@123"

SERVICES_POOL = [
    ("Mobile Sales", "30 min", 0),
    ("Smartphones", "30 min", 0),
    ("Accessories", "15 min", 0),
    ("Mobile Covers", "10 min", 150),
    ("Tempered Glass", "15 min", 199),
    ("Bluetooth Speakers", "10 min", 899),
    ("Power Banks", "10 min", 599),
    ("Smart Watches", "20 min", 1999),
    ("Earbuds", "10 min", 499),
    ("Laptop Accessories", "15 min", 0),
    ("SIM Cards", "15 min", 0),
    ("Recharge", "5 min", 0),
    ("Phone Exchange", "30 min", 0),
    ("EMI Available", "20 min", 0),
    ("Warranty", "10 min", 0),
]

BRANDS = ["Apple", "Samsung", "Xiaomi", "Realme", "OnePlus", "Vivo", "Oppo", "Nothing", "Motorola", "Google Pixel"]

PAYMENT_METHODS = ["Cash", "UPI", "Credit Card", "Debit Card", "EMI", "Finance"]

FEATURES = ["Parking", "Air Conditioned", "Wheelchair Accessible", "WiFi", "Home Delivery", "Pickup", "Card Payment", "GST Available"]

SEARCH_TAGS = [
    "mobile shop", "iphone dealer", "samsung store", "best mobile shop trichy",
    "phone accessories", "smartphone showroom", "mobile repair", "mobile exchange",
    "mobile shop trichy", "poorvika mobiles", "mobile store tiruchirappalli",
]

FAQ_DATA = [
    {"question": "Do you offer EMI?", "answer": "Yes, we offer easy EMI options through Bajaj Finserv, HDFC, ICICI, and other leading banks. No-cost EMI is available on select smartphones."},
    {"question": "Do you repair phones?", "answer": "Yes, we provide professional mobile repair services including screen replacement, battery replacement, software updates, and water damage repair."},
    {"question": "Do you sell iPhones?", "answer": "Yes, we are an authorised Apple reseller. We stock the latest iPhone models along with genuine Apple accessories and AppleCare+ plans."},
    {"question": "Do you accept UPI?", "answer": "Absolutely! We accept all UPI apps including Google Pay, PhonePe, Paytm, and BHIM. We also accept credit cards, debit cards, and cash."},
    {"question": "Do you provide warranty?", "answer": "All products sold come with full manufacturer warranty. We also offer extended warranty plans on select devices for additional peace of mind."},
]

# ═══════════════════════════════════════════════════════════════
#  BUSINESS DATA (15 SHOPS)
# ═══════════════════════════════════════════════════════════════

BUSINESSES = [
    {
        "name": "The Chennai Mobiles",
        "slug": "the-chennai-mobiles-thillai-nagar-trichy",
        "area": "Thillai Nagar",
        "address": "No. 5, 7th Cross Street, Thillai Nagar, Tiruchirappalli, Tamil Nadu 620018",
        "pincode": "620018",
        "lat": 10.8155, "lng": 78.6873,
        "phone": "+91 98424 51001", "whatsapp": "+91 98424 51001",
        "email": "thechennaimobiles.trichy@gmail.com",
        "website": "https://www.thechennaimobiles.com",
        "rating": 4.7, "reviews": 1842,
        "description": "The Chennai Mobiles is one of the most trusted multi-brand mobile showrooms in Thillai Nagar, Trichy. With over 10 years of experience, we offer the latest smartphones from Apple, Samsung, OnePlus, Xiaomi, Vivo, Oppo, and more. Our store features a dedicated accessories section, instant screen protector installation, and hassle-free EMI options through all major banks. Customers love our transparent pricing and knowledgeable staff who help you find the perfect device within your budget.",
        "short_desc": "Trusted multi-brand mobile showroom in Thillai Nagar with 10+ years of experience.",
        "is_verified": True, "is_premium": True,
        "opening": "09:30", "closing": "21:00", "days": "Mon-Sat",
        "profile_views": 28450, "call_clicks": 3420, "whatsapp_clicks": 2180,
        "website_clicks": 1560, "direction_requests": 4230, "bookmark_count": 876,
        "owner_name": "Rajendran Krishnamoorthy",
    },
    {
        "name": "Supreme Mobiles \u2013 KRT Building",
        "slug": "supreme-mobiles-krt-building-cantonment-trichy",
        "area": "Cantonment",
        "address": "KRT Building, Big Bazaar Street, Cantonment, Tiruchirappalli, Tamil Nadu 620001",
        "pincode": "620001",
        "lat": 10.8050, "lng": 78.6916,
        "phone": "+91 98424 52002", "whatsapp": "+91 98424 52002",
        "email": "supreme.krt@gmail.com",
        "website": "https://www.suprememobiles.in",
        "rating": 4.5, "reviews": 956,
        "description": "Supreme Mobiles at KRT Building, Cantonment is a well-established mobile phone retailer serving Trichy for over 8 years. We specialise in the latest Samsung Galaxy, Apple iPhone, and OnePlus devices. Our showroom offers live demo units, instant price comparison, trade-in offers on old phones, and flexible EMI plans. Walk in for genuine accessories, tempered glass fitting, and expert mobile consultation.",
        "short_desc": "Premium mobile showroom at KRT Building, Cantonment with trade-in offers.",
        "is_verified": True, "is_premium": False,
        "opening": "10:00", "closing": "21:00", "days": "Mon-Sat",
        "profile_views": 15230, "call_clicks": 1890, "whatsapp_clicks": 1120,
        "website_clicks": 780, "direction_requests": 2310, "bookmark_count": 432,
        "owner_name": "Senthil Kumar Natarajan",
    },
    {
        "name": "Supreme Mobiles \u2013 Saradha\u2019s Branch",
        "slug": "supreme-mobiles-saradhas-branch-woraiyur-trichy",
        "area": "Woraiyur",
        "address": "Saradha Complex, Woraiyur Main Road, Tiruchirappalli, Tamil Nadu 620003",
        "pincode": "620003",
        "lat": 10.8260, "lng": 78.6854,
        "phone": "+91 98424 53003", "whatsapp": "+91 98424 53003",
        "email": "supreme.saradha@gmail.com",
        "website": "https://www.suprememobiles.in",
        "rating": 4.3, "reviews": 478,
        "description": "Supreme Mobiles at Saradha Complex, Woraiyur brings the best smartphone deals to the heart of Trichy. Browse through our wide collection of Xiaomi, Realme, Vivo, and Samsung phones at competitive prices. We offer SIM activation, data transfer assistance, old phone buyback, and genuine mobile accessories. Our friendly staff will guide you through the latest features and help you pick the right phone.",
        "short_desc": "Affordable smartphones and accessories at Saradha Complex, Woraiyur.",
        "is_verified": True, "is_premium": False,
        "opening": "09:30", "closing": "20:30", "days": "Mon-Sat",
        "profile_views": 8760, "call_clicks": 1045, "whatsapp_clicks": 678,
        "website_clicks": 320, "direction_requests": 1290, "bookmark_count": 198,
        "owner_name": "Manikandan Subramanian",
    },
    {
        "name": "Supreme Mobiles \u2013 Chathiram",
        "slug": "supreme-mobiles-chathiram-trichy",
        "area": "Chathiram Bus Stand",
        "address": "Near Chathiram Bus Stand, NSB Road, Tiruchirappalli, Tamil Nadu 620002",
        "pincode": "620002",
        "lat": 10.8105, "lng": 78.6833,
        "phone": "+91 98424 54004", "whatsapp": "+91 98424 54004",
        "email": "supreme.chathiram@gmail.com",
        "website": "https://www.suprememobiles.in",
        "rating": 4.4, "reviews": 612,
        "description": "Supreme Mobiles near Chathiram Bus Stand is ideally located for quick mobile purchases while you are in transit. Our compact yet fully-stocked showroom features phones from all major brands, quick screen guard installation, mobile covers, chargers, and earphones. We are known for our fast service and honest pricing. EMI options available on all smartphones above Rs 10,000.",
        "short_desc": "Conveniently located mobile shop near Chathiram Bus Stand with EMI options.",
        "is_verified": True, "is_premium": False,
        "opening": "09:00", "closing": "21:30", "days": "Mon-Sun",
        "profile_views": 11340, "call_clicks": 1560, "whatsapp_clicks": 890,
        "website_clicks": 450, "direction_requests": 3450, "bookmark_count": 267,
        "owner_name": "Dinesh Babu Rajan",
    },
    {
        "name": "Poorvika Mobiles \u2013 YVD Trade Centre",
        "slug": "poorvika-mobiles-yvd-trade-centre-trichy",
        "area": "Teppakulam",
        "address": "YVD Trade Centre, Teppakulam, Tiruchirappalli, Tamil Nadu 620002",
        "pincode": "620002",
        "lat": 10.8097, "lng": 78.6920,
        "phone": "+91 98424 55005", "whatsapp": "+91 98424 55005",
        "email": "poorvika.yvd@poorvikamobiles.com",
        "website": "https://www.poorvika.com",
        "rating": 4.8, "reviews": 2870,
        "description": "Poorvika Mobiles at YVD Trade Centre is the flagship Poorvika outlet in Trichy, offering an unmatched selection of smartphones, tablets, laptops, and accessories. As one of South India's largest mobile retail chains, we provide manufacturer-authorised warranty, instant exchange offers, and exclusive Poorvika cashback deals. Our trained product specialists help you compare specifications and find the best value for your money.",
        "short_desc": "Flagship Poorvika outlet at YVD Trade Centre with exclusive cashback deals.",
        "is_verified": True, "is_premium": True,
        "opening": "09:30", "closing": "21:30", "days": "Mon-Sun",
        "profile_views": 45670, "call_clicks": 5430, "whatsapp_clicks": 3890,
        "website_clicks": 4560, "direction_requests": 6780, "bookmark_count": 1456,
        "owner_name": "Arun Prakash Venkatesh",
    },
    {
        "name": "Poorvika Mobiles \u2013 Thillai Nagar",
        "slug": "poorvika-mobiles-thillai-nagar-trichy",
        "area": "Thillai Nagar",
        "address": "No. 12, 4th Cross, Thillai Nagar, Tiruchirappalli, Tamil Nadu 620018",
        "pincode": "620018",
        "lat": 10.8148, "lng": 78.6860,
        "phone": "+91 98424 56006", "whatsapp": "+91 98424 56006",
        "email": "poorvika.thillai@poorvikamobiles.com",
        "website": "https://www.poorvika.com",
        "rating": 4.6, "reviews": 2145,
        "description": "Poorvika Mobiles in Thillai Nagar offers a premium shopping experience for mobile enthusiasts. Step into our air-conditioned showroom to explore the latest iPhone, Samsung Galaxy, Google Pixel, and Nothing Phone models. We feature interactive display counters, dedicated accessory walls, and a service desk for warranty claims. Special weekend offers and festival sales make this the go-to destination for tech-savvy shoppers in Trichy.",
        "short_desc": "Premium Poorvika showroom in Thillai Nagar with interactive displays.",
        "is_verified": True, "is_premium": True,
        "opening": "09:30", "closing": "21:00", "days": "Mon-Sun",
        "profile_views": 34560, "call_clicks": 4120, "whatsapp_clicks": 2980,
        "website_clicks": 3210, "direction_requests": 5120, "bookmark_count": 1120,
        "owner_name": "Karthikeyan Mohan",
    },
    {
        "name": "Poorvika Mobiles \u2013 Thillai Nagar West",
        "slug": "poorvika-mobiles-thillai-nagar-west-trichy",
        "area": "Thillai Nagar West",
        "address": "Shop 8, West Boulevard, Thillai Nagar, Tiruchirappalli, Tamil Nadu 620018",
        "pincode": "620018",
        "lat": 10.8140, "lng": 78.6820,
        "phone": "+91 98424 57007", "whatsapp": "+91 98424 57007",
        "email": "poorvika.thillaiwest@poorvikamobiles.com",
        "website": "https://www.poorvika.com",
        "rating": 4.5, "reviews": 1534,
        "description": "Poorvika Mobiles at Thillai Nagar West caters to the western side of Trichy's busiest residential neighbourhood. Our spacious showroom stocks all major brands with live demo units. We specialise in phone exchange programs offering up to Rs 15,000 for your old device. Free screen guard installation on every purchase, and we accept all major payment modes including UPI, cards, and no-cost EMI.",
        "short_desc": "Spacious Poorvika showroom in Thillai Nagar West with exchange programs.",
        "is_verified": True, "is_premium": False,
        "opening": "10:00", "closing": "21:00", "days": "Mon-Sat",
        "profile_views": 21340, "call_clicks": 2780, "whatsapp_clicks": 1890,
        "website_clicks": 1670, "direction_requests": 3450, "bookmark_count": 678,
        "owner_name": "Vijayakumar Palaniswami",
    },
    {
        "name": "Poorvika Mobiles \u2013 Melachinthamani",
        "slug": "poorvika-mobiles-melachinthamani-trichy",
        "area": "Melachinthamani",
        "address": "Main Road, Melachinthamani, Tiruchirappalli, Tamil Nadu 620001",
        "pincode": "620001",
        "lat": 10.8200, "lng": 78.6950,
        "phone": "+91 98424 58008", "whatsapp": "+91 98424 58008",
        "email": "poorvika.mela@poorvikamobiles.com",
        "website": "https://www.poorvika.com",
        "rating": 4.4, "reviews": 987,
        "description": "Poorvika Mobiles at Melachinthamani is a neighbourhood-friendly mobile store offering great deals on budget and mid-range smartphones. Popular among college students and young professionals, we stock the latest Realme, Xiaomi, and Samsung M-series phones. Walk in for quick battery replacements, SIM card activations, and prepaid recharge services. Our prices are transparent and match online offers.",
        "short_desc": "Budget-friendly Poorvika outlet at Melachinthamani for students and professionals.",
        "is_verified": True, "is_premium": False,
        "opening": "09:30", "closing": "20:30", "days": "Mon-Sat",
        "profile_views": 14560, "call_clicks": 1670, "whatsapp_clicks": 1120,
        "website_clicks": 890, "direction_requests": 2120, "bookmark_count": 345,
        "owner_name": "Saravanan Kannan",
    },
    {
        "name": "Poorvika Mobiles \u2013 Chinthamani",
        "slug": "poorvika-mobiles-chinthamani-trichy",
        "area": "Chinthamani",
        "address": "Chinthamani Bazaar, Tiruchirappalli, Tamil Nadu 620002",
        "pincode": "620002",
        "lat": 10.8185, "lng": 78.6940,
        "phone": "+91 98424 59009", "whatsapp": "+91 98424 59009",
        "email": "poorvika.chinthamani@poorvikamobiles.com",
        "website": "https://www.poorvika.com",
        "rating": 4.6, "reviews": 1678,
        "description": "Poorvika Mobiles at Chinthamani Bazaar is located in Trichy's bustling commercial hub. This high-footfall outlet offers aggressive pricing on flagship phones from Apple, Samsung, and OnePlus. We carry a wide range of genuine accessories including branded earbuds, smartwatches, and power banks. Our team assists with data transfer, device setup, and provides after-sales support for all purchases made in-store.",
        "short_desc": "High-footfall Poorvika outlet in Chinthamani Bazaar with flagship phone deals.",
        "is_verified": True, "is_premium": True,
        "opening": "09:00", "closing": "21:30", "days": "Mon-Sun",
        "profile_views": 26780, "call_clicks": 3240, "whatsapp_clicks": 2340,
        "website_clicks": 2120, "direction_requests": 4560, "bookmark_count": 890,
        "owner_name": "Balasubramanian Ramasamy",
    },
    {
        "name": "Poorvika Mobiles \u2013 Jai Durga Complex",
        "slug": "poorvika-mobiles-jai-durga-complex-srirangam-trichy",
        "area": "Srirangam",
        "address": "Jai Durga Complex, Srirangam Main Road, Tiruchirappalli, Tamil Nadu 620006",
        "pincode": "620006",
        "lat": 10.8590, "lng": 78.6890,
        "phone": "+91 98424 50010", "whatsapp": "+91 98424 50010",
        "email": "poorvika.jaidurga@poorvikamobiles.com",
        "website": "https://www.poorvika.com",
        "rating": 4.3, "reviews": 534,
        "description": "Poorvika Mobiles at Jai Durga Complex serves the Srirangam area with a curated selection of smartphones and accessories. Conveniently located near the famous Sri Ranganathaswamy Temple, we welcome both local residents and tourists looking for quality mobile phones at competitive prices. We offer temple-town special discounts on weekends and festival seasons.",
        "short_desc": "Poorvika outlet near Srirangam Temple with weekend special discounts.",
        "is_verified": True, "is_premium": False,
        "opening": "10:00", "closing": "20:00", "days": "Mon-Sat",
        "profile_views": 9870, "call_clicks": 890, "whatsapp_clicks": 560,
        "website_clicks": 340, "direction_requests": 1890, "bookmark_count": 156,
        "owner_name": "Ganesan Thirunavukarasu",
    },
    {
        "name": "I Mobiles",
        "slug": "i-mobiles-puthur-trichy",
        "area": "Puthur",
        "address": "No. 22, Anna Nagar, Puthur, Tiruchirappalli, Tamil Nadu 620017",
        "pincode": "620017",
        "lat": 10.8230, "lng": 78.6780,
        "phone": "+91 98424 51011", "whatsapp": "+91 98424 51011",
        "email": "imobiles.trichy@gmail.com",
        "website": "https://www.imobilestrichy.com",
        "rating": 4.2, "reviews": 289,
        "description": "I Mobiles in Puthur is your neighbourhood mobile electronics shop offering personalised service and honest pricing. We carry a wide selection of smartphones from Samsung, Xiaomi, Realme, and Vivo. Our speciality is one-on-one consultation where we understand your needs and recommend the best phone within your budget. We also provide mobile repair services, screen replacement, and battery upgrades.",
        "short_desc": "Neighbourhood mobile shop in Puthur with personalised consultation.",
        "is_verified": True, "is_premium": False,
        "opening": "09:30", "closing": "20:00", "days": "Mon-Sat",
        "profile_views": 5430, "call_clicks": 567, "whatsapp_clicks": 345,
        "website_clicks": 120, "direction_requests": 890, "bookmark_count": 89,
        "owner_name": "Prakash Sundararajan",
    },
    {
        "name": "Phonup Trichy",
        "slug": "phonup-trichy-salai-road",
        "area": "Salai Road",
        "address": "No. 45, Salai Road, near Collector Office, Tiruchirappalli, Tamil Nadu 620001",
        "pincode": "620001",
        "lat": 10.8120, "lng": 78.6880,
        "phone": "+91 98424 52012", "whatsapp": "+91 98424 52012",
        "email": "phonup.trichy@gmail.com",
        "website": "https://www.phonup.in",
        "rating": 4.9, "reviews": 1256,
        "description": "Phonup Trichy is a modern, tech-forward mobile retail experience on Salai Road. Our Instagram-worthy store design features interactive product zones, a dedicated Apple corner, a Samsung Experience counter, and an accessories bar. We are known for our exceptional customer service, competitive exchange offers, and exclusive launch-day deals. Phonup also offers doorstep delivery within Trichy city limits for orders above Rs 5,000.",
        "short_desc": "Modern tech-forward mobile store on Salai Road with doorstep delivery.",
        "is_verified": True, "is_premium": True,
        "opening": "10:00", "closing": "21:30", "days": "Mon-Sun",
        "profile_views": 32100, "call_clicks": 4560, "whatsapp_clicks": 3450,
        "website_clicks": 2890, "direction_requests": 4120, "bookmark_count": 1234,
        "owner_name": "Ashwin Kumar Prabhu",
    },
    {
        "name": "Kings Mobile",
        "slug": "kings-mobile-singarathope-trichy",
        "area": "Singarathope",
        "address": "Shop 18, Commercial Complex, Singarathope, Tiruchirappalli, Tamil Nadu 620008",
        "pincode": "620008",
        "lat": 10.8070, "lng": 78.6850,
        "phone": "+91 98424 53013", "whatsapp": "+91 98424 53013",
        "email": "kingsmobile.trichy@gmail.com",
        "website": "",
        "rating": 4.4, "reviews": 623,
        "description": "Kings Mobile in Singarathope is a popular destination for budget and mid-range smartphones. We stock an extensive collection of Xiaomi Redmi, Realme, Motorola, and Samsung A-series phones. Our competitive pricing, combined with genuine accessories and reliable after-sales service, has earned us a loyal customer base in the Singarathope and Woraiyur areas. Free tempered glass installation on all new phone purchases.",
        "short_desc": "Budget-friendly mobile shop in Singarathope with free tempered glass.",
        "is_verified": True, "is_premium": False,
        "opening": "09:00", "closing": "20:30", "days": "Mon-Sat",
        "profile_views": 10890, "call_clicks": 1230, "whatsapp_clicks": 780,
        "website_clicks": 0, "direction_requests": 1670, "bookmark_count": 234,
        "owner_name": "Murugan Shanmugam",
    },
    {
        "name": "Aadhi Mobile Care",
        "slug": "aadhi-mobile-care-kk-nagar-trichy",
        "area": "K.K. Nagar",
        "address": "No. 8, 3rd Street, K.K. Nagar, Tiruchirappalli, Tamil Nadu 620021",
        "pincode": "620021",
        "lat": 10.8170, "lng": 78.6770,
        "phone": "+91 98424 54014", "whatsapp": "+91 98424 54014",
        "email": "aadhimobilecare@gmail.com",
        "website": "https://www.aadhimobilecare.in",
        "rating": 4.5, "reviews": 412,
        "description": "Aadhi Mobile Care in K.K. Nagar combines mobile sales with professional repair services under one roof. Whether you need a brand new Samsung Galaxy or want to fix your cracked iPhone screen, we have you covered. Our certified technicians handle display replacement, battery swap, charging port repair, and software troubleshooting. Genuine spare parts with 90-day service warranty on all repairs.",
        "short_desc": "Mobile sales and certified repair centre in K.K. Nagar with service warranty.",
        "is_verified": True, "is_premium": False,
        "opening": "09:30", "closing": "20:00", "days": "Mon-Sat",
        "profile_views": 8760, "call_clicks": 980, "whatsapp_clicks": 670,
        "website_clicks": 340, "direction_requests": 1230, "bookmark_count": 178,
        "owner_name": "Vigneshwaran Arumugam",
    },
    {
        "name": "Silickon Mobiles",
        "slug": "silickon-mobiles-main-guard-gate-trichy",
        "area": "Main Guard Gate",
        "address": "No. 3, Main Guard Gate, Tiruchirappalli, Tamil Nadu 620001",
        "pincode": "620001",
        "lat": 10.8088, "lng": 78.6905,
        "phone": "+91 98424 55015", "whatsapp": "+91 98424 55015",
        "email": "silickonmobiles@gmail.com",
        "website": "https://www.silickonmobiles.com",
        "rating": 4.6, "reviews": 756,
        "description": "Silickon Mobiles at Main Guard Gate is a well-known mobile retail store in the heart of Trichy. Our wide inventory includes smartphones, feature phones, tablets, and smart accessories from all leading brands. We pride ourselves on offering the best price guarantee in the locality. Walk in for instant quote comparisons with online prices, hassle-free returns within 7 days, and express warranty processing.",
        "short_desc": "Best price guarantee mobile store at Main Guard Gate with easy returns.",
        "is_verified": True, "is_premium": False,
        "opening": "09:00", "closing": "21:00", "days": "Mon-Sun",
        "profile_views": 14320, "call_clicks": 1670, "whatsapp_clicks": 1120,
        "website_clicks": 890, "direction_requests": 2340, "bookmark_count": 456,
        "owner_name": "Ramesh Venkatesan",
    },
]

# ═══════════════════════════════════════════════════════════════
#  REVIEWER DATA
# ═══════════════════════════════════════════════════════════════

REVIEWER_NAMES = [
    "Murugan K.", "Lakshmi S.", "Karthik R.", "Priya Devi M.", "Sathish Kumar P.",
    "Anitha V.", "Gopalakrishnan T.", "Deepa N.", "Ramachandran S.", "Kavitha B.",
    "Senthil M.", "Revathi K.", "Vijay P.", "Meena R.", "Sundaram A.",
    "Bharathi L.", "Kumaran G.", "Divya S.", "Thangavel N.", "Saranya K.",
    "Jayakumar R.", "Nandhini P.", "Eswaran M.", "Gomathi V.", "Balaji T.",
]

REVIEW_TEMPLATES = [
    "Excellent mobile shop! Bought my new {brand} from here. Staff was very helpful and explained all the features. Price was competitive compared to online stores. {extra}",
    "Good collection of phones and accessories. Got my {brand} at a great price with no-cost EMI. {extra} Will visit again.",
    "Very satisfied with the purchase. The {brand} I bought works perfectly. They also installed tempered glass for free. {extra}",
    "Friendly staff and genuine products. Compared prices online and this shop matched every offer. {extra} Highly recommended!",
    "Bought {brand} phone for my mother. Staff patiently showed multiple options within budget. {extra} Great shopping experience.",
    "Decent shop with wide variety. {extra} The {brand} phone I purchased had a minor issue, but they resolved it immediately under warranty.",
    "Outstanding service! Got the latest {brand} on launch day itself. {extra} The exchange value for my old phone was also fair.",
    "One of the best mobile shops in Trichy. {brand} collection is impressive. {extra} Quick billing and professional staff.",
    "Visited for phone repair and ended up buying a new {brand}. Their repair team is skilled. {extra} Both services were excellent.",
    "Amazing deals during the festival sale! Got a {brand} at a fantastic discount. {extra} Free accessories worth Rs 2,000 were included.",
    "They have all brands under one roof. My {brand} was delivered with proper box and invoice. {extra} Trustworthy shop.",
    "Quick service, no waiting time. The staff demonstrated the {brand} phone thoroughly before I made my decision. {extra}",
    "Great experience buying a {brand} here. EMI documentation was smooth and completed in 15 minutes. {extra}",
    "Premium shopping experience at a reasonable price. The {brand} display section is well-organised. {extra}",
    "Recommended by a friend and not disappointed. {brand} phones are genuine with full warranty. {extra} Will refer others too.",
    "Visited multiple shops before coming here. Best price for {brand} in Trichy. {extra} Staff was not pushy at all.",
    "Bought a {brand} smartwatch along with a phone. Good combo offers available. {extra} Clean and well-maintained shop.",
    "Second time purchasing from this shop. Previous {brand} phone lasted 3 years without issues. {extra} Trust them for quality.",
    "Helpful staff, especially Mr. Ravi who spent 30 minutes explaining camera features of {brand}. {extra}",
    "Got genuine Apple accessories here. Hard to find in Trichy otherwise. {extra} Price matched with Apple Store online.",
]

REVIEW_EXTRAS = [
    "Parking was convenient.", "Shop is air-conditioned and comfortable.",
    "UPI payment was seamless.", "They provided a carry bag and invoice instantly.",
    "Location is easy to find.", "Opened a new SIM card for me as well.",
    "Got a branded earphone free with purchase.", "They transferred all data from old to new phone.",
    "Warranty card was properly filled.", "Staff offered water and made us feel welcome.",
    "The kid's play area kept my son entertained.", "Billing was quick, took less than 5 minutes.",
    "", "", "", "",  # Empty extras for variety
]

# ═══════════════════════════════════════════════════════════════
#  GALLERY IMAGE URLs (Unsplash - royalty-free)
# ═══════════════════════════════════════════════════════════════

GALLERY_IMAGES = {
    "Exterior": [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
        "https://images.unsplash.com/photo-1528698827591-e19cef791f3c?w=600&q=80",
        "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80",
    ],
    "Interior": [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
        "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&q=80",
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80",
    ],
    "Product": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
        "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80",
    ],
}


def seed_trichy_mobiles():
    print("=" * 70)
    print("  BizDial - Seeding 15 Realistic Mobile Shops in Trichy")
    print("=" * 70)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # ── Check idempotency ─────────────────────────────────
        first_slug = BUSINESSES[0]["slug"]
        existing = db.query(Business).filter(Business.slug == first_slug).first()
        if existing:
            print("\n  [SKIP] Demo mobile shops already exist. Skipping seed.")
            return

        # ── 1. Resolve Category & Subcategory ─────────────────
        print("\n[1/8] Resolving Category & Subcategory...")
        category = db.query(Category).filter(Category.slug == CATEGORY_SLUG).first()
        if not category:
            # Create if missing
            category = Category(
                name="Shopping & Retail",
                slug=CATEGORY_SLUG,
                icon="shopping-bag",
                description="Clothing, electronics, grocery, and online shopping.",
                is_featured=True, is_active=True, display_order=10
            )
            db.add(category)
            db.flush()
            print("  [+] Created category: Shopping & Retail")
        else:
            print(f"  [OK] Found category: {category.name} (id={category.id})")

        subcategory = db.query(Subcategory).filter(Subcategory.slug == SUBCATEGORY_SLUG).first()
        if not subcategory:
            subcategory = Subcategory(
                category_id=category.id,
                name="Mobile & Accessories",
                slug=SUBCATEGORY_SLUG,
                icon="smartphone",
                description="Mobile phone dealers, accessories, and repair services.",
                is_active=True, display_order=6
            )
            db.add(subcategory)
            db.flush()
            print("  [+] Created subcategory: Mobile & Accessories")
        else:
            print(f"  [OK] Found subcategory: {subcategory.name} (id={subcategory.id})")

        # ── 2. Create Reviewer Customer Accounts ──────────────
        print("\n[2/8] Creating reviewer customer accounts...")
        reviewer_users = []
        for i, rname in enumerate(REVIEWER_NAMES, start=1):
            email = f"reviewer{i:03d}@bizdial.com"
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    name=rname,
                    email=email,
                    phone=f"+91 97890 {60000 + i}",
                    hashed_password=get_password_hash("Review@123"),
                    role=RoleEnum.customer,
                )
                db.add(user)
                db.flush()
            reviewer_users.append(user)
        print(f"  [OK] {len(reviewer_users)} reviewer accounts ready")

        # ── 3. Create Owner Accounts & Businesses ─────────────
        print("\n[3/8] Creating 15 owner accounts and businesses...")
        created_businesses = []

        for idx, bdata in enumerate(BUSINESSES, start=1):
            owner_num = f"{idx:03d}"
            owner_email = f"owner{owner_num}@bizdial.com"

            # Create owner user
            owner = db.query(User).filter(User.email == owner_email).first()
            if not owner:
                owner = User(
                    name=bdata["owner_name"],
                    email=owner_email,
                    phone=f"+91 98420 {70000 + idx}",
                    hashed_password=get_password_hash(PASSWORD),
                    role=RoleEnum.owner,
                )
                db.add(owner)
                db.flush()

            # Build SEO metadata
            seo_title = f"Best Mobile Shop in {bdata['area']}, Trichy | {bdata['name']} | BizDial"
            seo_desc = (
                f"Visit {bdata['name']} in {bdata['area']}, Trichy. "
                f"Compare ratings, reviews, products, business hours, directions, and contact information on BizDial."
            )
            seo_kw = (
                f"mobile shop trichy, best mobile shop, {bdata['name'].lower()}, "
                f"iphone dealer trichy, samsung showroom trichy, mobile accessories, "
                f"mobile phones {bdata['area'].lower()}, phone exchange, mobile repair"
            )

            google_map = (
                f"https://www.google.com/maps/search/?api=1&query="
                f"{bdata['lat']},{bdata['lng']}"
            )

            biz = Business(
                owner_id=owner.id,
                business_name=bdata["name"],
                slug=bdata["slug"],
                category="Shopping & Retail",
                description=bdata["description"],
                short_description=bdata["short_desc"],
                address=bdata["address"],
                area=bdata["area"],
                city=CITY_SHORT,
                state=STATE,
                country=COUNTRY,
                pincode=bdata["pincode"],
                latitude=bdata["lat"],
                longitude=bdata["lng"],
                google_map_url=google_map,
                phone=bdata["phone"],
                whatsapp=bdata["whatsapp"],
                email=bdata["email"],
                website=bdata["website"],
                logo_url=f"https://ui-avatars.com/api/?name={bdata['name'].replace(' ', '+')}&size=200&background=random&bold=true",
                cover_image_url="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
                is_verified=bdata["is_verified"],
                is_premium=bdata["is_premium"],
                approval_status="Approved",
                average_rating=bdata["rating"],
                total_reviews=bdata["reviews"],
                opening_time=bdata["opening"],
                closing_time=bdata["closing"],
                working_days=bdata["days"],
                seo_title=seo_title,
                seo_description=seo_desc,
                seo_keywords=seo_kw,
                profile_views=bdata["profile_views"],
                call_clicks=bdata["call_clicks"],
                whatsapp_clicks=bdata["whatsapp_clicks"],
                website_clicks=bdata["website_clicks"],
                direction_requests=bdata["direction_requests"],
                bookmark_count=bdata["bookmark_count"],
            )
            db.add(biz)
            db.flush()

            # Category mapping
            mapping = BusinessCategoryMapping(
                business_id=biz.id,
                category_id=category.id,
                subcategory_id=subcategory.id
            )
            db.add(mapping)

            created_businesses.append(biz)
            tag = " [PREMIUM]" if bdata["is_premium"] else ""
            print(f"  [{idx:02d}] {bdata['name']} @ {bdata['area']}{tag}  (owner: {owner_email})")

        db.commit()
        print(f"\n  [OK] Created {len(created_businesses)} businesses with category mappings")

        # ── 4. Seed Reviews ───────────────────────────────────
        print("\n[4/8] Generating reviews (10-20 per business)...")
        total_reviews = 0
        base_date = datetime(2025, 1, 1)

        for biz in created_businesses:
            num_reviews = random.randint(10, 20)
            for j in range(num_reviews):
                reviewer = random.choice(reviewer_users)
                brand = random.choice(BRANDS)
                extra = random.choice(REVIEW_EXTRAS)
                template = random.choice(REVIEW_TEMPLATES)
                comment = template.format(brand=brand, extra=extra).strip()

                # Rating distribution: mostly 4-5, occasional 3-3.5
                rating_weights = [0.05, 0.05, 0.10, 0.35, 0.45]  # 3.0, 3.5, 4.0, 4.5, 5.0
                rating = random.choices([3.0, 3.5, 4.0, 4.5, 5.0], weights=rating_weights, k=1)[0]

                review_date = base_date + timedelta(days=random.randint(0, 540))

                review = Review(
                    business_id=biz.id,
                    user_id=reviewer.id,
                    rating=rating,
                    comment=comment,
                )
                db.add(review)
                total_reviews += 1

        db.commit()
        print(f"  [OK] Created {total_reviews} reviews across {len(created_businesses)} businesses")

        # ── 5. Seed Services ──────────────────────────────────
        print("\n[5/8] Assigning services to each business...")
        total_services = 0
        for biz in created_businesses:
            num_services = random.randint(8, 12)
            chosen = random.sample(SERVICES_POOL, min(num_services, len(SERVICES_POOL)))
            for sname, sduration, sprice in chosen:
                svc = Service(
                    business_id=biz.id,
                    name=sname,
                    duration=sduration,
                    base_price=sprice,
                    popularity_score=random.randint(10, 100),
                )
                db.add(svc)
                total_services += 1
        db.commit()
        print(f"  [OK] Created {total_services} service entries")

        # ── 6. Seed Gallery Images ────────────────────────────
        print("\n[6/8] Adding gallery images...")
        total_gallery = 0
        for biz in created_businesses:
            for cat_name, urls in GALLERY_IMAGES.items():
                chosen_url = random.choice(urls)
                img = GalleryImage(
                    business_id=biz.id,
                    image_url=chosen_url,
                    title=f"{biz.business_name} - {cat_name}",
                    category=cat_name,
                    views_count=random.randint(50, 500),
                )
                db.add(img)
                total_gallery += 1
            # Add 1-2 extra product images
            for _ in range(random.randint(1, 2)):
                img = GalleryImage(
                    business_id=biz.id,
                    image_url=random.choice(GALLERY_IMAGES["Product"]),
                    title=f"{biz.business_name} - {random.choice(BRANDS)} Display",
                    category="Product",
                    views_count=random.randint(20, 300),
                )
                db.add(img)
                total_gallery += 1
        db.commit()
        print(f"  [OK] Created {total_gallery} gallery images")

        # ── 7. Seed Leads ─────────────────────────────────────
        print("\n[7/8] Generating demo leads...")
        lead_names = [
            ("Arjun Ravi", "+91 99441 10001", "iPhone 15 Pro Max inquiry"),
            ("Divya Lakshmi", "+91 99441 10002", "Samsung Galaxy S24 Ultra price"),
            ("Karthik Sundaram", "+91 99441 10003", "OnePlus 12 availability"),
            ("Meena Devi", "+91 99441 10004", "Budget phone under 15000"),
            ("Rajesh Panneer", "+91 99441 10005", "Phone screen replacement"),
            ("Suganthi M.", "+91 99441 10006", "EMI options for iPhone"),
            ("Vasanth Kumar", "+91 99441 10007", "Xiaomi 14 exchange offer"),
            ("Pooja Rangan", "+91 99441 10008", "AirPods Pro 2 stock check"),
        ]
        total_leads = 0
        for biz in created_businesses:
            num_leads = random.randint(3, 8)
            chosen_leads = random.sample(lead_names, num_leads)
            for lname, lphone, linterest in chosen_leads:
                lead = Lead(
                    business_id=biz.id,
                    customer_name=lname,
                    customer_phone=lphone,
                    service_interest=linterest,
                )
                db.add(lead)
                total_leads += 1
        db.commit()
        print(f"  [OK] Created {total_leads} leads")

        # ── 8. Seed SEO Data ──────────────────────────────────
        print("\n[8/8] Generating SEO entries...")

        # City SEO for Trichy
        existing_city = db.query(CitySEO).filter(CitySEO.city == CITY_SHORT).first()
        if not existing_city:
            city_seo = CitySEO(
                city=CITY_SHORT,
                state=STATE,
                country=COUNTRY,
                slug="trichy",
                description=(
                    "Tiruchirappalli (Trichy) is a major city in Tamil Nadu, India, known for its "
                    "rich cultural heritage, educational institutions, and thriving commercial districts. "
                    "Find the best local businesses, shops, and services in Trichy on BizDial."
                ),
                seo_title="Best Local Businesses in Trichy | BizDial Tiruchirappalli",
                seo_description=(
                    "Discover top-rated businesses, shops, and services in Tiruchirappalli (Trichy), Tamil Nadu. "
                    "Compare reviews, ratings, and contact details on BizDial."
                ),
                canonical_url="/trichy",
                popular_categories=["Shopping & Retail", "Restaurants & Food", "Healthcare & Medical"],
                faq=[
                    {"question": "What are the best mobile shops in Trichy?", "answer": "Poorvika Mobiles, The Chennai Mobiles, Supreme Mobiles, Phonup Trichy, and Silickon Mobiles are among the highest-rated mobile shops."},
                    {"question": "Where can I buy iPhones in Trichy?", "answer": "Most Poorvika Mobiles outlets, The Chennai Mobiles (Thillai Nagar), and Phonup Trichy carry the latest iPhone models."},
                ],
            )
            db.add(city_seo)
            print("  [+] Created City SEO for Trichy")

        # Category SEO for Mobile Shops
        existing_cat_seo = db.query(CategorySEO).filter(CategorySEO.slug == "mobile-shops-trichy").first()
        if not existing_cat_seo:
            cat_seo = CategorySEO(
                category_name="Mobile Shops",
                slug="mobile-shops-trichy",
                seo_title="Best Mobile Shops in Trichy | Top Phone Stores | BizDial",
                meta_description=(
                    "Find the best mobile phone shops in Tiruchirappalli. Compare prices, ratings, and reviews of top "
                    "smartphone dealers including Poorvika Mobiles, The Chennai Mobiles, Supreme Mobiles, and more on BizDial."
                ),
                primary_keyword="mobile shop trichy",
                secondary_keywords=[
                    "best mobile shop trichy", "iphone dealer trichy", "samsung store trichy",
                    "smartphone showroom trichy", "mobile accessories trichy", "phone exchange trichy",
                ],
                faq=FAQ_DATA,
                schema_type="LocalBusiness",
            )
            db.add(cat_seo)
            print("  [+] Created Category SEO for Mobile Shops")

        # SEO Keywords
        seo_keywords_data = [
            ("mobile shop trichy", "Shopping & Retail", "Mobile & Accessories", CITY_SHORT, "", "High", 8100, 35),
            ("best mobile shop in trichy", "Shopping & Retail", "Mobile & Accessories", CITY_SHORT, "", "High", 5400, 42),
            ("iphone dealer trichy", "Shopping & Retail", "Mobile & Accessories", CITY_SHORT, "", "High", 3600, 28),
            ("samsung showroom trichy", "Shopping & Retail", "Mobile & Accessories", CITY_SHORT, "", "Medium", 2900, 30),
            ("poorvika mobiles trichy", "Shopping & Retail", "Mobile & Accessories", CITY_SHORT, "", "High", 6700, 22),
            ("mobile accessories trichy", "Shopping & Retail", "Mobile & Accessories", CITY_SHORT, "", "Medium", 2200, 25),
            ("phone exchange trichy", "Shopping & Retail", "Mobile & Accessories", CITY_SHORT, "", "Medium", 1800, 20),
            ("mobile repair trichy", "Shopping & Retail", "Mobile & Accessories", CITY_SHORT, "", "Medium", 4500, 38),
            ("smartphone showroom trichy", "Shopping & Retail", "Mobile & Accessories", CITY_SHORT, "", "Low", 1200, 18),
            ("mobile emi trichy", "Shopping & Retail", "Mobile & Accessories", CITY_SHORT, "", "Low", 900, 15),
        ]
        kw_count = 0
        for kw, cat, sub, city, area, pri, vol, diff in seo_keywords_data:
            existing_kw = db.query(SEOKeyword).filter(SEOKeyword.keyword == kw).first()
            if not existing_kw:
                skw = SEOKeyword(
                    keyword=kw, category=cat, sub_category=sub, city=city, area=area,
                    priority=pri, monthly_search_volume=vol, difficulty=diff,
                    competition="Medium", status="Active", is_featured=(pri == "High"),
                    target_url=f"/shopping-retail/mobile-accessories/trichy",
                    meta_title=f"{kw.title()} | BizDial",
                    meta_description=f"Find the best {kw} on BizDial. Compare ratings, reviews, and prices.",
                    schema_type="LocalBusiness", is_indexed=True,
                )
                db.add(skw)
                kw_count += 1
        db.commit()
        print(f"  [OK] Created {kw_count} SEO keywords")

        # ── DONE ──────────────────────────────────────────────
        print("\n" + "=" * 70)
        print("  SUCCESS: 15 Trichy Mobile Shops Seeded Successfully!")
        print("=" * 70)
        print("\n  Owner Login Credentials:")
        print("  " + "-" * 50)
        for idx, bdata in enumerate(BUSINESSES, start=1):
            print(f"  owner{idx:03d}@bizdial.com / {PASSWORD}  ->  {bdata['name']}")
        print("\n  Admin: admin@bizdial.com / password123")
        print("=" * 70)

    except Exception as e:
        db.rollback()
        print(f"\n  FAILED: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()


def ensure_demo_data():
    """Called on app startup - only seeds if demo data doesn't exist."""
    db = SessionLocal()
    try:
        first_slug = BUSINESSES[0]["slug"]
        existing = db.query(Business).filter(Business.slug == first_slug).first()
        if not existing:
            db.close()
            seed_trichy_mobiles()
        else:
            db.close()
    except Exception:
        db.close()



if __name__ == '__main__':
    print('Running seed_seed_all...')
    seed_seed_all()
    print('Running seed_locations...')
    seed_locations()
    print('Running seed_seed_master_categories...')
    seed_seed_master_categories()
    print('Running seed_real_data...')
    seed_real_data()
    print('Running seed_trichy_mobiles...')
    seed_trichy_mobiles()
    print('Master seed completed successfully!')
