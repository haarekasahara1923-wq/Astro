# ⚡ Cloudinary Upload Preset Setup (URGENT)

## 🚨 **क्यों जरूरी है?**
अभी image upload सीधे Cloudinary को जा रहा है (backend के through नहीं)।
इससे Vercel की 4.5MB limit की problem solve हो जाएगी।

---

## 📋 **Cloudinary Dashboard पे Upload Preset बनाओ:**

### **Step 1: Cloudinary Login करो**
1. https://cloudinary.com/console पे जाओ
2. अपने account से login करो

### **Step 2: Settings में जाओ**
1. Top-right में **gear icon (⚙️)** या **Settings** पे click करो
2. Left sidebar में **Upload** tab select करो

### **Step 3: Upload Preset बनाओ**
1. **"Add upload preset"** button पे click करो
2. **Signing Mode:** `Unsigned` select करो (बहुत जरूरी!)
3. **Upload preset name:** `cosmic_gems_preset` लिखो (exactly same)

### **Step 4: Optional Settings (Recommended)**
- **Folder:** `cosmic-gems` (images organized रहेंगी)
- **Format:** Auto (automatic optimization के लिए)
- **Quality:** Auto
- **Transformations:** 
  - Width: 1200
  - Crop: Limit
  - Quality: Auto

### **Step 5: Save करो**
- **Save** button पे click करो

---

## ✅ **Verification:**
Setup complete होने के बाद:
1. Admin panel खोलो
2. Product add करो
3. Image select करो
4. Upload होना चाहिए बिना किसी error के!

---

## 🔍 **Troubleshooting:**

### अगर "Invalid upload preset" error आए:
- Preset name check करो: **cosmic_gems_preset** (exactly match होना चाहिए)
- Signing mode **Unsigned** होना चाहिए
- Save करने के बाद 1-2 minutes wait करो

### अगर CORS error आए:
- Cloudinary automatically CORS handle करता है for unsigned uploads
- अगर फिर भी आए तो Settings → Security → Allowed fetch domains में अपना domain add करो

---

## 📊 **Benefits:**
- ✅ कोई भी size की image upload हो सकती है
- ✅ Fast upload (direct to Cloudinary)
- ✅ Automatic optimization
- ✅ CDN delivery
- ✅ No backend payload limits

---

**⏱️ Time needed: 2 minutes**
**Priority: HIGH - Image upload नहीं होगा जब तक यह setup नहीं होगा**
