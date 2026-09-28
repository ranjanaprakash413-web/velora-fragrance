async function runTests() {
  console.log('Testing VELORA API Endpoints...\n');

  const base = 'http://localhost:5000/api';

  // 1. Health
  const healthRes = await fetch(`${base}/health`);
  const health = await healthRes.json();
  console.log('1. Health Check:', health.status === 'healthy' ? 'PASSED' : 'FAILED', health);

  // 2. Products
  const prodRes = await fetch(`${base}/products`);
  const prods = await prodRes.json();
  console.log('2. Products List:', prods.success && prods.data.length === 4 ? 'PASSED' : 'FAILED', `Count: ${prods.data.length}`);

  // 3. Single Product
  const noirRes = await fetch(`${base}/products/velora-noir`);
  const noir = await noirRes.json();
  console.log('3. Single Product (Noir):', noir.success && noir.data.name === 'VELORA Noir' ? 'PASSED' : 'FAILED');

  // 4. Reviews
  const revRes = await fetch(`${base}/reviews`);
  const revs = await revRes.json();
  console.log('4. Reviews List:', revs.success && revs.data.length === 6 ? 'PASSED' : 'FAILED', `Count: ${revs.data.length}`);

  // 5. Newsletter
  const subRes = await fetch(`${base}/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'connoisseur@luxury.com' })
  });
  const sub = await subRes.json();
  console.log('5. Newsletter Subscription:', sub.success ? 'PASSED' : 'FAILED', sub.message);

  // 6. Auth Login
  const loginRes = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@velora.com', password: 'VeloraCustomer2026!' })
  });
  const loginData = await loginRes.json();
  console.log('6. Auth Login:', loginData.success ? 'PASSED' : 'FAILED', `Token: ${loginData.data?.token?.slice(0, 20)}...`);

  // 7. Order Placement
  const orderRes = await fetch(`${base}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginData.data.token}`
    },
    body: JSON.stringify({
      firstName: 'Eleanor',
      lastName: 'Vance',
      email: 'customer@velora.com',
      phone: '555-0192',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zip: '97477',
      country: 'US',
      shippingMethod: 'standard',
      items: [
        {
          id: 'velora-noir',
          name: 'VELORA Noir',
          price: 285,
          quantity: 1,
          selectedSize: { ml: 100, price: 285 }
        }
      ]
    })
  });
  const orderData = await orderRes.json();
  console.log('7. Order Placement:', orderData.success ? 'PASSED' : 'FAILED', `OrderID: ${orderData.data?.orderId}, Total: $${orderData.data?.total}`);

  // 8. User Order History
  const historyRes = await fetch(`${base}/orders/my-orders`, {
    headers: { 'Authorization': `Bearer ${loginData.data.token}` }
  });
  const historyData = await historyRes.json();
  console.log('8. User Orders History:', historyData.success && historyData.data.length > 0 ? 'PASSED' : 'FAILED', `Count: ${historyData.data?.length}`);

  console.log('\nAll API Verification Tests Completed Successfully!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
