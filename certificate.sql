-- Certificate Applications Table 
CREATE TABLE certificate_applications (
    application_id VARCHAR(20) PRIMARY KEY,
    applicant_name VARCHAR(100) NOT NULL,
    village_name VARCHAR(100) NOT NULL,
    aadhar_number VARCHAR(12) NOT NULL,
    mobile_number VARCHAR(10) NOT NULL,
    certificate_type ENUM('birth', 'death', 'ayushman', 'rtc') NOT NULL,
    additional_remarks TEXT,
    declaration_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    application_status ENUM('pending', 'under_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Birth Certificate Details Table
CREATE TABLE birth_certificate_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(20) NOT NULL,
    child_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    father_name VARCHAR(100) NOT NULL,
    mother_name VARCHAR(100) NOT NULL,
    birth_place VARCHAR(100) NOT NULL,
    reason_for_certificate VARCHAR(50) NOT NULL,
    FOREIGN KEY (application_id) REFERENCES certificate_applications(application_id) ON DELETE CASCADE
);

-- Death Certificate Details Table
CREATE TABLE death_certificate_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(20) NOT NULL,
    deceased_name VARCHAR(100) NOT NULL,
    date_of_death DATE NOT NULL,
    age_at_death INT NOT NULL,
    relation_to_applicant VARCHAR(50) NOT NULL,
    death_place VARCHAR(100) NOT NULL,
    reason_for_certificate VARCHAR(50) NOT NULL,
    FOREIGN KEY (application_id) REFERENCES certificate_applications(application_id) ON DELETE CASCADE
);

-- Ayushman Card Details Table
CREATE TABLE ayushman_card_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(20) NOT NULL,
    family_head_name VARCHAR(100) NOT NULL,
    family_members INT NOT NULL,
    annual_income DECIMAL(12,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    ration_card_number VARCHAR(50) NOT NULL,
    existing_insurance TEXT,
    FOREIGN KEY (application_id) REFERENCES certificate_applications(application_id) ON DELETE CASCADE
);

-- RTC Details Table
CREATE TABLE rtc_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(20) NOT NULL,
    survey_number VARCHAR(50) NOT NULL,
    hissa_number VARCHAR(50) NOT NULL,
    landowner_name VARCHAR(100) NOT NULL,
    relation_to_owner VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluk VARCHAR(100) NOT NULL,
    hobli VARCHAR(100) NOT NULL,
    land_area DECIMAL(10,2) NOT NULL,
    current_crop TEXT,
    rtc_purpose VARCHAR(50) NOT NULL,
    FOREIGN KEY (application_id) REFERENCES certificate_applications(application_id) ON DELETE CASCADE
);

-- Certificate Supporting Documents Table
CREATE TABLE certificate_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(20) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES certificate_applications(application_id) ON DELETE CASCADE
);