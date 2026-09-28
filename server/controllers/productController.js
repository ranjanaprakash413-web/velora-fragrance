import db from '../config/db.js';

/**
 * Format raw database row to frontend product format
 */
function formatProduct(row) {
  if (!row) return null;
  return {
    ...row,
    sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes,
    notes: typeof row.notes === 'string' ? JSON.parse(row.notes) : row.notes,
    featured: Boolean(row.featured)
  };
}

/**
 * GET /api/products
 * Query params: category, search, sortBy, page, limit
 */
export function getProducts(req, res, next) {
  try {
    const { category, search, sortBy, page = 1, limit = 50 } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)';
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term);
    }

    // Sort options
    switch (sortBy) {
      case 'Price Low-High':
        query += ' ORDER BY price ASC';
        break;
      case 'Price High-Low':
        query += ' ORDER BY price DESC';
        break;
      case 'Rating':
        query += ' ORDER BY rating DESC';
        break;
      case 'Name':
        query += ' ORDER BY name ASC';
        break;
      default:
        query += ' ORDER BY featured DESC, price DESC';
        break;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const rows = db.prepare(query).all(...params);
    const products = rows.map(formatProduct);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    if (category && category !== 'All') {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)';
      const term = `%${search.toLowerCase().trim()}%`;
      countParams.push(term, term, term);
    }
    const totalCount = db.prepare(countQuery).get(...countParams).total;

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/featured
 */
export function getFeaturedProducts(req, res, next) {
  try {
    const rows = db.prepare('SELECT * FROM products WHERE featured = 1 ORDER BY rating DESC').all();
    res.json({
      success: true,
      data: rows.map(formatProduct)
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id
 */
export function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({
      success: true,
      data: formatProduct(row)
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/products (Admin)
 */
export function createProduct(req, res, next) {
  try {
    const { id, name, category, tagline, description, price, sizes, notes, image, featured = 1, stock = 100 } = req.body;

    if (!id || !name || !category || !description || !price || !image) {
      return res.status(400).json({ success: false, error: 'Missing required product fields' });
    }

    const sizesJson = typeof sizes === 'object' ? JSON.stringify(sizes) : sizes;
    const notesJson = typeof notes === 'object' ? JSON.stringify(notes) : notes;

    db.prepare(`
      INSERT INTO products (id, name, category, tagline, description, price, sizes, notes, image, featured, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, category, tagline || '', description, price, sizesJson, notesJson, image, featured ? 1 : 0, stock);

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.status(201).json({ success: true, data: formatProduct(created) });
  } catch (err) {
    next(err);
  }
}
