import db, { initDatabase } from '../config/db.js';
import bcrypt from 'bcryptjs';

export function runSeeds() {
  initDatabase();

  console.log('[Seed] Seeding database...');

  // 1. Seed Users (Admin & Demo Customer)
  const userCheck = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCheck.count === 0) {
    const adminPasswordHash = bcrypt.hashSync('VeloraAdmin2026!', 10);
    const customerPasswordHash = bcrypt.hashSync('VeloraCustomer2026!', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);

    insertUser.run('VELORA Concierge', 'admin@velora.com', adminPasswordHash, 'admin');
    insertUser.run('Eleanor Vance', 'customer@velora.com', customerPasswordHash, 'customer');
    console.log('[Seed] Users seeded successfully.');
  }

  // 2. Seed Products
  const productCheck = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (productCheck.count === 0) {
    const initialProducts = [
      {
        id: 'velora-noir',
        name: 'VELORA Noir',
        category: 'Woody & Spicy',
        tagline: 'Dark, woody, and mysterious',
        description: 'A captivating blend of smoky oud, black leather, and dark amber. VELORA Noir embodies the mystery of midnight, with warm cedarwood and a hint of black pepper that creates an unforgettable trail.',
        price: 285,
        sizes: JSON.stringify([
          { ml: 30, price: 145 },
          { ml: 50, price: 215 },
          { ml: 100, price: 285 }
        ]),
        rating: 4.8,
        review_count: 124,
        notes: JSON.stringify({
          top: ['Black Pepper', 'Bergamot', 'Saffron'],
          heart: ['Oud', 'Black Leather', 'Rose Absolute'],
          base: ['Dark Amber', 'Cedarwood', 'Musk']
        }),
        image: 'velora_noir.jpg',
        featured: 1,
        stock: 50
      },
      {
        id: 'velora-gold',
        name: 'VELORA Gold',
        category: 'Oriental & Amber',
        tagline: 'Warm, rich, and sophisticated',
        description: 'A luxurious symphony of golden amber, vanilla orchid, and precious sandalwood. VELORA Gold captures the warmth of liquid gold, wrapping you in an aura of refined opulence.',
        price: 320,
        sizes: JSON.stringify([
          { ml: 30, price: 165 },
          { ml: 50, price: 240 },
          { ml: 100, price: 320 }
        ]),
        rating: 4.9,
        review_count: 189,
        notes: JSON.stringify({
          top: ['Mandarin', 'Pink Pepper', 'Cardamom'],
          heart: ['Golden Amber', 'Vanilla Orchid', 'Jasmine Sambac'],
          base: ['Sandalwood', 'Tonka Bean', 'White Musk']
        }),
        image: 'velora_gold.jpg',
        featured: 1,
        stock: 45
      },
      {
        id: 'velora-oud',
        name: 'VELORA Oud',
        category: 'Oriental & Oud',
        tagline: 'Deep, luxurious, and intense',
        description: 'An opulent masterpiece of rare oud, rich saffron, and precious rose absolute. VELORA Oud is a statement of uncompromising luxury, crafted for those who command attention.',
        price: 450,
        sizes: JSON.stringify([
          { ml: 30, price: 225 },
          { ml: 50, price: 340 },
          { ml: 100, price: 450 }
        ]),
        rating: 4.9,
        review_count: 97,
        notes: JSON.stringify({
          top: ['Saffron', 'Cinnamon', 'Nutmeg'],
          heart: ['Oud', 'Rose Absolute', 'Iris'],
          base: ['Sandalwood', 'Amber', 'Leather']
        }),
        image: 'velora_oud.jpg',
        featured: 1,
        stock: 30
      },
      {
        id: 'velora-bloom',
        name: 'VELORA Bloom',
        category: 'Floral & Elegant',
        tagline: 'Fresh, floral, and elegant',
        description: 'A graceful bouquet of Bulgarian rose, white lily, and delicate peony. VELORA Bloom celebrates feminine elegance with a modern twist of fresh citrus and creamy musks.',
        price: 245,
        sizes: JSON.stringify([
          { ml: 30, price: 125 },
          { ml: 50, price: 185 },
          { ml: 100, price: 245 }
        ]),
        rating: 4.7,
        review_count: 156,
        notes: JSON.stringify({
          top: ['Bergamot', 'Pear Blossom', 'Pink Pepper'],
          heart: ['Bulgarian Rose', 'White Lily', 'Peony'],
          base: ['White Musk', 'Ambrette', 'Cashmere Wood']
        }),
        image: 'velora_bloom.jpg',
        featured: 1,
        stock: 60
      }
    ];

    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, category, tagline, description, price, sizes, rating, review_count, notes, image, featured, stock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of initialProducts) {
      insertProduct.run(
        p.id, p.name, p.category, p.tagline, p.description, p.price,
        p.sizes, p.rating, p.review_count, p.notes, p.image, p.featured, p.stock
      );
    }
    console.log('[Seed] Products seeded successfully.');
  }

  // 3. Seed Reviews
  const reviewCheck = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
  if (reviewCheck.count === 0) {
    const initialReviews = [
      {
        name: 'Alexandra M.',
        initial: 'A',
        rating: 5,
        text: 'VELORA Gold has become my signature scent. The amber notes are incredibly rich and long-lasting, garnering compliments wherever I go. Truly a masterpiece of perfumery.',
        product_name: 'VELORA Gold',
        product_id: 'velora-gold',
        date: 'March 2025'
      },
      {
        name: 'James K.',
        initial: 'J',
        rating: 5,
        text: 'The Oud collection is absolutely magnificent. It projects power and sophistication without being overpowering. The dry down reveals layers of complexity I have never experienced before.',
        product_name: 'VELORA Oud',
        product_id: 'velora-oud',
        date: 'February 2025'
      },
      {
        name: 'Sophie L.',
        initial: 'S',
        rating: 5,
        text: 'Bloom is the most elegant floral fragrance I own. It strikes the perfect balance between fresh and creamy, making it versatile for both day and night wear. A staple in my collection.',
        product_name: 'VELORA Bloom',
        product_id: 'velora-bloom',
        date: 'April 2025'
      },
      {
        name: 'Daniel R.',
        initial: 'D',
        rating: 4,
        text: 'Noir captured me from the first spray. The smoky leather and cedarwood combination is intoxicating and mysterious. It settles into a warm, inviting scent that lasts all evening.',
        product_name: 'VELORA Noir',
        product_id: 'velora-noir',
        date: 'January 2025'
      },
      {
        name: 'Isabella V.',
        initial: 'I',
        rating: 5,
        text: 'Every VELORA fragrance tells a story, and Gold speaks of pure luxury. The presentation is as breathtaking as the juice inside. Worth every penny for such an exquisite experience.',
        product_name: 'VELORA Gold',
        product_id: 'velora-gold',
        date: 'May 2025'
      },
      {
        name: 'Marcus T.',
        initial: 'M',
        rating: 5,
        text: 'The longevity and sillage are remarkable. A single spray of Oud lasts well into the next day, evolving beautifully over time. Highly recommend to any true fragrance connoisseur.',
        product_name: 'VELORA Oud',
        product_id: 'velora-oud',
        date: 'March 2025'
      }
    ];

    const insertReview = db.prepare(`
      INSERT INTO reviews (product_id, name, initial, rating, text, product_name, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of initialReviews) {
      insertReview.run(r.product_id, r.name, r.initial, r.rating, r.text, r.product_name, r.date);
    }
    console.log('[Seed] Reviews seeded successfully.');
  }

  console.log('[Seed] Database initialization complete.');
}

// Allow direct execution
if (process.argv[1].endsWith('seedData.js')) {
  runSeeds();
}
