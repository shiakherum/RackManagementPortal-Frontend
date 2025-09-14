const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// For development with self-signed certificates, disable SSL verification
if (dev) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// SSL Certificate Setup
const setupSSL = () => {
	try {
		const sslPath = __dirname; // SSL files are in the frontend root

		console.log('Loading SSL certificates from:', sslPath);

		const privateKeyPath = path.join(sslPath, 'private_key_unencrypted.txt');
		const certificatePath = path.join(sslPath, 'certificate.txt');
		const certificateChainPath = path.join(sslPath, 'certificate_chain.txt');

		if (
			!fs.existsSync(privateKeyPath) ||
			!fs.existsSync(certificatePath) ||
			!fs.existsSync(certificateChainPath)
		) {
			console.warn('SSL certificate files not found. Skipping HTTPS setup.');
			return null;
		}

		const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
		const certificate = fs.readFileSync(certificatePath, 'utf8');
		const certificateChain = fs.readFileSync(certificateChainPath, 'utf8');

		// Combine certificate and certificate chain
		const fullCertificate = certificate + '\n' + certificateChain;

		console.log('SSL certificates loaded successfully');

		return {
			key: privateKey,
			cert: fullCertificate,
		};
	} catch (error) {
		console.error('Error loading SSL certificates:', error.message);
		return null;
	}
};

app
	.prepare()
	.then(() => {
		const useSSL = process.env.USE_SSL?.trim() === 'true' && process.env.NODE_ENV?.trim() === 'production';
		
		if (useSSL) {
			const httpsOptions = setupSSL();
			if (httpsOptions) {
				const httpsServer = createServer(httpsOptions, (req, res) => {
					const parsedUrl = parse(req.url, true);
					handle(req, res, parsedUrl);
				});

				httpsServer.listen(port, (err) => {
					if (err) throw err;
					console.log(
						`🔒 HTTPS Server running on https://${hostname}:${port}`
					);
				});
			} else {
				const { createServer: createHttpServer } = require('http');
				const httpServer = createHttpServer((req, res) => {
					const parsedUrl = parse(req.url, true);
					handle(req, res, parsedUrl);
				});

				httpServer.listen(port, (err) => {
					if (err) throw err;
					console.log(`🔓 HTTP Server running on http://${hostname}:${port}`);
				});
			}
		} else {
			const { createServer: createHttpServer } = require('http');
			const httpServer = createHttpServer((req, res) => {
				const parsedUrl = parse(req.url, true);
				handle(req, res, parsedUrl);
			});

			httpServer.listen(port, (err) => {
				if (err) throw err;
				console.log(`🔓 HTTP Server running on http://${hostname}:${port}`);
			});
		}
	})
	.catch((ex) => {
		console.error(ex.stack);
		process.exit(1);
	});
