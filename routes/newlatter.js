const express = require('express');
const router = express.Router();
const Subscriber = require('../model/subs');
const sendEmail = require('../util/mail'); 

router.post('/subscribe', async (req, res) => {
  console.log('📥 Request received'); 

  const { email } = req.body;
  console.log('📧 Email:', email); 

  if (!email) {
    console.log('❌ No email provided'); 
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const exists = await Subscriber.findOne({ email });
    console.log('🔍 DB Check:', exists); 

    if (exists) {
      return res.status(400).json({ error: 'Already subscribed' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    console.log('✅ Saved to DB'); 

    await sendEmail(
      email,
      'Thanks for subscribing!',
      `<h3>Thank you for subscribing to AMSOM Constructability!</h3><p>You’ll now receive updates from us.</p>`
    );
    console.log('📤 Email sent'); 

    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/send-newsletter', async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message required' });
  }

  try {
    const subscribers = await Subscriber.find({});
    const emails = subscribers.map(sub => sub.email);

    if (emails.length === 0) {
      return res.status(400).json({ error: 'No subscribers found' });
    }

   
    await sendEmail(
      {
        to: process.env.EMAIL_USER,
        bcc: emails,                
      },
      subject,
      `<p>${message}</p>`
    );

    res.status(200).json({ message: 'Newsletter sent to all subscribers' });
  } catch (err) {
    console.error('Newsletter sending error:', err.message);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
});

module.exports = router;
