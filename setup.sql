CREATE DATABASE IF NOT EXISTS panchayat_db;
USE panchayat_db;


CREATE TABLE schemes (
    scheme_id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_name VARCHAR(255) NOT NULL,
    scheme_type VARCHAR(100),
    start_date DATE,
    end_date DATE,
    age_limit INT,
    beneficiary_count INT,
    total_budget DECIMAL(15, 2),
    details TEXT,
    status VARCHAR(50) DEFAULT 'Active'
);



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
    village_name VARCHAR(100),
    passwd VARCHAR(100)
);


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

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  feedback_id INT AUTO_INCREMENT PRIMARY KEY,
  feedback_reference VARCHAR(20) NOT NULL,
  citizen_name VARCHAR(100) NOT NULL,
  village_name VARCHAR(100) NOT NULL,
  aadhar_number VARCHAR(12) NOT NULL,
  mobile_number VARCHAR(10) NOT NULL,
  email_address VARCHAR(100),
  feedback_type ENUM('suggestion', 'complaint', 'appreciation') NOT NULL,
  department VARCHAR(50) NOT NULL,
  feedback_details TEXT NOT NULL,
  quality_rating INT NOT NULL,
  improvement_suggestions TEXT,
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'under_review', 'resolved', 'closed') DEFAULT 'pending'
);

-- Create feedback documents table
CREATE TABLE IF NOT EXISTS feedback_documents (
  document_id INT AUTO_INCREMENT PRIMARY KEY,
  feedback_id INT NOT NULL,
  document_path VARCHAR(255) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (feedback_id) REFERENCES feedback(feedback_id) ON DELETE CASCADE
);