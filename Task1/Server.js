const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;
const logFileName = 'requests.log';
const maxFileSize = 1 * 1024 * 1024; 

app.use((req, res, next) => {
    const logDetails = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname,
        query: req.query,
        headers: req.headers,
        userAgent: req.get('User-Agent'),
    };

    const logEntry = JSON.stringify(logDetails) + '\n';

    // task 5
    try {
        const stats = fs.statSync(logFileName);
        if (stats.size >= maxFileSize) {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            fs.renameSync(logFileName, `requests-${timestamp}.log`);
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('Error checking log file size', err);
        }
    }

    fs.appendFile(logFileName, logEntry, (err) => {
        if (err) console.error('Failed to write to log file', err);
    });

    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/about', (req, res) => {
    res.send('About page');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port : ${PORT}`);
});
