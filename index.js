const express = require('express')

const app = express()
const PORT = 4000

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})
app.get('/getRandomQuote', async (req, res) => {
  const tableName = req.query.tableName;

  if (!tableName) {
    return res.status(400).json({ error: 'Table name is required.' });
  }
});
module.exports = app