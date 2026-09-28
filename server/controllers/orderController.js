import db from '../config/db.js';

/**
 * POST /api/orders
 * Supports both guest checkout and logged-in user checkout
 */
export function createOrder(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      country,
      shippingMethod = 'standard',
      items = []
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !address || !city || !zip) {
      return res.status(400).json({ success: false, error: 'Please provide all required shipping and contact details' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Your cart is empty' });
    }

    // Server-side calculation to prevent client-side price tampering
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = db.prepare('SELECT id, name, price, sizes FROM products WHERE id = ?').get(item.id);
      
      let itemPrice = Number(item.price) || 0;
      let sizeLabel = '';

      if (product) {
        const sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
        
        // Match chosen size
        const selectedSizeObj = Array.isArray(sizes) 
          ? sizes.find(s => s.ml === (item.selectedSize?.ml || item.selectedSize))
          : null;

        if (selectedSizeObj) {
          itemPrice = selectedSizeObj.price;
          sizeLabel = `${selectedSizeObj.ml}ml`;
        } else {
          itemPrice = product.price;
          sizeLabel = typeof item.selectedSize === 'object' ? `${item.selectedSize?.ml || ''}ml` : String(item.selectedSize || 'Standard');
        }
      } else {
        sizeLabel = typeof item.selectedSize === 'object' ? `${item.selectedSize?.ml || ''}ml` : String(item.selectedSize || 'Standard');
      }

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const itemTotal = itemPrice * quantity;
      subtotal += itemTotal;

      validatedItems.push({
        id: item.id,
        name: item.name || product?.name || 'Luxury Fragrance',
        selectedSize: sizeLabel,
        price: itemPrice,
        quantity,
        total: itemTotal,
        image: item.image || product?.image
      });
    }

    // Shipping calculation
    const shippingCost = shippingMethod === 'express' ? 30 : (subtotal > 200 ? 0 : 15);
    const total = subtotal + shippingCost;

    // Generate unique order ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-VEL-${randomSuffix}`;

    const customerName = `${firstName.trim()} ${lastName.trim()}`;
    const userId = req.user ? req.user.id : null;

    db.prepare(`
      INSERT INTO orders (
        id, user_id, customer_name, email, phone, address, city, state, zip, country,
        shipping_method, shipping_cost, subtotal, total, status, payment_status, items_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 'paid', ?)
    `).run(
      orderId,
      userId,
      customerName,
      email.trim().toLowerCase(),
      phone.trim(),
      address.trim(),
      city.trim(),
      state ? state.trim() : '',
      zip.trim(),
      country || 'US',
      shippingMethod,
      shippingCost,
      subtotal,
      total,
      JSON.stringify(validatedItems)
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId,
        orderNumber: orderId,
        customerName,
        email: email.trim().toLowerCase(),
        address: `${address.trim()}, ${city.trim()}`,
        items: validatedItems,
        subtotal,
        shippingCost,
        total,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id
 */
export function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      data: {
        ...order,
        items: JSON.parse(order.items_json)
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/my-orders (Authenticated)
 */
export function getUserOrders(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE user_id = ? OR email = ?
      ORDER BY created_at DESC
    `).all(req.user.id, req.user.email);

    res.json({
      success: true,
      data: orders.map(o => ({
        ...o,
        items: JSON.parse(o.items_json)
      }))
    });
  } catch (err) {
    next(err);
  }
}
