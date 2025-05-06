-- Insert sample data
INSERT INTO schemes (scheme_name, scheme_type, start_date, end_date, age_limit, beneficiary_count, total_budget, details, status) VALUES
('PM Kisan Samman Nidhi', 'Agricultural', '2023-02-01', '2026-01-31', 18, 845, 3000000.00, 'Financial assistance of Rs. 6,000 per year for farmer families holding cultivable land.', 'Active'),
('Pradhan Mantri Awas Yojana', 'Housing', '2023-03-15', '2025-03-14', 21, 356, 2500000.00, 'Financial assistance for housing for the rural poor to provide pucca houses with basic amenities.', 'Active'),
('National Rural Employment Guarantee', 'Employment', '2023-04-01', '2026-03-31', 18, 1240, 4500000.00, 'Provides at least 100 days of wage employment in a financial year to every household.', 'Active'),
('Swachh Bharat Mission', 'Infrastructure', '2023-01-01', '2025-12-31', 0, 450, 1800000.00, 'Clean India initiative for improving sanitation infrastructure and waste management.', 'Active'),
('PM Jan Dhan Yojana', 'Financial', '2022-10-15', '2025-10-14', 18, 980, 800000.00, 'Financial inclusion program providing access to financial services for all households.', 'Active'),
('Beti Bachao Beti Padhao', 'Educational', '2023-05-01', '2026-04-30', 0, 325, 1200000.00, 'Initiative to address the declining child sex ratio and promote girl education.', 'Active'),
('Ayushman Bharat', 'Health & Welfare', '2023-01-15', '2026-01-14', 0, 1560, 3800000.00, 'Health insurance scheme providing coverage for poor and vulnerable families.', 'Active'),
('Jal Jeevan Mission', 'Infrastructure', '2022-11-01', '2025-10-31', 0, 420, 3200000.00, 'Program to provide tap water connection to every rural household.', 'Active'),
('PM Ujjwala Yojana', 'Welfare', '2023-03-01', '2026-02-28', 18, 678, 1500000.00, 'Scheme to provide LPG connections to women from below poverty line households.', 'Active');

INSERT INTO schemes (
    scheme_name, scheme_type, start_date, end_date, age_limit, beneficiary_count, total_budget, details, status
) VALUES
('Digital Gramin Seva', 'Technology', '2023-07-01', '2026-06-30', 18, 520, 1000000.00, 'Promotes digital literacy and internet access in rural areas through training and infrastructure.', 'Active'),
('Krishi Yantra Vitaran Yojana', 'Agricultural', '2023-06-15', '2026-06-14', 21, 610, 2700000.00, 'Subsidized distribution of modern farming equipment to small and marginal farmers.', 'Active'),
('Rural Women Empowerment Program', 'Welfare', '2023-05-20', '2026-05-19', 18, 430, 950000.00, 'Support for women self-help groups, skill development, and micro-loans.', 'Active'),
('Green Village Mission', 'Environment', '2023-08-01', '2026-07-31', 0, 300, 2200000.00, 'Initiative for sustainable rural development including tree plantation and solar power adoption.', 'Active'),
('Rural IT Hub Scheme', 'Technology', '2023-09-01', '2026-08-31', 18, 250, 1500000.00, 'Establishment of IT training and job centers in villages to promote employment.', 'Active'),
('Village Road Connectivity Scheme', 'Infrastructure', '2023-04-10', '2026-04-09', 0, 750, 4000000.00, 'Construction and improvement of roads connecting remote villages.', 'Active'),
('Gramin Skill Development Mission', 'Employment', '2023-10-01', '2026-09-30', 16, 1100, 3000000.00, 'Vocational training and certification for rural youth.', 'Active'),
('Clean Cooking Fuel Scheme', 'Health & Welfare', '2023-12-01', '2026-11-30', 18, 500, 1700000.00, 'Provides clean fuel alternatives and efficient cookstoves to rural households.', 'Active'),
('Pension for Elderly Villagers', 'Welfare', '2023-03-01', '2026-02-28', 60, 670, 2100000.00, 'Monthly pension support for senior citizens in rural areas.', 'Active'),
('Child Nutrition Mission', 'Health & Welfare', '2023-01-20', '2026-01-19', 0, 820, 2600000.00, 'Nutritional support and health checkups for children below 6 years.', 'Active');


INSERT INTO villager (
    aadhar_num, first_name, last_name, father_name, mother_name, dob, gender, contact_num, caste, village_name
) VALUES
('123456789012', 'Ravi', 'Kumar', 'Suresh Kumar', 'Meena Devi', '1985-06-15', 'Male', '9876543210', 'OBC', 'Rampur'),
('234567890123', 'Sita', 'Devi', 'Raghunath Prasad', 'Kamla Devi', '1990-09-25', 'Female', '9876543211', 'SC', 'Lakshmipur'),
('345678901234', 'Amit', 'Sharma', 'Mahesh Sharma', 'Sunita Sharma', '1992-01-10', 'Male', '9876543212', 'General', 'Bhagwanpur'),
('456789012345', 'Pooja', 'Verma', 'Dinesh Verma', 'Neelam Verma', '1995-11-05', 'Female', '9876543213', 'OBC', 'Rampur'),
('567890123456', 'Ramesh', 'Yadav', 'Shyam Yadav', 'Radha Yadav', '1988-03-20', 'Male', '9876543214', 'OBC', 'Lakshmipur');
