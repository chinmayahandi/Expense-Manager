const BASE_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("🚀 Starting SpendWise API Endpoint Verification Tests...");
  
  const testEmail = `alex_${Date.now()}@example.com`;
  const testPassword = "password123";
  let token = "";
  let createdTxnId = "";

  // 1. Test POST /api/auth/register
  console.log("\n1. Testing User Registration...");
  try {
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: "Alex Mercer Test",
        email: testEmail,
        password: testPassword
      })
    });
    const registerData = await registerRes.json();
    console.log(`Response Status: ${registerRes.status}`);
    console.log("Response Body:", registerData);
    
    if (registerRes.status === 201 && registerData.success && registerData.token) {
      console.log("✅ User registration test passed.");
    } else {
      console.error("❌ User registration test failed.");
      return;
    }
  } catch (err) {
    console.error("Error in registration:", err.message);
    return;
  }

  // 2. Test POST /api/auth/login
  console.log("\n2. Testing User Login...");
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginData = await loginRes.json();
    console.log(`Response Status: ${loginRes.status}`);
    console.log("Response Body:", loginData);
    
    if (loginRes.status === 200 && loginData.success && loginData.token) {
      token = loginData.token;
      console.log("✅ User login test passed.");
    } else {
      console.error("❌ User login test failed.");
      return;
    }
  } catch (err) {
    console.error("Error in login:", err.message);
    return;
  }

  // 3. Test GET /api/auth/me (Protected Profile)
  console.log("\n3. Testing Get Active User Profile (/auth/me)...");
  try {
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const meData = await meRes.json();
    console.log(`Response Status: ${meRes.status}`);
    console.log("Response Body:", meData);
    
    if (meRes.status === 200 && meData.success && meData.user.email === testEmail) {
      console.log("✅ Profile lookup test passed.");
    } else {
      console.error("❌ Profile lookup test failed.");
      return;
    }
  } catch (err) {
    console.error("Error in auth/me:", err.message);
    return;
  }

  // 4. Test POST /api/transactions (Create Transaction)
  console.log("\n4. Testing Create Transaction...");
  try {
    const createRes = await fetch(`${BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title: "HP Fuel Petrol Pump Refuel",
        amount: 1800,
        type: "expense",
        category: "Travel",
        date: "2026-07-08",
        notes: " hp fuel full tank refuel"
      })
    });
    const createData = await createRes.json();
    console.log(`Response Status: ${createRes.status}`);
    console.log("Response Body:", createData);
    
    if (createRes.status === 201 && createData.success && createData.transaction.id) {
      createdTxnId = createData.transaction.id;
      console.log("✅ Create transaction test passed.");
    } else {
      console.error("❌ Create transaction test failed.");
      return;
    }
  } catch (err) {
    console.error("Error in creating transaction:", err.message);
    return;
  }

  // 5. Test GET /api/transactions (Get Transactions List)
  console.log("\n5. Testing Retrieve Transactions List...");
  try {
    const listRes = await fetch(`${BASE_URL}/transactions`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const listData = await listRes.json();
    console.log(`Response Status: ${listRes.status}`);
    console.log("Number of transactions returned:", listData.count);
    
    if (listRes.status === 200 && listData.success && listData.count > 0) {
      console.log("✅ Get transactions list test passed.");
    } else {
      console.error("❌ Get transactions list test failed.");
      return;
    }
  } catch (err) {
    console.error("Error in list transactions:", err.message);
    return;
  }

  // 6. Test GET /api/transactions/:id (Get Single Transaction)
  console.log(`\n6. Testing Retrieve Single Transaction (ID: ${createdTxnId})...`);
  try {
    const singleRes = await fetch(`${BASE_URL}/transactions/${createdTxnId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const singleData = await singleRes.json();
    console.log(`Response Status: ${singleRes.status}`);
    console.log("Response Body:", singleData);
    
    if (singleRes.status === 200 && singleData.success && singleData.transaction.id === createdTxnId) {
      console.log("✅ Retrieve single transaction test passed.");
    } else {
      console.error("❌ Retrieve single transaction test failed.");
      return;
    }
  } catch (err) {
    console.error("Error in single transaction lookup:", err.message);
    return;
  }

  // 7. Test PUT /api/transactions/:id (Update Transaction)
  console.log(`\n7. Testing Update Transaction (ID: ${createdTxnId})...`);
  try {
    const updateRes = await fetch(`${BASE_URL}/transactions/${createdTxnId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title: "Updated HP Petrol Pump Refuel",
        amount: 2200,
        type: "expense",
        category: "Travel",
        date: "2026-07-08",
        notes: "Updated price, HP full tank refuel"
      })
    });
    const updateData = await updateRes.json();
    console.log(`Response Status: ${updateRes.status}`);
    console.log("Response Body:", updateData);
    
    if (updateRes.status === 200 && updateData.success && updateData.transaction.amount === 2200) {
      console.log("✅ Update transaction test passed.");
    } else {
      console.error("❌ Update transaction test failed.");
      return;
    }
  } catch (err) {
    console.error("Error in updating transaction:", err.message);
    return;
  }

  // 8. Test DELETE /api/transactions/:id (Delete Transaction)
  console.log(`\n8. Testing Delete Transaction (ID: ${createdTxnId})...`);
  try {
    const deleteRes = await fetch(`${BASE_URL}/transactions/${createdTxnId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const deleteData = await deleteRes.json();
    console.log(`Response Status: ${deleteRes.status}`);
    console.log("Response Body:", deleteData);
    
    if (deleteRes.status === 200 && deleteData.success) {
      console.log("✅ Delete transaction test passed.");
    } else {
      console.error("❌ Delete transaction test failed.");
      return;
    }
  } catch (err) {
    console.error("Error in deleting transaction:", err.message);
    return;
  }

  // 9. Test Double Delete / 404 validation
  console.log(`\n9. Testing Get Deleted Transaction (Expecting 404)...`);
  try {
    const verifyRes = await fetch(`${BASE_URL}/transactions/${createdTxnId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const verifyData = await verifyRes.json();
    console.log(`Response Status: ${verifyRes.status} (Expected: 404)`);
    console.log("Response Body:", verifyData);
    
    if (verifyRes.status === 404 && !verifyData.success) {
      console.log("✅ Transaction 404 lookup guard test passed.");
    } else {
      console.error("❌ Transaction 404 lookup guard test failed.");
      return;
    }
  } catch (err) {
    console.error("Error in verify deleted transaction:", err.message);
    return;
  }

  console.log("\n🎉 ALL SpendWise API Endpoint Verification Tests passed successfully!");
}

runTests();
