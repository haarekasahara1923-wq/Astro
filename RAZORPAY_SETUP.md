# 💳 Razorpay Setup Guide

## 🚨 **Problem:** 
Razorpay payment failing because dummy credentials are set in `.env` file.

---

## 📋 **Solution: Razorpay Account Setup**

### **Step 1: Create Razorpay Account (FREE)**
1. Visit: https://razorpay.com/
2. Click **"Sign Up"** या **"Start Now"**
3. Business details भरो:
   - Business Name: "Cosmic Gems" या कोई भी
   - Business Type: Individual/Proprietorship
   - Phone number verify करो
   - Email verify करो

### **Step 2: Get API Keys**
1. Login करके Dashboard पे जाओ
2. Left sidebar में **"Settings"** click करो
3. **"API Keys"** option select करो
4. **"Generate Test Key"** button पे click करो (पहले test mode use करेंगे)
5. Popup में दो keys मिलेंगे:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (click "Show" to view)
6. दोनों keys **COPY** कर लो

---

## 🔧 **Step 3: Update Vercel Environment Variables**

### **Backend (Most Important)**
1. Vercel Dashboard खोलो
2. **Backend project** select करो
3. Settings → Environment Variables
4. Update करो:
   ```
   RAZORPAY_KEY_ID = rzp_test_YOUR_KEY_ID
   RAZORPAY_KEY_SECRET = YOUR_KEY_SECRET
   ```
5. **Save** करके **Redeploy** करो

### **Frontend**
1. **Frontend project** select करो
2. Settings → Environment Variables  
3. Add करो:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_test_YOUR_KEY_ID
   ```
   (Note: यही key frontend में publicly visible होगी, isliye NEXT_PUBLIC_ prefix hai)
4. **Save** करके **Redeploy** करो

---

## ✅ **Step 4: Testing**

### **Test Mode:**
- Test mode में actual payment नहीं होगी
- Razorpay test card use कर सकते हो:
  - **Card Number:** 4111 1111 1111 1111
  - **CVV:** Any 3 digits
  - **Expiry:** Any future date
  - **Name:** Any name

### **Production Mode (बाद में):**
1. Razorpay dashboard में KYC complete करो
2. Account verify हो जाने के बाद **Live Mode** activate करो
3. Live keys generate करो (starts with `rzp_live_`)
4. Vercel environment variables में test keys replace करो live keys से

---

## 🎯 **Quick Summary:**

### **Required Actions:**
1. ✅ Razorpay account banao
2. ✅ Test API keys generate करो  
3. ✅ Vercel backend में `RAZORPAY_KEY_ID` और `RAZORPAY_KEY_SECRET` set करो
4. ✅ Vercel frontend में `NEXT_PUBLIC_RAZORPAY_KEY_ID` set करो
5. ✅ Both projects **redeploy** करो
6. ✅ Test payment करो

---

## 📞 **Support:**
- Razorpay Test Mode documentation: https://razorpay.com/docs/payments/payments/test-card-details/
- Razorpay Dashboard: https://dashboard.razorpay.com/

---

**⏱️ Time needed: 5-10 minutes**
**Priority: HIGH - Payment नहीं होगा जब तक real keys set नहीं होंगे**
