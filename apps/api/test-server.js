const express = require('express');
const app = express();
app.get('/test', (req, res) => res.json({ success: true }));
app.listen(3003, () => console.log('Test server on 3003'));
