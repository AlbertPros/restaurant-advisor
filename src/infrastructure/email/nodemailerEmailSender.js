const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const mailConfig = require('./mailConfig');
let transporter;
function getTransporter() {
    if (!transporter) transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        auth: mailConfig.auth,
    });
    return transporter;
}
function generateHTML(template, templateData = {}) {
    const templatePath = path.join(__dirname, 'templates', `${template}.pug`);
    return pug.renderFile(templatePath, templateData);
}
async function send({ to, subject, template, templateData = {} }) {
    const html = generateHTML(template, templateData);
    await getTransporter().sendMail({
        from: mailConfig.from,
        to,
        subject,
        html,
    });
}
module.exports = {
    send,
};