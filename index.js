const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer();

const webhookurl = {
    testy: process.env.WEBHOOKTESTY,
    status: process.env.WEBHOOKSTATUS
};

server.on('request', (request, response) => {
    let methodNotAllowed = false;
    let found = false;
    let finished = false;
    if (request.method === 'GET') {

        //Special requests
        try {
            if (req.url === '/webhook') {
                if (req.method === 'GET') {
                    let data = '';
                    if (req.headers.type === 'getInfoOfWebhook') {
                        https.get(eval('webhookurl.' + req.headers.channel), (newRes) => {
                            let data2 = '';
                            newRes.on('data', (chunk) => { data2 += chunk });
                            newRes.on('end', () => {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(decodeURIComponent(data2));
                            });
                        })
                        finished = true;
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(fs.readFileSync('webhook.html'));
                        finished = true;
                    }
                }
            } else if (req.url === '/webhook') {
                if (req.method === 'GET') {
                    let data = '';
                    if (req.headers.type === 'getInfoOfWebhook') {
                        https.get(eval('webhookurl.' + req.headers.channel), (newRes) => {
                            let data2 = '';
                            newRes.on('data', (chunk) => { data2 += chunk });
                            newRes.on('end', () => {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(decodeURIComponent(data2));
                            });
                        })
                        finished = true;
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(fs.readFileSync('webhook.html'));
                        finished = true;
                    }
                }
            }

            //Normal requests
            if (request.method === 'GET'){
                if (fs.existsSync(`.${path.sep}src${request.url.replace("/", path.sep)}${path.sep}index.html`)) {
                    found = true;
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(fs.readFileSync(`.${path.sep}src${request.url.replace("/", path.sep)}${path.sep}index.html`));
                    finished = true;

                    console.log("-----------------------\nIncomming Connection!\n-----------------------\n" + request.connection.remoteAddress + " " + new Date());

                } else if (fs.existsSync(`.${path.sep}src${request.url.replace("/", path.sep)}`)) {
                    if (request.url.endsWith('.html')) {
                        found = true;
                        let file = fs.readFileSync(`.${path.sep}src${request.url.replace("/", path.sep)}`)
                        response.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': file.byteLength});
                        response.end(file);
                        finished = true;
                    } else if (request.url.endsWith('.js')) {
                        found = true;
                        let file = fs.readFileSync(`.${path.sep}src${request.url.replace("/", path.sep)}`)
                        response.writeHead(200, { 'Content-Type': 'text/javascript', 'Content-Length': file.byteLength });
                        response.end(file);
                        finished = true;
                    } else if (request.url.endsWith('.css')) {
                        found = true;
                        let file = fs.readFileSync(`.${path.sep}src${request.url.replace("/", path.sep)}`)
                        response.writeHead(200, { 'Content-Type': 'text/css', 'Content-Length': file.byteLength });
                        response.end(file);
                        finished = true;
                    } else if (request.url.endsWith('.zip')) {
                        found = true;
                        let file = fs.readFileSync(`.${path.sep}src${request.url.replace("/", path.sep)}`)
                        response.writeHead(200, { 'Content-Type': 'application/zip', 'Content-Length': file.byteLength });
                        response.end(file);
                        finished = true;
                    }
                    console.log("-----------------------\nIncomming Connection!\n-----------------------\n" + request.connection.remoteAddress + " " + new Date());

                } else if (fs.existsSync(`.${path.sep}src${request.url.replace("/", path.sep)}.html`)) {
                    found = true;
                    let file = fs.readFileSync(`.${path.sep}src${request.url.replace("/", path.sep)}.html`)
                    response.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': file.byteLength });
                    response.end(file);
                    finished = true;
                    console.log("-----------------------\nIncomming Connection!\n-----------------------\n" + request.connection.remoteAddress + " " + new Date());
                }
            }
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Internal Server Error');
        }

    } else if (request.method === 'POST') {

        if (request.url === "/") {
            finished = true;
            let data = new String;
            req.on('data', (chunk) => {
                data += chunk.toString();
            });
            req.on('end', () => {
                res.writeHead(204);
                res.end();
                console.log(new Date() + ' ' + decodeURIComponent(data));
            });
        }

    }
    if (!finished) {
        if (!found) {
            response.writeHead(404);
            response.end("404 Not Found. Request URL: " + request.url);
            console.log("Error 404. " + request.connection.remoteAddress + " " + request.url + " " + new Date());
        } else if (methodNotAllowed) {
            response.writeHead(501);
            response.end("501 Not Implemented. Request URL: " + request.url);
            console.log("Error 501. " + request.connection.remoteAddress + " " + request.url + " " + new Date());
        } else {
            response.writeHead(400);
            response.end("500 Internal Server Error. Request URL: " + request.url);
            console.log("Error 500. " + request.connection.remoteAddress + " " + request.url + " " + new Date());
        }
    }

});

server.listen(process.env.PORT || 3000);

console.log("Everything OK! Binded to port " + (process.env.$PORT || 3000));