document.addEventListener("DOMContentLoaded", () => {
  const quoteElement = document.getElementById("quote");
  const authorElement = document.getElementById("author");
  const autoPlayToggle = document.getElementById("auto-play-toggle");
  const autoPlayStatus = document.getElementById("auto-play-status");
  
  const quoteTextInput = document.getElementById("new-quote-text");
  const authorInput = document.getElementById("new-quote-author");
  //const submitButton = document.getElementById("submit-quote");
  const submitStatus = document.getElementById("submit-status");
  const quoteForm = document.getElementById("add-quote-form");

  let autoPlayInterval;

  async function fetchNewQuote() {
    const res = await fetch("/api/quote");
    const data = await res.json();
    quoteElement.textContent = data.quote;
    authorElement.textContent = `— ${data.author}`;
  }

  document.getElementById("new-quote").addEventListener("click", fetchNewQuote);

  autoPlayToggle.addEventListener("change", () => {
    if (autoPlayToggle.checked) {
      autoPlayStatus.textContent = "Auto-Play: ON";
      autoPlayInterval = setInterval(fetchNewQuote, 5000);
    } else {
      autoPlayStatus.textContent = "Auto-Play: OFF";
      clearInterval(autoPlayInterval);
    }
  });

quoteForm.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const newQuote = quoteTextInput.value.trim();
  const newAuthor = authorInput.value.trim();

  if (!newQuote || !newAuthor) {
    submitStatus.textContent = "Both fields are required.";
    return;
  }

  const res = await fetch("/api/quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quote: newQuote, author: newAuthor }),
  });

  if (res.ok) {
    submitStatus.textContent = "Quote added successfully!";
    quoteTextInput.value = "";
    authorInput.value = "";
  } else {
    submitStatus.textContent = "Failed to add quote.";
  }
});
  fetchNewQuote();
});
