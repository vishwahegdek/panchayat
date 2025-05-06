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

-- Create index for faster lookups
CREATE INDEX idx_feedback_reference ON feedback(feedback_reference);
CREATE INDEX idx_feedback_aadhar ON feedback(aadhar_number);