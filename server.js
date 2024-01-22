
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const snowflake = require('snowflake-sdk');
app.use(express.static(path.join(__dirname, 'public')));
const connectionOptions = {
  account: 'qkb03942.us-east-1',
  username: 'Dora',
  password: 'D@ra1192002',
  warehouse: 'COMPUTE_WH',
  database: 'QUOTES',
};

const connection = snowflake.createConnection(connectionOptions);
connection.connect(function(err, conn) {
    if (err) {
        console.error('Unable to connect: ' + err.message);
    } else {
        // Optional: store the connection ID.
        var connection_ID = conn.getId();
        console.log('Connected to Snowflake. Connection ID:', connection_ID);
    }
});

// app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'));
});

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.js'));
});
app.get('/getRandomQuote', (req, res) => {
    const tableName = req.query.tableName;
    if (!tableName) {
        return res.status(400).json({ error: 'Table name is required.' });
    }
    // Example: Retrieve a random quote from Snowflake and send it to the client
    connection.execute({
        sqlText: "SELECT * FROM "+tableName+"  ORDER BY RANDOM() LIMIT 1",
        complete: function (err, stmt, rows) {
            if (err) {
                console.error('Failed to execute statement due to the following error: ' + err.message);
                res.status(500).send('Internal Server Error');
            } else {
                res.json({ quote: rows });
            }
        }
    });
});
app.post('/addQuote', async (req, res) => {
    const tableName = req.body.tableName;
    const quote = req.body.quote;
  
    if (!tableName || !quote) {
      return res.status(400).json({ error: 'Table name and quote are required.' });
    }
  
    const connection = snowflake.createConnection(connectionOptions);
  
    try {
      await connection.connect();
      const id = await getMaxId(tableName, connection);
      const newId = id + 1;
  
      await connection.execute({
        sqlText: `INSERT INTO ${tableName} (ID, QUOTES) VALUES (?, ?)`,
        binds: [newId, quote],
      });
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error adding quote:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      if (connection) {
        connection.destroy();
      }
    }
  });
  
  async function getMaxId(tableName, connection) {
    return new Promise((resolve, reject) => {
      connection.execute({
        sqlText: `SELECT MAX(ID) AS MAXID FROM ${tableName}`,
        complete: (err, stmt, rows) => {
          if (err) {
            reject(err);
          } else {
            const maxId = rows[0]["MAXID"] || 0;
            resolve(maxId);
          }
        },
      });
    });
  }
app.delete('/deleteQuote' ,async (req, res) => {
    const tableName = req.body.tableName;
    const quote = req.body.quote;
    if (!tableName || !quote) {
        return res.status(400).json({ error: 'Table name and quote are required.' });
    }
    connection.execute({
        sqlText: `DELETE FROM ${tableName} WHERE ID = ?`,
        binds: [quoteId],
        complete: function (err, stmt, rows) {
            if (err) {
                console.error('Failed to execute statement due to the following error: ' + err.message);
                return res.status(500).send('Internal Server Error');
            } else {
                res.json({ success: true });
            }
        }
    });
}
)


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

