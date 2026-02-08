# Cloudinary Setup Instructions

## 🚀 **Kya hai Cloudinary?**
Cloudinary ek cloud-based image management service hai jo:
- **Unlimited image size** support karta hai
- **Auto-optimization** - images automatically compress aur optimize ho jati hain
- **CDN delivery** - worldwide fast loading
- **Free tier** - 25 GB storage aur 25 GB bandwidth free

---

## 📋 **Setup Steps:**

### 1. **Cloudinary Account Banao (FREE)**
1. Visit: https://cloudinary.com/
2. "Sign Up for Free" pe click karo
3. Email/Google se signup karo
4. Email verify karo

### 2. **Credentials Copy Karo**
Dashboard pe jaane ke baad:
1. **Cloud Name** copy karo
2. **API Key** copy karo
3. **API Secret** copy karo (eye icon pe click karke dekho)

### 3. **Backend .env File Update Karo**
`apps/backend/.env` file mein ye replace karo:

```bash
# --- CLOUDINARY (Image Storage) ---
CLOUDINARY_CLOUD_NAME="your_actual_cloud_name"
CLOUDINARY_API_KEY="your_actual_api_key"
CLOUDINARY_API_SECRET="your_actual_api_secret"
```

### 4. **Vercel Environment Variables Set Karo**
1. Vercel dashboard pe jao
2. Backend project select karo
3. Settings → Environment Variables
4. Teen variables add karo:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### 5. **Redeploy Karo**
Vercel automatically redeploy hoga ya manually trigger karo.

---

## ✅ **Benefits:**
1. **4MB limit khatam!** - Ab koi bhi size ki image upload kar sakte hain
2. **Auto compression** - Cloudinary automatically optimize karega
3. **Fast loading** - CDN se images serve hongi
4. **Better UX** - Admin ko "uploading..." status dikhega
5. **Cost effective** - Free tier bahut hai small businesses ke liye

---

## 🎯 **Usage:**
Admin panel mein:
1. Product add/edit karte time
2. Image select karo
3. Automatically Cloudinary pe upload hoga
4. URL database mein save hoga
5. Shop page pe fast load hoga

---

## 📊 **Free Tier Limits:**
- ✅ 25 GB Storage
- ✅ 25 GB Monthly Bandwidth
- ✅ 25,000 Monthly Transformations
- ✅ CDN included

Yeh limits chhote se medium business ke liye kaafi hain!
