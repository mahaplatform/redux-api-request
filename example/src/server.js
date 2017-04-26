const express = require('express')
const app = express()

app.use(express.static('dist'))

app.get('/success', (req, res) => res.status(200).json({ data: 'foo' }))

app.get('/failure', (req, res) => res.status(404).json({ error: 'bar' }))

app.listen(8080, () => {
  console.log('Example app listening on port 8080!')
})
