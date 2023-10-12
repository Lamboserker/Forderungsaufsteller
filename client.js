let username = null;
let totalAmount = 0;
let claims = [];

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
  document.body.classList.add("user-logged-in");
  document.getElementById("loginRegisterCard").style.display = "none";
  document.getElementById("logoutButton").style.display = "block";
  fetchClaims();
});
// Logout
document.getElementById("logoutButton").addEventListener("click", () => {
  username = null;
  document.body.classList.remove("user-logged-in");
  document.getElementById("loginRegisterCard").style.display = "block";
  document.getElementById("logoutButton").style.display = "none";
});

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
    li.textContent = `Case Number: ${claim.caseNumber}, Amount: €${claim.amount}`;

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
    body: JSON.stringify({ username, caseNumber, amount }),
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
  const creditorName = document.getElementById("creditorName").value;
  const deadlineDate = document.getElementById("deadlineDate").value;

  const emailSubject = "Vorschlag für Ratenzahlungsvereinbarung";
  let emailBody = generateEmailBody(claims, creditorName, deadlineDate);

  let suggestedPayment = (totalAmount / 12).toFixed(2);
  if (parseFloat(suggestedPayment) > 200) {
    suggestedPayment = "200.00";
  }

  emailBody += `\nTotal Amount: €${totalAmount.toFixed(2)}\n`;
  emailBody += `Suggested Monthly Payment: €${suggestedPayment}\n`;

  window.location.href = `mailto:?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;
});

function generateEmailBody(claims, creditorName, deadlineDate) {
  let emailBody = "Vorschlag für Ratenzahlungsvereinbarung\n";
  emailBody += "---------------------------------\n";
  emailBody += `An: ${creditorName}\n`;
  emailBody += `Datum: ${new Date().toLocaleDateString("de-DE")}\n`;
  emailBody += "---------------------------------\n\n";

  emailBody += "Betreffende Forderungen:\n";
  claims.forEach((claim) => {
    emailBody += `Fallnummer: ${claim.caseNumber}, Betrag: €${claim.amount}\n`;
  });

  emailBody += "\n---------------------------------\n";
  emailBody += `Gesamtschuld: €${totalAmount.toFixed(2)}\n`;

  let suggestedPayment = (totalAmount / 12).toFixed(2);
  if (parseFloat(suggestedPayment) > 200) {
    suggestedPayment = "200.00";
  }

  emailBody += `Vorgeschlagene monatliche Rate: €${suggestedPayment}\n`;
  emailBody += "---------------------------------\n";
  emailBody +=
    "Ich schlage vor, die oben genannten Beträge in monatlichen Raten zu begleichen.\n";
  emailBody +=
    "Bitte bestätigen Sie diese Vereinbarung bis zum " + deadlineDate + ".\n";

  return emailBody;
}

// Initial setup
populateUsernames();
