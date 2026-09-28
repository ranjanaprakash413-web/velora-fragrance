import db from '../config/db.js';

/**
 * POST /api/newsletter
 */
export function subscribeNewsletter(req, res, next) {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    const emailClean = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = db.prepare('SELECT id FROM subscribers WHERE email = ?').get(emailClean);
    if (existing) {
      return res.json({
        success: true,
        message: "You are already a valued member of the VELORA list."
      });
    }

    db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(emailClean);

    res.status(201).json({
      success: true,
      message: "THANK YOU — YOU'RE ON THE LIST."
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/contact
 */
export function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ success: false, error: 'Email and message are required.' });
    }

    db.prepare(`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `).run(name ? name.trim() : '', email.trim().toLowerCase(), subject ? subject.trim() : 'General Inquiry', message.trim());

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our concierge will be in touch shortly.'
    });
  } catch (err) {
    next(err);
  }
}
