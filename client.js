import  { setLanguage, getText }  from './index.js';
let username = null;
let totalAmount = 0;
let claims = [];
let userIsLoggedIn = false;

// Populate username options from the server
async function populateUsernames() {
  const response = await fetch("http://localhost:3000/api/users");
  const data = await response.json();
  const usernames = data.usernames;

  const usernameSelect = document.getElementById("usernameSelect");
  usernameSelect.innerHTML = ""; // Clear existing options

  usernames.forEach((username) => {
    const option = document.createElement("option");
    option.value = username;
    option.text = username;
    usernameSelect.appendChild(option);
  });
}

// error handling
async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    return null;
  }
}

// Register
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    // Send registration request to the server
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.status === "success") {
      alert("Registration successful!");
      populateUsernames(); // Update the list of usernames after registration
      document.getElementById("registerUsername").value = "";
      document.getElementById("registerPassword").value = "";
    } else {
      alert(data.message);
    }
  });

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  username = document.getElementById("usernameSelect").value;
  // Make API call to login

  // On success:
  userIsLoggedIn = true; // Update the login status
  toggleContainerDisplay(); // Toggle display
  document.body.classList.add("user-logged-in");
  document.getElementById("authSection").style.display = "none";
  document.getElementById("logoutButton").style.display = "block";
  document.getElementById("mainContent").style.display = "block";
  fetchClaims();
});

// Logout
document.getElementById("logoutButton").addEventListener("click", () => {
  username = null;
  userIsLoggedIn = false; // Update the login status
  toggleContainerDisplay(); // Toggle display
  document.body.classList.remove("user-logged-in");
  document.getElementById("authSection").style.display = "block";
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("mainContent").style.display = "none";
});

