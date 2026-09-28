import db from '../config/db.js';

/**
 * GET /api/reviews
 * Query param: productId (optional)
 */
export function getReviews(req, res, next) {
  try {
    const { productId } = req.query;

    let query = 'SELECT * FROM reviews';
    const params = [];

    if (productId) {
      query += ' WHERE product_id = ?';
      params.push(productId);
    }

    query += ' ORDER BY id DESC';

    const reviews = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/reviews
 */
export function createReview(req, res, next) {
  try {
    const { productId, name, rating, text, productName } = req.body;

    if (!name || !rating || !text) {
      return res.status(400).json({ success: false, error: 'Name, rating, and review text are required' });
    }

    const ratingNum = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
    const initial = name.trim().charAt(0).toUpperCase();
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const result = db.prepare(`
      INSERT INTO reviews (product_id, name, initial, rating, text, product_name, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      productId || null,
      name.trim(),
      initial,
      ratingNum,
      text.trim(),
      productName || 'VELORA Fragrance',
      currentDate
    );

    // If linked to a product, update average rating & review_count
    if (productId) {
      const stats = db.prepare(`
        SELECT COUNT(*) as count, AVG(rating) as avg_rating
        FROM reviews WHERE product_id = ?
      `).get(productId);

      if (stats) {
        db.prepare(`
          UPDATE products
          SET review_count = ?, rating = ROUND(?, 1)
          WHERE id = ?
        `).run(stats.count, stats.avg_rating, productId);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        id: Number(result.lastInsertRowid),
        name: name.trim(),
        initial,
        rating: ratingNum,
        text: text.trim(),
        productName: productName || 'VELORA Fragrance',
        date: currentDate
      }
    });
  } catch (err) {
    next(err);
  }
}
