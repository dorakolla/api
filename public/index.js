
const knowledgeButton = document.querySelector(".knowledgeButton");
const tradingButton = document.querySelector(".tradingButton");
const buttonContainer = document.querySelector(".buttonContainer");
const backButtonDiv = document.querySelector(".backButton");
const backButton = document.querySelector("#backButton");
const mindButton = document.querySelector(".mindButton");
const quote = document.querySelector(".quote");
const refresh = document.querySelector(".refresh");
const selectValue = document.querySelector("#contentType");
const quoteInput = document.querySelector(".quoteInput");
const quoteMessage = document.querySelector(".quoteMessage");

function getValue() {
  if (selectValue.value == "Knowledge") {
    addQuote("KNOWLEDGEQUOTES");
  } else if (selectValue.value == "Trading") {
    addQuote("TRADINGQUOTES");
  } else if (selectValue.value == "Mind") {
    addQuote("MINDQUOTES");
  }
  quoteInput.style.display = "none";
  quoteMessage.style.display = "flex";
}

function addQuote(tableName) {
  const newQuote = document.querySelector("#newQuote").value;

  if (!newQuote) {
    console.error('New quote is required.');
    return;
  }

  fetch(`/addQuote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tableName: tableName,
      quote: newQuote,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Quote added successfully:', data);
    })
    .catch(error => {
      console.error('Error adding quote:', error);
    });
}

let quoteType = 0;

tradingButton.addEventListener('click', () => {
  quoteType = 1;
  getRandomQuote("TRADINGQUOTES");
});

mindButton.addEventListener('click', () => {
  quoteType = 2;
  getRandomQuote("MINDQUOTES");
});

knowledgeButton.addEventListener("click", function () {
  quoteType = 0;
  getRandomQuote("KNOWLEDGEQUOTES");
});

refresh.addEventListener("click", function () {
  if (quoteType === 0) {
    refreshQuote("KNOWLEDGEQUOTES");
  } else if (quoteType === 1) {
    refreshQuote("TRADINGQUOTES");
  } else {
    refreshQuote("MINDQUOTES");
  }
});

function getRandomQuote(tableName) {
  fetch(`/getRandomQuote?tableName=${tableName}`, { // Replace with your Vercel function route
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      displayQuote(data.quote[0]["QUOTES"]);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

backButton.addEventListener("click", function () {
  buttonContainer.style.display = "flex";
  quote.style.display = "none";
  backButtonDiv.style.display = "none";
});

function refreshQuote(tableName) {
  getRandomQuote(tableName);
}

function displayQuote(quoteText) {
  buttonContainer.style.display = "none";
  quote.style.display = "block";
  quote.textContent = `' ${quoteText} '`;
  backButtonDiv.style.display = "flex";
}
