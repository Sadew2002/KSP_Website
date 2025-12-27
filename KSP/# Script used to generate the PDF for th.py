# Script used to generate the PDF for the user
from fpdf import FPDF

class ProjectPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 15)
        self.cell(0, 10, 'Smart Phone Selling & Management System', ln=True, align='C')
        self.set_font('Helvetica', 'I', 10)
        self.cell(0, 10, 'Creative Requirement Summary for Clients', ln=True, align='C')
        self.ln(5)

    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 12)
        self.set_fill_color(240, 240, 240)
        self.cell(0, 10, f"  {title}", ln=True, fill=True)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Helvetica', '', 10)
        self.multi_cell(0, 7, body)
        self.ln()

pdf = ProjectPDF()
pdf.add_page()

# PAGE 1
pdf.chapter_title("1. THE CUSTOMER JOURNEY - From Browse to Buy")
pdf.chapter_body(
    "• SECURE ACCESS: High-security login and registration. Every user gets a personal profile to track their orders.\n"
    "• SMART CATALOG: A visual showroom where phones are categorized by Brand, Price, and Condition (New/Used).\n"
    "• POWER SEARCH: Instant filters and keywords help customers find their dream phone in seconds.\n"
    "• PRODUCT DEEP-DIVE: Full technical specs, high-res images, and 'Live Stock' indicators (Green = Ready to Ship).\n"
    "• SMART CART: A flexible shopping basket that calculates totals, taxes, and shipping automatically.\n"
    "• FLEXIBLE PAYMENTS: Integrated support for Cash on Delivery (COD) and Online Payments (Visa/MasterCard)."
)

pdf.chapter_title("2. THE SHOPPING EXPERIENCE HIGHLIGHTS")
pdf.chapter_body(
    "• AUTO-CONFIRMATION: Customers receive a unique Order ID and confirmation immediately after purchase.\n"
    "• RESPONSIVE DESIGN: The store looks and works perfectly on iPhones, Androids, Tablets, and Laptops."
)

# PAGE 2
pdf.add_page()
pdf.chapter_title("3. THE BUSINESS ENGINE - Admin Power")
pdf.chapter_body(
    "• COMMAND CENTER: A secure, restricted dashboard for your team to manage the entire business.\n"
    "• INVENTORY WIZARD: Add new stock, update prices, or create new categories (e.g., Accessories) instantly.\n"
    "• ORDER TRACKER: View and update order statuses from 'Pending' to 'Shipped' to 'Delivered'.\n"
    "• SALES INSIGHTS: Visual summaries of your best-selling brands and monthly revenue trends."
)

pdf.chapter_title("4. PERFORMANCE & TRUST (Non-Functional)")
pdf.chapter_body(
    "• LIGHTNING SPEED: Pages load in under 3 seconds to ensure customers never lose interest.\n"
    "• DATA PROTECTION: Industry-standard SSL/HTTPS encryption. Your customer data is encrypted and safe.\n"
    "• ALWAYS ONLINE: 24/7 availability with automated daily backups to prevent any data loss."
)

pdf.chapter_title("5. THE ROADMAP (Phase 2 & Beyond)")
pdf.chapter_body(
    "• AI RECOMMENDATIONS: Suggest phones based on user preference and budget.\n"
    "• CUSTOMER REVIEWS: Let buyers leave 5-star ratings and feedback.\n"
    "• MOBILE APP: Native iOS and Android apps for a faster, 'one-tap' shopping experience."
)

pdf.output("/mnt/data/Smartphone_System_Summary.pdf")