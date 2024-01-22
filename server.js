fetch(`/getRandomQuote?tableName=${tableName}`)
    .then(response => response.json())
    .then(data => {
      console.log(data.quote);
      displayQuote(data.quote[0]["quote"]);
    })
    .catch(error => {
      console.error('Error:', error);
    }
    );
