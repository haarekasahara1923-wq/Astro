# 💳 PayPal Integration Setup Guide

## 🎯 **Purpose:**
Enable international (USD) payments for:
- ✅ Shop Orders (Cosmic Gems products)
- ✅ Astrology Consultations (wallet recharge)

---

## 📋 **Step 1: Create PayPal Business Account (FREE)**

1. Visit: https://www.paypal.com/in/business
2. Click **"Sign Up"**
3. Select **"Business Account"**
4. Fill your business details:
   - Business Name: "Cosmic Gems" या आपका business name
   - Business Type: Individual/Sole Proprietor
   - Email address (will be PayPal login)
   - Password

5. **Verify Email** - PayPal से email आएगा, verify करो

---

## 📋 **Step 2: Get API Credentials**

### **For Testing (Sandbox Mode):**
1. Visit: https://developer.paypal.com/
2. Login with your PayPal account
3. Go to **"Dashboard"**
4. Click **"Apps & Credentials"**
5. Make sure **"Sandbox"** tab is selected (for testing)
6. Under **"REST API apps"**, click **"Create App"**
7. App Name: "Cosmic Gems API" (कोई भी नाम)
8. Click **"Create App"**
9. आपको **Client ID** और **Secret** मिलेंगे:
   - **Client ID** - Copy करो
   - **Secret** - "Show" button पे click करके copy करो

### **For Production (Live Mode):**
1. Same process as above
2. But select **"Live"** tab instead of "Sandbox"
3. **Note:** Live mode के लिए PayPal account fully verified होना चाहिए

---

## 🔧 **Step 3: Update Vercel Environment Variables**

### **Backend (Important):**
1. Vercel Dashboard → Backend Project
2. Settings → Environment Variables
3. Add these:
   ```
   PAYPAL_CLIENT_ID = YOUR_CLIENT_ID_HERE
   PAYPAL_CLIENT_SECRET = YOUR_SECRET_HERE
   ```
4. **Save** और **Redeploy**

### **Frontend:** (Already configured, no changes needed)

---

## 🧪 **Step 4: Testing**

### **Sandbox (Test) Mode:**
PayPal provides test accounts for testing:

1. Developer Dashboard → **"Sandbox"** → **"Accounts"**
2. आपको 2 test accounts मिलेंगे:
   - **Business Account** (merchant - receives money)
   - **Personal Account** (buyer - pays money)

### **Test Payment:**
1. Shop में jao, product add करो
2. Checkout page पे **"$ USD"** button click करो
3. "Proceed to Payment" click करो
4. PayPal window खुलेगा
5. **Personal test account** से login करो (credentials dashboard में मिलेंगे)
6. Payment complete करो
7. Done! ✅

### **Test Account Credentials:**
- Dashboard में jaao: https://developer.paypal.com/dashboard/accounts
- Personal Account के "..." three dots पे click करो
- "View/Edit Account" चुनो
- Email और Password देखो
- इन credentials से PayPal login करो testing के लिए

---

## 💰 **Step 5: Go Live (Production)**

जब testing complete हो जाए:

1. PayPal Business Account को **verify** करो:
   - Bank account link करो
   - KYC documents submit करो
   - Email और phone verify करो

2. **Live API Credentials** generate करो:
   - Developer Dashboard → **"Live"** tab
   - Create App (same process as sandbox)
   - New Client ID और Secret

3. **Vercel Environment Variables Update:**
   - Sandbox credentials replace करो Live credentials से
   - Redeploy करो

4. **Live Testing:**
   - Real payment test करो
   - Small amount से start करो (₹10-20 equivalent)

---

## ✅ **Features Enabled:**

### **Shop Checkout:**
- Currency toggle: **₹ INR** (Razorpay) या **$ USD** (PayPal)
- Automatic conversion: ₹83 = $1
- International customers seamlessly pay in USD

### **Astrology Consultations:**
- Same dual payment system
- Wallet recharge in USD/INR based on selection

---

## 🔒 **Security:**

- ✅ **Sandbox Mode** first - No real money involved
- ✅ **API Secrets** केवल backend में
- ✅ **HTTPS** required (Vercel automatically provides)
- ✅ **Signature Verification** built-in

---

## 📊 **Currency Conversion:**

**Current Rate:** ₹83 = $1 (hardcoded)

**Auto-calculation:**
- ₹830 = $10
- ₹1660 = $20
- ₹4150 = $50

यह approximate है। Real-time rates के लिए API integrate कर सकते हो (बाद में).

---

## 🎯 **Summary:**

**Required Actions:**
1. ✅ PayPal Business Account banao
2. ✅ Developer Dashboard में app create करो
3. ✅ Sandbox Client ID और Secret copy करो
4. ✅ Vercel backend में credentials paste करो
5. ✅ Redeploy करो
6. ✅ Test payment करो with sandbox account
7. ✅ Live mode activate करो jab ready ho

---

**⏱️ Time needed:** 10-15 minutes  
**Priority:** MEDIUM - International payments के लिए zaroori hai

**Support:**
- PayPal Sandbox: https://developer.paypal.com/dashboard
- PayPal Test Accounts: https://developer.paypal.com/dashboard/accounts
- Documentation: https://developer.paypal.com/api/rest/
