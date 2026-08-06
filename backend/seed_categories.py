import sys
import re
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.category import Category
from app.models.subcategory import Subcategory
from app.models.category_keyword import CategoryKeyword
from app.models.master_service import MasterService
from app.models.business_service_mapping import BusinessServiceMapping
from app.models.business import Business
from app.models.user import User
from app.models.review import Review
from app.models.business_category_mapping import BusinessCategoryMapping

categories_data = {
    "Shopping": [
        "Mobile Shops", "Laptop Stores", "Computer Stores", "Electronics Stores",
        "TV & Home Appliance Dealers", "Camera Stores", "Furniture Stores",
        "Clothing Stores", "Footwear Stores", "Jewellery Stores", "Grocery & Supermarkets",
        "Gift Shops", "Book Stores", "Toy Shops", "Sports Goods Stores", "Optical Stores",
        "Watch Stores", "Pet Shops"
    ],
    "Restaurants & Food": [
        "Restaurants", "Veg Restaurants", "Non-Veg Restaurants", "Cafes", "Coffee Shops",
        "Bakeries", "Sweet Shops", "Juice Shops", "Ice Cream Parlours", "Fast Food",
        "Pizza Outlets", "Biryani Restaurants", "Chinese Restaurants", "Seafood Restaurants",
        "Catering Services", "Food Delivery Kitchens"
    ],
    "Healthcare": [
        "Multi-Speciality Hospitals", "Clinics", "Dental Clinics", "Eye Hospitals",
        "ENT Specialists", "Orthopedic Clinics", "Pediatric Clinics", "Gynecology Clinics",
        "Physiotherapy Centers", "Diagnostic Labs", "Blood Banks", "Pharmacies",
        "Ambulance Services", "Home Nursing", "Mental Health Clinics"
    ],
    "Hotels & Travel": [
        "Hotels", "Resorts", "Lodges", "Guest Houses", "Homestays", "Travel Agencies",
        "Tour Operators", "Car Rentals", "Bike Rentals", "Taxi Services",
        "Bus Ticket Booking", "Train Ticket Booking", "Flight Booking", "Holiday Packages",
        "Visa Services"
    ],
    "Beauty & Wellness": [
        "Beauty Parlours", "Hair Salons", "Men's Salons", "Spa Centers", "Massage Centers",
        "Bridal Makeup", "Tattoo Studios", "Nail Studios", "Skin Clinics", "Cosmetic Clinics",
        "Yoga Centers", "Meditation Centers", "Wellness Centers", "Fitness Studios",
        "Nutrition Consultants"
    ],
    "Home Services": [
        "Electricians", "Plumbers", "Carpenters", "Painters", "House Cleaning",
        "Pest Control", "AC Repair", "Refrigerator Repair", "Washing Machine Repair",
        "RO Water Purifier Service", "CCTV Installation", "Interior Cleaning",
        "Home Security Systems", "Movers & Packers", "Gardening Services"
    ],
    "Automotive": [
        "Car Dealers", "Used Car Dealers", "Bike Dealers", "Electric Vehicle Dealers",
        "Car Service Centers", "Bike Service Centers", "Car Wash", "Wheel Alignment",
        "Tyre Shops", "Battery Dealers", "Auto Spare Parts", "Car Accessories",
        "Fuel Stations", "Driving Schools", "Towing Services"
    ],
    "Education": [
        "Schools", "Colleges", "Universities", "Coaching Centers", "Tuition Centers",
        "Computer Training", "Spoken English Institutes", "Music Classes", "Dance Classes",
        "Art Classes", "Online Learning Centers", "Library Services", "Montessori Schools",
        "Skill Development Institutes", "Competitive Exam Coaching"
    ],
    "Real Estate": [
        "Property Dealers", "Builders", "Apartments", "Villas", "Commercial Properties",
        "Rental Properties", "Land Sales", "Property Consultants", "Interior Designers",
        "Architects", "Property Valuation", "Property Management", "Home Loans",
        "Real Estate Legal Services", "Construction Consultants"
    ],
    "Professional Services": [
        "Chartered Accountants", "Company Registration", "Tax Consultants", "Auditors",
        "Business Consultants", "HR Consultants", "Marketing Agencies", "Branding Agencies",
        "Recruitment Agencies", "Translation Services", "Virtual Assistants",
        "Documentation Services", "Notary Services", "Business Licensing", "Freelance Services"
    ],
    "IT & Software": [
        "Software Companies", "Web Development", "Mobile App Development", "Digital Marketing",
        "SEO Services", "UI/UX Design", "Graphic Design", "Cloud Services", "AI & Machine Learning",
        "Cybersecurity", "IT Support", "Networking Services", "Data Recovery",
        "Hosting Providers", "ERP Solutions"
    ],
    "Electronics": [
        "Mobile Repair", "Laptop Repair", "Computer Repair", "TV Repair", "Printer Repair",
        "CCTV Dealers", "Home Appliances Repair", "Inverter Dealers", "UPS Dealers",
        "Solar Equipment", "Generator Dealers", "Electronic Components", "Audio Systems",
        "Smart Home Devices", "Networking Equipment"
    ],
    "Finance": [
        "Banks", "ATMs", "Insurance Agents", "Loan Consultants", "Mutual Funds",
        "Stock Brokers", "Gold Loan", "Micro Finance", "Forex Services", "Financial Advisors",
        "Credit Card Services", "Investment Consultants", "Tax Saving Plans",
        "Pension Advisors", "Wealth Management"
    ],
    "Legal Services": [
        "Advocates", "Civil Lawyers", "Criminal Lawyers", "Family Lawyers", "Property Lawyers",
        "Corporate Lawyers", "Legal Documentation", "Notary Public", "Arbitration Services",
        "Consumer Court Lawyers", "Divorce Lawyers", "Trademark Registration",
        "Copyright Registration", "Legal Consultants", "Court Typing Services"
    ],
    "Construction": [
        "Building Contractors", "Civil Contractors", "Road Contractors", "Roofing Contractors",
        "Masonry", "Steel Fabrication", "Tiles & Flooring", "Cement Dealers", "Sand Suppliers",
        "Bricks Suppliers", "Plumbing Contractors", "Electrical Contractors", "Borewell Services",
        "Surveyors", "Building Material Suppliers"
    ],
    "Industrial": [
        "Manufacturing Units", "Industrial Machinery", "Welding Services", "Fabrication",
        "Packaging", "Warehousing", "Cold Storage", "Chemical Suppliers",
        "Industrial Safety Equipment", "Conveyor Systems", "Pumps & Motors", "Compressors",
        "Industrial Automation", "Factory Maintenance", "Engineering Services"
    ],
    "Agriculture": [
        "Seed Suppliers", "Fertilizer Dealers", "Pesticide Dealers", "Farm Equipment",
        "Tractor Dealers", "Irrigation Systems", "Dairy Farms", "Poultry Farms",
        "Organic Farming", "Greenhouses", "Veterinary Farm Services", "Crop Consultants",
        "Soil Testing", "Agri Machinery Repair", "Livestock Feed"
    ],
    "Sports & Fitness": [
        "Gyms", "Fitness Centers", "Personal Trainers", "Swimming Pools", "Sports Academies",
        "Cricket Coaching", "Football Coaching", "Badminton Courts", "Tennis Courts",
        "Indoor Stadiums", "Outdoor Stadiums", "Martial Arts", "Cycling Clubs",
        "Adventure Sports", "Sports Equipment Stores"
    ],
    "Entertainment": [
        "Movie Theatres", "Event Organizers", "DJs", "Photography", "Videography",
        "Music Bands", "Dance Troupes", "Gaming Zones", "Amusement Parks", "Water Parks",
        "Karaoke", "Party Halls", "Convention Centers", "Cultural Centers", "Live Music Venues"
    ],
    "Pets & Veterinary": [
        "Veterinary Hospitals", "Pet Clinics", "Pet Shops", "Pet Grooming", "Pet Boarding",
        "Dog Trainers", "Pet Food Stores", "Aquarium Shops", "Bird Shops", "Horse Care",
        "Animal Shelters", "Pet Adoption", "Exotic Pets", "Pet Accessories", "Pet Insurance"
    ],
    "Religious Places": [
        "Temples", "Churches", "Mosques", "Gurudwaras", "Jain Temples", "Buddhist Temples",
        "Ashrams", "Pilgrimage Centers", "Religious Trusts", "Prayer Halls"
    ],
    "Courier & Logistics": [
        "Courier Services", "International Courier", "Domestic Courier", "Cargo Services",
        "Freight Forwarding", "Packers & Movers", "Warehouse Services", "Logistics Companies",
        "Transport Companies", "Last Mile Delivery"
    ],
    "Printing & Advertising": [
        "Printing Press", "Offset Printing", "Digital Printing", "Flex Printing", "Sign Boards",
        "LED Boards", "Advertising Agencies", "Newspaper Advertising", "Radio Advertising",
        "Branding Solutions"
    ],
    "Repair & Maintenance": [
        "Appliance Repair", "Mobile Repair", "Computer Repair", "Furniture Repair",
        "Watch Repair", "Shoe Repair", "Key Makers", "Lock Repair", "Generator Repair",
        "Inverter Repair"
    ],
    "Government Services": [
        "Passport Services", "Aadhaar Centers", "PAN Services", "RTO Services",
        "Municipality Offices", "Corporation Offices", "Electricity Board", "Water Board",
        "Public Service Centers", "Land Records"
    ],
    "Event Services": [
        "Wedding Planners", "Birthday Planners", "Decoration Services", "Catering",
        "Photography", "Videography", "Sound Systems", "Lighting Services", "Stage Decoration",
        "Event Venues"
    ],
    "Electrical Services": [
        "Electrical Contractors", "Electricians", "Solar Installation", "Generator Services",
        "Inverter Services", "UPS Services", "Electrical Shops", "Cable Installation",
        "Lighting Solutions", "Transformer Services"
    ],
    "Plumbing Services": [
        "Residential Plumbing", "Commercial Plumbing", "Borewell Services", "Water Tank Cleaning",
        "Pipe Installation", "Drain Cleaning", "Leak Repair", "Bathroom Fittings",
        "Kitchen Plumbing", "Water Pump Installation"
    ],
    "Furniture & Interior": [
        "Modular Kitchen", "Interior Designers", "Furniture Shops", "Office Furniture",
        "Sofa Dealers", "Mattress Dealers", "Curtain Shops", "Wallpaper Dealers",
        "Wooden Flooring", "False Ceiling"
    ],
    "Astrology & Spiritual Services": [
        "Astrologers", "Vastu Consultants", "Numerologists", "Palmists", "Tarot Card Readers",
        "Pandits & Purohits", "Feng Shui Consultants", "Spiritual Healers", "Horoscope Matching",
        "Gemstone Dealers"
    ],
    "Matrimony & Wedding Services": [
        "Marriage Bureaus", "Wedding Planners", "Bridal Wear Stores", "Groom Wear Stores",
        "Wedding Photographers", "Wedding Caterers", "Mehendi Artists", "Wedding Invitation Cards",
        "Wedding Venues", "Honeymoon Packages"
    ],
    "Laundry & Dry Cleaning": [
        "Dry Cleaners", "Laundry Services", "Ironing Services", "Carpet Cleaning",
        "Curtain Cleaning", "Sofa Cleaning", "Shoe Cleaning", "Uniform Laundry",
        "Industrial Laundry", "Home Laundry Pickup"
    ],
    "Tailoring & Boutique": [
        "Tailors", "Boutiques", "Fashion Designers", "Alteration Services", "Embroidery Services",
        "Uniform Stitching", "Blouse Stitching", "Suit Stitching", "Saree Draping", "Costume Designers"
    ],
    "Baby & Elderly Care": [
        "Daycare Centers", "Preschools", "Baby Sitters", "Nanny Services", "Old Age Homes",
        "Elderly Care Services", "Physiotherapy for Elderly", "Baby Products Stores",
        "Maternity Care", "Special Needs Care"
    ],
    "Import, Export & Trading": [
        "Import Export Agents", "Custom House Agents", "Trading Companies", "Wholesale Dealers",
        "Distributors", "Stockists", "B2B Marketplaces", "Sourcing Agents", "Shipping Agents",
        "Trade Consultants"
    ],
    "Textile & Garments": [
        "Textile Manufacturers", "Garment Manufacturers", "Fabric Wholesalers", "Yarn Dealers",
        "Dyeing Units", "Printing Units (Textile)", "Hosiery Manufacturers", "Saree Manufacturers",
        "Readymade Garment Dealers", "Textile Machinery"
    ],
    "Mining & Quarry": [
        "Stone Quarries", "Mining Companies", "Sand Mining", "Granite Suppliers", "Marble Suppliers",
        "Mineral Traders", "Crusher Units", "Mining Equipment", "Blasting Services", "Ore Suppliers"
    ],
    "Language & Translation": [
        "Translation Services", "Interpreters", "Language Institutes", "Content Localization",
        "Document Translation", "Sign Language Interpreters", "Subtitling Services",
        "Foreign Language Coaching", "Transcription Services", "Proofreading Services"
    ],
    "Currency & Money Exchange": [
        "Currency Exchange", "Money Transfer Agents", "Forex Card Providers", "Remittance Services",
        "Cryptocurrency Consultants", "Cheque Cashing", "Prepaid Card Services", "Gold Exchange",
        "Money Lenders", "Pawn Brokers"
    ],
    "Others": [
        "NGOs", "Associations", "Clubs", "Community Centers", "Public Utilities",
        "Freelancers", "Miscellaneous Services", "Startups", "Co-working Spaces", "Business Centers"
    ]
}

def generate_slug(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text

def seed_categories():
    db: Session = SessionLocal()
    try:
        total_categories = 0
        total_subcategories = 0
        
        for i, (cat_name, subcats) in enumerate(categories_data.items()):
            slug = generate_slug(cat_name)
            
            # Check if category exists
            category = db.query(Category).filter(Category.slug == slug).first()
            if not category:
                category = Category(
                    name=cat_name,
                    slug=slug,
                    icon='default',
                    display_order=i+1
                )
                db.add(category)
                db.flush() # get category id
                total_categories += 1
                
            # Add subcategories
            for j, subcat_name in enumerate(subcats):
                subcat_slug = generate_slug(subcat_name)
                
                # Check if subcategory exists
                subcategory = db.query(Subcategory).filter(Subcategory.slug == subcat_slug).first()
                if not subcategory:
                    subcategory = Subcategory(
                        category_id=category.id,
                        name=subcat_name,
                        slug=subcat_slug,
                        icon='default',
                        display_order=j+1
                    )
                    db.add(subcategory)
                    total_subcategories += 1
                    
        db.commit()
        print(f"Successfully seeded {total_categories} Categories and {total_subcategories} Subcategories!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding categories: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_categories()
