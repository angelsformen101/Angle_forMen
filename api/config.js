const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();

    const configPath = path.join(process.cwd(), 'admin', 'contacts-config.json');
    const jsPath = path.join(process.cwd(), 'admin', 'contacts-config.js');
    const publicJsPath = path.join(process.cwd(), 'js', 'contacts-config.js');

    if (req.method === 'GET') {
        try {
            const data = fs.readFileSync(configPath, 'utf-8');
            return res.status(200).json(JSON.parse(data));
        } catch (e) {
            return res.status(200).json({
                master: { call: '+919876543210', whatsapp: '919876543210' },
                pages: {}
            });
        }
    }

    if (req.method === 'POST') {
        try {
            const newConfig = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');
            const jsContent = '// Master Contacts Configuration for AngelsForMen\nwindow.SITE_CONTACTS_CONFIG = ' +
                JSON.stringify(newConfig, null, 2) + ';\n';
            fs.writeFileSync(jsPath, jsContent, 'utf-8');
            fs.writeFileSync(publicJsPath, jsContent, 'utf-8');
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
