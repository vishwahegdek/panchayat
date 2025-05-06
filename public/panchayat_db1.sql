
//schemes table
CREATE TABLE schemes (
    scheme_id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_name VARCHAR(255) NOT NULL,
    scheme_type VARCHAR(100),
    start_date DATE,
    end_date DATE,
    age_limit INT,
    beneficiary_count INT,
    total_budget DECIMAL(15, 2),
    details TEXT
);


//villager
CREATE TABLE villager (
    aadhar_num VARCHAR(12) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    dob DATE,
    gender VARCHAR(10),
    contact_num VARCHAR(15),
    caste VARCHAR(50),
    village_name VARCHAR(100)
);

//application
CREATE TABLE application (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_name VARCHAR(100) NOT NULL,
    aadhar_num VARCHAR(12),
    scheme_name VARCHAR(255),
    scheme_id INT,
    gender VARCHAR(10),
    age INT,
    contact_num VARCHAR(15),
    village_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aadhar_num) REFERENCES villager(aadhar_num),
    FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
);
CREATE TABLE application_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    document_path VARCHAR(255) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES application(application_id) ON DELETE CASCADE
);


//feedback
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    villager_name VARCHAR(100),
    village_name VARCHAR(100),
    aadhar_num VARCHAR(12),
    age INT,
    gender VARCHAR(10),
    contact_num VARCHAR(15),
    issue_details TEXT,
    improvement_suggestions TEXT,
    feedback_date DATE,
    FOREIGN KEY (aadhar_num) REFERENCES villager(aadhar_num)
);

//complaint

CREATE TABLE complaint (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    villager_name VARCHAR(100),
    village_name VARCHAR(100),
    aadhar_num VARCHAR(12),
    details TEXT,
    current_status VARCHAR(50),
    comments TEXT,
    FOREIGN KEY (aadhar_num) REFERENCES villager(aadhar_num)
);

//Tax details
CREATE TABLE tax_details (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    taxpayer_name VARCHAR(100),
    aadhar_num VARCHAR(12),
    house_number VARCHAR(50),
    village_name VARCHAR(100),
    tax_type VARCHAR(50),
    tax_period VARCHAR(50),
    total_amount DECIMAL(10, 2),
    amount_paid DECIMAL(10, 2),
    payment_date DATE,
    payment_type ENUM('Cash', 'Cheque', 'Online'),
    status VARCHAR(50),
    comments TEXT,
    FOREIGN KEY (aadhar_num) REFERENCES villager(aadhar_num)
);



//Admin
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    contact_num VARCHAR(15),
    email_id VARCHAR(100),
    address TEXT
);

//secretory
CREATE TABLE secretory (
    secretory_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    DOB DATE NOT NULL,
    contact_num VARCHAR(15) NOT NULL,
    email_id VARCHAR(100) NOT NULL UNIQUE,
    address TEXT
);

