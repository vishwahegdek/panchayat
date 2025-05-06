// application_form.js - Complete JavaScript for the scheme application form

document.addEventListener("DOMContentLoaded", function () {
  // Load sidebar
  fetch("sidebar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("sidebar-placeholder").innerHTML = data;
    });

  // Variables to track uploaded files
  let uploadedFiles = [];
  const documentUpload = document.getElementById("documentUpload");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const documentsContainer = document.getElementById("documentsContainer");
  let documentCounter = 0;

  // Handle document uploads
  documentUpload.addEventListener("change", function (event) {
    if (event.target.files.length > 0) {
      // Store the files for later submission
      for (let i = 0; i < event.target.files.length; i++) {
        uploadedFiles.push(event.target.files[i]);
      }

      fileNameDisplay.textContent = `Selected ${event.target.files.length} file(s)`;

      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const docItem = document.createElement("div");
        docItem.className = "document-item";
        docItem.id = `doc-${documentCounter}`;
        docItem.dataset.fileIndex = uploadedFiles.indexOf(file);

        // Get appropriate icon based on file type
        let fileIcon = "fa-file";
        if (file.type.includes("pdf")) {
          fileIcon = "fa-file-pdf";
        } else if (file.type.includes("image")) {
          fileIcon = "fa-file-image";
        } else if (file.type.includes("word")) {
          fileIcon = "fa-file-word";
        }

        docItem.innerHTML = `
                    <i class="fas ${fileIcon}"></i>
                    <span class="document-name">${file.name}</span>
                    <span class="document-size">(${formatFileSize(
                      file.size
                    )})</span>
                    <button type="button" class="btn-remove-document" onclick="removeDocument('doc-${documentCounter}', ${uploadedFiles.indexOf(
          file
        )})">
                        <i class="fas fa-times"></i>
                    </button>
                `;

        documentsContainer.appendChild(docItem);
        documentCounter++;
      }

      // Reset file input to allow selecting same file again
      event.target.value = "";
    } else {
      fileNameDisplay.textContent = "No file chosen";
    }
  });

  // Format file size
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  }

  // Function to remove documents - defined in global scope for the onclick attribute
  window.removeDocument = function (id, fileIndex) {
    document.getElementById(id).remove();

    // Remove the file from our uploadedFiles array
    if (fileIndex !== -1) {
      uploadedFiles.splice(fileIndex, 1);
    }

    // Update display text if no documents left
    if (documentsContainer.children.length === 0) {
      fileNameDisplay.textContent = "No file chosen";
    }
  };

  // Handle rejection reason display
  const statusRadios = document.querySelectorAll(
    'input[name="applicationStatus"]'
  );
  const rejectionReasonGroup = document.getElementById("rejectionReasonGroup");
  const rejectionReason = document.getElementById("rejectionReason");

  statusRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "rejected") {
        rejectionReasonGroup.style.display = "block";
        rejectionReason.setAttribute("required", "required");
      } else {
        rejectionReasonGroup.style.display = "none";
        rejectionReason.removeAttribute("required");
      }
    });
  });

  // Helper function to get selected radio button value
  function getSelectedRadioValue(name) {
    const radioButtons = document.getElementsByName(name);
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        return radioButton.value;
      }
    }
    return null;
  }

  // Function to upload documents
  async function uploadDocuments(applicationId) {
    if (uploadedFiles.length === 0) {
      return;
    }

    const formData = new FormData();

    // Add each file to the form data
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append("documents", uploadedFiles[i]);
    }

    // Upload the documents
    try {
      const response = await fetch(
        `http://localhost:3000/api/upload-documents/${applicationId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload documents");
      }

      return result;
    } catch (error) {
      console.error("Error uploading documents:", error);
      throw error;
    }
  }

  // Handle form submission
  const applicationForm = document.getElementById("schemeApplicationForm");

  applicationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    try {
      // Validate form data

      // Check if documents were uploaded
      if (uploadedFiles.length === 0) {
        alert("Please upload at least one document");
        throw new Error("No documents uploaded");
      }

      // Validate Aadhar number
      const aadharInput = document.getElementById("aadharNumber");
      if (!/^\d{12}$/.test(aadharInput.value)) {
        alert("Please enter a valid 12-digit Aadhar number");
        aadharInput.focus();
        throw new Error("Invalid Aadhar number");
      }

      // If status is rejected, ensure reason is provided
      const statusRejected = document.getElementById("statusRejected");
      if (statusRejected.checked && !rejectionReason.value.trim()) {
        alert("Please provide a reason for rejection");
        rejectionReason.focus();
        throw new Error("Rejection reason required");
      }

      // Get form data
      const applicationData = {
        applicantName: document.getElementById("applicantName").value,
        villageName: document.getElementById("villageName").value,
        aadharNumber: document.getElementById("aadharNumber").value,
        age: document.getElementById("age").value,
        gender: getSelectedRadioValue("gender"),
        schemeName: document.getElementById("schemeName").value,
        schemeId: document.getElementById("schemeId").value,
        applicationStatus: getSelectedRadioValue("applicationStatus"),
      };

      // If status is rejected, add the rejection reason
      if (statusRejected.checked) {
        applicationData.rejectionReason = rejectionReason.value;
      }

      // Submit the form data
      const response = await fetch("http://localhost:3000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      const applicationId = result.applicationId;

      // If submission was successful, upload documents
      await uploadDocuments(applicationId);

      // Show success message with application ID
      alert(
        `Application submitted successfully! Your Application ID is: ${applicationId}`
      );

      // Reset form
      applicationForm.reset();

      // Clear document list
      while (documentsContainer.firstChild) {
        documentsContainer.removeChild(documentsContainer.firstChild);
      }
      document.getElementById("fileNameDisplay").textContent = "No file chosen";

      // Clear uploaded files array
      uploadedFiles = [];
    } catch (error) {
      console.error("Error:", error);

      // Only show alert if it's not one of our validation errors we already alerted about
      if (
        !error.message.includes("Invalid Aadhar") &&
        !error.message.includes("No documents") &&
        !error.message.includes("Rejection reason")
      ) {
        alert("Error: " + error.message);
      }
    } finally {
      // Restore button state
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });

  // Fetch available schemes for the dropdown
  async function fetchSchemes() {
    try {
      const response = await fetch("http://localhost:3000/api/schemes");
      if (!response.ok) {
        throw new Error("Failed to fetch schemes");
      }

      const schemes = await response.json();

      const schemeNameInput = document.getElementById("schemeName");
      const schemeIdInput = document.getElementById("schemeId");

      // Create datalist for scheme names
      const datalist = document.createElement("datalist");
      datalist.id = "schemesList";

      schemes.forEach((scheme) => {
        const option = document.createElement("option");
        option.value = scheme.scheme_name;
        option.dataset.id = scheme.scheme_id;
        datalist.appendChild(option);
      });

      document.body.appendChild(datalist);
      schemeNameInput.setAttribute("list", "schemesList");

      // Auto-fill scheme ID when scheme name is selected
      schemeNameInput.addEventListener("input", function () {
        const selectedScheme = Array.from(datalist.options).find(
          (option) => option.value === this.value
        );

        if (selectedScheme) {
          schemeIdInput.value = selectedScheme.dataset.id;
        } else {
          schemeIdInput.value = "";
        }
      });
    } catch (error) {
      console.error("Error fetching schemes:", error);
    }
  }

  // Call the function to load schemes
  fetchSchemes();

  // Function to check application status by ID
  window.checkApplicationStatus = async function (applicationId) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/applications/${applicationId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          alert("Application not found with the given ID.");
          return;
        }
        throw new Error("Failed to fetch application status");
      }

      const application = await response.json();

      // Display application status in a modal or alert
      alert(
        `Application Status: ${application.status.toUpperCase()}${
          application.rejection_reason
            ? "\nReason: " + application.rejection_reason
            : ""
        }`
      );
    } catch (error) {
      console.error("Error checking application status:", error);
      alert("Error: " + error.message);
    }
  };
});
