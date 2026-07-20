const nodemailer = require('nodemailer');
const dns = require('node:dns').promises;

async function test() {
    try {
        const { address } = await dns.lookup('smtp.gmail.com', { family: 4 });
        console.log('Resolved IPv4:', address);

        const transporter = nodemailer.createTransport({
            host: address,
            port: 587,
            secure: false,
            requireTLS: true,
            tls: {
                servername: 'smtp.gmail.com'
            },
            auth: {
                user: 'fake@gmail.com',
                pass: 'fake'
            }
        });

        await transporter.verify();
    } catch (e) {
        console.log(e.message);
    }
}
test();
