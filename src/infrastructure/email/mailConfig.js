const mailConfig = {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    from: process.env.MAIL_FROM || 'DAAW demo <no-reply@alex.com>',
}
module.exports = mailConfig;