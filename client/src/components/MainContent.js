import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "./languageContext";

const MainContent = () => {
  const { getText } = useLanguage();
  const [username] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [claims, setClaims] = useState([]);
  const [availableMoney, setAvailableMoney] = useState("");
  const [duration, setDuration] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [creditorName, setCreditorName] = useState("");

  const fetchClaims = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/claims?username=${username}`
      );

      if (response.status === 401) {
        alert("Unauthorized: Please login again.");
        return;
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Unexpected server response:", data);
        return;
      }

      setClaims(data);

      const newTotalAmount = data.reduce(
        (acc, claim) => acc + parseFloat(claim.amount),
        0
      );
      setTotalAmount(newTotalAmount);
    } catch (error) {
      console.error("Failed to fetch claims:", error);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchClaims();
    }
  }, [username, fetchClaims]);

  const handleAddOrUpdateClaim = async (e) => {
    e.preventDefault();

    if (!username) {
      alert("Please log in first.");
      return;
    }

    // Validierung der Eingabefelder
    if (!caseNumber || !amount || !creditorName) {
      alert("Please fill in all the claim details.");
      return;
    }

    // Implementieren Sie den Code, um Ansprüche hinzuzufügen oder zu aktualisieren
    try {
      const response = await fetch("http://localhost:4000/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          caseNumber,
          amount: parseFloat(amount),
          creditorName,
        }),
      });

      if (response.ok) {
        // Anspruch erfolgreich hinzugefügt/aktualisiert, aktualisieren Sie die Ansprüche
        fetchClaims();
        // Zurücksetzen der Eingabefelder
        setCaseNumber("");
        setAmount("");
        setCreditorName("");
      } else {
        alert("Failed to add/update claim.");
      }
    } catch (error) {
      console.error("Failed to add/update claim:", error);
    }
  };

  const handleEmailButtonClick = () => {
    if (!username) {
      alert("Please log in first.");
      return;
    }

    if (!availableMoney || !duration) {
      alert("Please enter available money and duration.");
      return;
    }

    try {
      // Gruppieren Sie Ansprüche nach Gläubigern (Creditor)
      const groupedClaims = claims.reduce((acc, claim) => {
        if (!acc[claim.creditorName]) {
          acc[claim.creditorName] = [];
        }
        acc[claim.creditorName].push(claim);
        return acc;
      }, {});

      for (const creditor in groupedClaims) {
        const emailSubject = "Vorschlag für Ratenzahlungsvereinbarung";
        const emailBody = generateEmailBody(groupedClaims[creditor], creditor);

        // Öffnen Sie den E-Mail-Client mit den generierten Daten
        const mailtoLink = `mailto:${encodeURIComponent(
          creditor
        )}?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(emailBody)}`;

        // Öffnen des E-Mail-Clients
        window.location.href = mailtoLink;
      }
    } catch (error) {
      console.error("Failed to send emails:", error);
    }
  };

  // Funktion zur Generierung des E-Mail-Textes basierend auf Ansprüchen
  const generateEmailBody = (claimsForCreditor, creditorName) => {
    let emailBody = "Vorschlag für Ratenzahlungsvereinbarung\n";
    emailBody += "---------------------------------\n";
    emailBody += `An: ${creditorName}\n`;
    emailBody += `Datum: ${new Date().toLocaleDateString("de-DE")}\n`;
    emailBody += "---------------------------------\n\n";

    let localTotalAmount = 0; // Lokaler Gesamtbetrag für diesen Gläubiger
    emailBody += "Betreffende Forderungen:\n";

    claimsForCreditor.forEach((claim) => {
      emailBody += `Fallnummer: ${claim.caseNumber}, Betrag: €${claim.amount}\n`;
      localTotalAmount += parseFloat(claim.amount);
    });

    const suggestedRate = (localTotalAmount / parseInt(duration)).toFixed(2);
    emailBody += `Vorgeschlagene monatliche Rate: €${Math.min(
      suggestedRate,
      parseFloat(availableMoney)
    ).toFixed(2)}\n`;

    return emailBody;
  };

  return (
    <div id="mainContent" className="container">
      <button id="logoutButton" className="btn btn-logout">
        {getText("logoutButton")}
      </button>

      <input
        type="number"
        id="availableMoney"
        placeholder={getText("availableMoneyPlaceholder")}
        value={availableMoney}
        onChange={(e) => setAvailableMoney(e.target.value)}
      />
      <input
        type="number"
        id="duration"
        placeholder={getText("durationPlaceholder")}
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <input
        type="date"
        id="deadlineDate"
        placeholder={getText("deadlineDatePlaceholder")}
        value={deadlineDate}
        onChange={(e) => setDeadlineDate(e.target.value)}
      />

      <form id="claimForm" onSubmit={handleAddOrUpdateClaim}>
        <input
          type="text"
          id="caseNumber"
          placeholder={getText("caseNumberPlaceholder")}
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
        />
        <input
          type="number"
          id="amount"
          placeholder={getText("amountPlaceholder")}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          id="creditorName"
          placeholder={getText("creditorNamePlaceholder")}
          value={creditorName}
          onChange={(e) => setCreditorName(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-add-update"
          id="addUpdateClaimButton"
        >
          {getText("addUpdateClaimButton")}
        </button>
      </form>

      <ul id="claimList">
        {claims.map((claim, index) => (
          <li key={index}>
            Case Number: {claim.caseNumber}, Amount: €{claim.amount} Creditor:{" "}
            {claim.creditorName}
          </li>
        ))}
      </ul>

      <p>
        <span id="suggestedMonthlyRateLabel">
          {getText("suggestedMonthlyRateLabel")}
        </span>
        <span id="suggestedMonthlyRate">
          €{(totalAmount / parseInt(duration)).toFixed(2)}
        </span>
      </p>

      <button
        id="emailButton"
        className="btn btn-primary"
        onClick={handleEmailButtonClick}
      >
        {getText("sendEmailButton")}
      </button>
    </div>
  );
};

export default MainContent;
