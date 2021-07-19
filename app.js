const express = require('express');
const cors = require('cors');

// Initializing server
const server = express();

const PORT = process.env.PORT || 5000;

server.use(cors());

// starting the server
server.listen(PORT, () => {
    console.log(`Server is listening on PORT : ${PORT}`);
})
