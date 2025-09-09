const express = require('express');
const router = express.Router();
const quote=require('../model/GetQoute');
const service=require('../model/getservice');


const { google } = require('googleapis');

console.log("📦 Contactus route loaded");


const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SHEET_ID = process.env.GOOGLE_SHEET_ID;


const appendToSheet = async (range, values) => {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  });
};


router.post('/submit-quote', async (req, res) => {
  try {
    const { customer_name,customer_number, customer_email,Massage } = req.body;

    if (!customer_name || ! customer_number || !customer_email || !Massage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dbadd=new quote({
        customer_name:customer_name.trim(),
        customer_number:customer_number.trim(),
        customer_email:customer_email.trim(),
        Massage:Massage.trim()
    })
    await dbadd.save();

    await appendToSheet('GET_QUOTE!A1:d', [customer_name.trim(), customer_number.trim(), customer_email.trim(), Massage.trim()]);
    res.status(200).json({ message: 'Contact saved successfully' });
  } catch (err) {
    console.error(' Google Sheets Error:', err.message);
    res.status(500).json({ error: 'Error saving contact', details: err.message });
  }
});


router.post('/submit-service', async (req, res) => {
  try {
    const { name,number,date } = req.body;

    if (!name || ! number  || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dbadd=new service({
        name:name.trim(),
        number:number.trim(),
        date:date.trim(),
        
    })
    await dbadd.save();

    await appendToSheet('GET_SERVICE!A1:F', [name.trim(), number.trim(),date.trim()]);
    res.status(200).json({ message: 'Contact saved successfully' });
  } catch (err) {
    console.error(' Google Sheets Error:', err.message);
    res.status(500).json({ error: 'Error saving contact', details: err.message });
  }
});



module.exports = router;