function toggleContainerDisplay() {
  const container = document.querySelector(".container");

  if (userIsLoggedIn) {
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
}
// Function to update the text on the page based on the current language
function updateText() {
  const welcomeMessage = document.getElementById('welcomeMessage');
  const registerUsername = document.getElementById('registerUsername');
  const registerPassword = document.getElementById('registerPassword');
  const registerButton = document.getElementById('registerButton');
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const availableMoney = document.getElementById('availableMoney');
  const duration = document.getElementById('duration');
  const deadlineDate = document.getElementById('deadlineDate');
  const caseNumber = document.getElementById('caseNumber');
  const amount = document.getElementById('amount');
  const creditorName = document.getElementById('creditorName');
  const addUpdateClaimButton = document.getElementById('addUpdateClaimButton');
  const suggestedMonthlyRateLabel = document.getElementById('suggestedMonthlyRateLabel');
  const sendEmailButton = document.getElementById('sendEmailButton');

  if (welcomeMessage) welcomeMessage.textContent = getText('welcomeMessage');
  if (registerUsername) registerUsername.placeholder = getText('usernamePlaceholder');
  if (registerPassword) registerPassword.placeholder = getText('passwordPlaceholder');
  if (registerButton) registerButton.textContent = getText('registerButton');
  if (loginButton) loginButton.textContent = getText('loginButton');
  if (logoutButton) logoutButton.textContent = getText('logoutButton');
  if (availableMoney) availableMoney.placeholder = getText('availableMoneyPlaceholder');
  if (duration) duration.placeholder = getText('durationPlaceholder');
  if (deadlineDate) deadlineDate.placeholder = getText('deadlineDatePlaceholder');
  if (caseNumber) caseNumber.placeholder = getText('caseNumberPlaceholder');
  if (amount) amount.placeholder = getText('amountPlaceholder');
  if (creditorName) creditorName.placeholder = getText('creditorNamePlaceholder');
  if (addUpdateClaimButton) addUpdateClaimButton.textContent = getText('addUpdateClaimButton');
  if (suggestedMonthlyRateLabel) suggestedMonthlyRateLabel.textContent = getText('suggestedMonthlyRateLabel');
  if (sendEmailButton) sendEmailButton.textContent = getText('sendEmailButton');
  // Add more elements and translations as needed
}

// Event listener for language dropdown
document.getElementById('languageDropdown').addEventListener('change', (event) => {
  const selectedLanguage = event.target.value;
  setLanguage(selectedLanguage);
  updateText(); // Update the text when the language is changed
});

// Initial text update
updateText();
// fetch claims
async function fetchClaims() {
  const response = await fetch(
    `http://localhost:3000/api/claims?username=${username}`
  );

  if (response.status === 401) {
    alert("Unauthorized: Please login again.");
    return;
  }

  const data = await response.json();
  console.log("Data received from server:", data); // Debug statement

  if (!Array.isArray(data)) {
    console.error("Unexpected server response:", data);
    return;
  }

  claims = data;
  const ul = document.getElementById("claimList");
  ul.innerHTML = "";

  totalAmount = 0;

  data.forEach((claim) => {
    const li = document.createElement("li");
    li.textContent = `Case Number: ${claim.caseNumber}, Amount: €${claim.amount} Creditor: ${claim.creditorName}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "&#128465;";
    deleteBtn.style.color = "red";
    deleteBtn.style.float = "right";
    deleteBtn.addEventListener("click", () => deleteClaim(claim.caseNumber));

    li.appendChild(deleteBtn);

    ul.appendChild(li);

    totalAmount += parseFloat(claim.amount);
  });
}

fetchClaims();

// Add/update claim
document.getElementById("claimForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const caseNumber = document.getElementById("caseNumber").value;
  const amount = parseFloat(document.getElementById("amount").value).toFixed(2);
  const existingClaim = claims.find((c) => c.caseNumber === caseNumber);
  const creditorName = document.getElementById("creditorName").value;
  if (existingClaim && parseFloat(existingClaim.amount) >= parseFloat(amount)) {
    alert(
      "The entered amount must be higher than the current amount for the given case number."
    );
    return;
  }
  const response = await fetch("http://localhost:3000/api/claims", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, caseNumber, amount, creditorName }),
  });

  if (response.ok) {
    fetchClaims();
  }
});

// Delete claim
async function deleteClaim(caseNumber) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this claim?"
  );
  if (!confirmDelete) return;

  const response = await fetch("http://localhost:3000/api/claims", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, caseNumber }),
  });

  if (response.ok) {
    fetchClaims();
  }
}

document.getElementById("emailButton").addEventListener("click", () => {
  // Group claims by creditor
  const groupedClaims = claims.reduce((acc, claim) => {
    if (!acc[claim.creditorName]) {
      // Use creditorName as the key
      acc[claim.creditorName] = [];
    }
    acc[claim.creditorName].push(claim);
    return acc;
  }, {});

  // Loop through each creditor and send individual emails
  for (const creditor in groupedClaims) {
    const emailSubject = "Vorschlag für Ratenzahlungsvereinbarung";
    let emailBody = generateEmailBody(groupedClaims[creditor], creditor);

    // Open email client
    window.location.href = `mailto:?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
  }
});

function generateEmailBody(claimsForCreditor, creditorName) {
  let emailBody = "Vorschlag für Ratenzahlungsvereinbarung\n";
  emailBody += "---------------------------------\n";
  emailBody += `An: ${creditorName}\n`;
  emailBody += `Datum: ${new Date().toLocaleDateString("de-DE")}\n`;
  emailBody += "---------------------------------\n\n";

  let localTotalAmount = 0; // Local total amount for this creditor
  emailBody += "Betreffende Forderungen:\n";

  claimsForCreditor.forEach((claim) => {
    emailBody += `Fallnummer: ${claim.caseNumber}, Betrag: €${claim.amount}\n`;
    localTotalAmount += parseFloat(claim.amount);
  });

  const duration = parseInt(document.getElementById("duration").value);
  const availableMoney = parseFloat(
    document.getElementById("availableMoney").value
  );
  const suggestedRate = (localTotalAmount / duration).toFixed(2);
  emailBody += `Vorgeschlagene monatliche Rate: €${Math.min(
    suggestedRate,
    availableMoney
  ).toFixed(2)}\n`;

  return emailBody;
}

// Watch for changes on availableMoney and duration to update the suggested rate
document
  .getElementById("availableMoney")
  .addEventListener("input", updateSuggestedRate);
document
  .getElementById("duration")
  .addEventListener("input", updateSuggestedRate);

function updateSuggestedRate() {
  const availableMoney = parseFloat(
    document.getElementById("availableMoney").value
  );
  const duration = parseInt(document.getElementById("duration").value);
  if (isNaN(availableMoney) || isNaN(duration)) return;

  const suggestedRate = (totalAmount / duration).toFixed(2);
  document.getElementById("suggestedMonthlyRate").innerText = `€${Math.min(
    suggestedRate,
    availableMoney
  ).toFixed(2)}`;
}

// Initial setup
populateUsernames();
