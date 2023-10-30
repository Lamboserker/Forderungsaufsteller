// Define language options and their respective translations
const languages = {
    english: {
      welcomeMessage: 'Welcome to Claim Management',
      usernamePlaceholder: 'Username',
      passwordPlaceholder: 'Password',
      registerButton: 'Register',
      loginButton: 'Login',
      logoutButton: 'Logout',
      availableMoneyPlaceholder: 'Available Money',
      durationPlaceholder: 'Duration in months',
      deadlineDatePlaceholder: 'Deadline Date',
      caseNumberPlaceholder: 'Case Number',
      amountPlaceholder: 'Amount',
      creditorNamePlaceholder: 'Creditor Name',
      addUpdateClaimButton: 'Add/Update Claim',
      suggestedMonthlyRateLabel: 'Suggested Monthly Rate:',
      sendEmailButton: 'Send Email',
      selectUsernamePlaceholder: 'Select Username',
    },
    german: {
      welcomeMessage: 'Willkommen bei der Anspruchsverwaltung',
      usernamePlaceholder: 'Benutzername',
      passwordPlaceholder: 'Passwort',
      registerButton: 'Registrieren',
      loginButton: 'Einloggen',
      logoutButton: 'Ausloggen',
      availableMoneyPlaceholder: 'Verfügbares Geld',
      durationPlaceholder: 'Laufzeit in Monaten',
      deadlineDatePlaceholder: 'Fälligkeitsdatum',
      caseNumberPlaceholder: 'Fallnummer',
      amountPlaceholder: 'Betrag',
      creditorNamePlaceholder: 'Gläubigername',
      addUpdateClaimButton: 'Anspruch hinzufügen/aktualisieren',
      suggestedMonthlyRateLabel: 'Vorgeschlagene monatliche Rate:',
      sendEmailButton: 'E-Mail senden',
      selectUsernamePlaceholder: 'Benutzername auswählen',
    },
  };
  
  // Default language is English
  let currentLanguage = 'english';
  
  // Function to set the current language
  function setLanguage(language) {
    currentLanguage = language;
  }
  
  // Function to get text in the current language
  function getText(key) {
    return languages[currentLanguage][key] || key; // Return the translation or the key itself if not found
  }
  
  export { setLanguage, getText };
  