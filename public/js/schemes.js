// API Base URL - Change this to match your server
const API_BASE_URL = "http://localhost:3000/api";

// State
let allSchemes = [];
let currentFilter = "All";

// DOM Elements - Get elements after DOM is loaded
let schemeContainer;
let filterPills;
let searchInput;
let totalSchemesElement;
let totalBeneficiariesElement;
let totalBudgetElement;

// Fetch all schemes from API
async function fetchSchemes() {
  try {
    const response = await fetch(`${API_BASE_URL}/schemes`);
    if (!response.ok) {
      throw new Error("Failed to fetch schemes");
    }
    console.log("Schemes fetched");
    allSchemes = await response.json();
    updateStats(allSchemes);
    renderSchemes(allSchemes);
  } catch (error) {
    console.error("Error:", error);
    if (schemeContainer) {
      schemeContainer.innerHTML = `<div class="alert alert-danger">Failed to load schemes. Please try again later.</div>`;
    }
  }
}

// Format date to DD-MMM-YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Format currency to Indian format
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Update stats at the top of the page
function updateStats(schemes) {
  // Check if elements exist before updating them
  if (totalSchemesElement) {
    // Update total schemes count
    totalSchemesElement.textContent = schemes.length;
  }

  if (totalBeneficiariesElement) {
    // Calculate total beneficiaries
    const totalBeneficiaries = schemes.reduce(
      (sum, scheme) => sum + scheme.beneficiary_count,
      0
    );
    totalBeneficiariesElement.textContent = new Intl.NumberFormat(
      "en-IN"
    ).format(totalBeneficiaries);
  }

  if (totalBudgetElement) {
    // Calculate total budget
    const totalBudget = schemes.reduce(
      (sum, scheme) => sum + Number(scheme.total_budget),
      0
    );
    // Format as Crores for display
    const budgetInCrores = (totalBudget / 10000000).toFixed(1);
    totalBudgetElement.textContent = `₹ ${budgetInCrores} Cr`;
  }
}

// Render schemes to the UI
function renderSchemes(schemes) {
  if (!schemeContainer) {
    console.error("Scheme container not found in the DOM");
    return;
  }

  schemeContainer.innerHTML = "";

  if (schemes.length === 0) {
    schemeContainer.innerHTML =
      '<div class="col-12"><div class="alert alert-info">No schemes found matching your criteria.</div></div>';
    return;
  }

  schemes.forEach((scheme) => {
    const card = document.createElement("div");
    card.className = "col-lg-4 col-md-6 mb-4";
    card.innerHTML = `
            <div class="card scheme-card h-100">
                <div class="card-header">
                    <h5 class="mb-0">${scheme.scheme_name}</h5>
                    <span class="scheme-status status-${scheme.status.toLowerCase()}">${
      scheme.status
    }</span>
                </div>
                <div class="card-body">
                    <div class="scheme-details mb-3">
                        <p><i class="fas fa-tag"></i> <strong>Type:</strong> ${
                          scheme.scheme_type
                        }</p>
                        <p><i class="fas fa-calendar-alt"></i> <strong>Start Date:</strong> ${formatDate(
                          scheme.start_date
                        )}</p>
                        <p><i class="fas fa-calendar-check"></i> <strong>End Date:</strong> ${formatDate(
                          scheme.end_date
                        )}</p>
                        <p><i class="fas fa-user-check"></i> <strong>Age Limit:</strong> ${
                          scheme.age_limit > 0
                            ? scheme.age_limit + "+ years"
                            : "No limit"
                        }</p>
                        <p><i class="fas fa-users"></i> <strong>Beneficiaries:</strong> ${new Intl.NumberFormat(
                          "en-IN"
                        ).format(scheme.beneficiary_count)}</p>
                        <p><i class="fas fa-rupee-sign"></i> <strong>Budget:</strong> ${formatCurrency(
                          scheme.total_budget
                        )}</p>
                    </div>
                    <p class="mb-4">${scheme.details}</p>
                    <div class="d-flex justify-content-between">
                        <a href="scheme_application.html?scheme=${
                          scheme.scheme_id
                        }" class="btn btn-apply">
                            <i class="fas fa-file-signature me-2"></i> Apply Now
                        </a>
                    </div>
                </div>
            </div>
        `;
    schemeContainer.appendChild(card);
  });
}

// Filter schemes by type
function filterSchemes(type) {
  currentFilter = type;
  let filteredSchemes;

  if (type === "All") {
    filteredSchemes = allSchemes;
  } else {
    filteredSchemes = allSchemes.filter(
      (scheme) => scheme.scheme_type === type
    );
  }

  // Apply search filter if search input has value
  if (searchInput && searchInput.value.trim()) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filteredSchemes = filteredSchemes.filter(
      (scheme) =>
        scheme.scheme_name.toLowerCase().includes(searchTerm) ||
        scheme.details.toLowerCase().includes(searchTerm)
    );
  }

  renderSchemes(filteredSchemes);
}

// Search schemes
function searchSchemes(term) {
  const searchTerm = term.trim().toLowerCase();
  let filteredSchemes;

  if (currentFilter === "All") {
    filteredSchemes = allSchemes;
  } else {
    filteredSchemes = allSchemes.filter(
      (scheme) => scheme.scheme_type === currentFilter
    );
  }

  if (searchTerm) {
    filteredSchemes = filteredSchemes.filter(
      (scheme) =>
        scheme.scheme_name.toLowerCase().includes(searchTerm) ||
        scheme.details.toLowerCase().includes(searchTerm)
    );
  }

  renderSchemes(filteredSchemes);
}

// Initialize all DOM elements
function initializeDOMElements() {
  schemeContainer = document.getElementById("scheme-container");
  filterPills = document.querySelectorAll(".filter-pill");
  searchInput = document.querySelector(".scheme-search input");
  totalSchemesElement = document.querySelector(".scheme-stat:nth-child(1) h3");
  totalBeneficiariesElement = document.querySelector(
    ".scheme-stat:nth-child(2) h3"
  );
  totalBudgetElement = document.querySelector(".scheme-stat:nth-child(3) h3");

  // Create scheme container if it doesn't exist
  if (!schemeContainer) {
    const schemeListing = document.querySelector(".row:not(.mb-4)");
    if (schemeListing) {
      schemeListing.id = "scheme-container";
      schemeContainer = schemeListing;
    } else {
      console.error("Could not find appropriate container for schemes");
    }
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM elements
  initializeDOMElements();

  // Initialize filter pills
  if (filterPills) {
    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        // Remove active class from all pills
        filterPills.forEach((p) => p.classList.remove("active"));
        // Add active class to the clicked pill
        pill.classList.add("active");
        // Filter schemes
        filterSchemes(pill.textContent);
      });
    });
  }

  // Initialize search
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchSchemes(searchInput.value);
    });
  }

  // Fetch schemes
  fetchSchemes();
});
