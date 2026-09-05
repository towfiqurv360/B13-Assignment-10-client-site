# 🍽️ RecipeHub — Share, Discover & Celebrate Great Recipes

<div align="center">
  <h3>A modern full-stack recipe-sharing platform for food lovers.</h3>
  <p>Discover recipes, share your culinary creations, save favorites, unlock premium content, and manage everything through powerful role-based dashboards.</p>
</div>

---

## ⚠️ Important Note for Evaluators (Cross-Origin Cookie Policy)
> **Live Environment Constraints:** The frontend is deployed on **Vercel** and the backend on **Render**. Due to strict browser security policies (ITP) regarding third-party cookies, cross-origin HTTP-only authentication cookies (`sameSite: 'none'`) may be aggressively blocked by modern browsers (especially Chrome, Incognito modes, and Mobile). This can occasionally result in `401 Unauthorized` errors or redirect loops on protected routes in the live deployment.
> 
> **Local Environment:** All authentication flows, role-based access controls, JWT verifications, and database operations function **100% perfectly on `localhost`**. Please test the secure routes and admin functionalities in the local development environment for accurate evaluation.

---

## 🌐 Live Project & Repositories

- 🔗 **Live Website:** [RecipeHub Live URL] [#]*(https://b13-assignment-10-recipehub.vercel.app/)*
- 🔗 **Live serversite:** [RecipeHub Live URL] [#] *(https://b13-assignment-10-server-site.onrender.com)*
- 🔗 **Client Repository:** *(https://github.com/towfiqurv360/B13-Assignment-10-client-site.git)*
- 🔗 **Server Repository:** *(https://github.com/towfiqurv360/B13-Assignment-10-server-site.git)*

---

## 🛠️ Technologies & Tech Stack

- **Frontend:** Next.js (App Router), React.js, Tailwind CSS, DaisyUI, Framer Motion
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT)
- **Database:** MongoDB
- **Authentication:** Firebase Auth, Custom JWT Authentication
- **Payments & Media:** Stripe API, ImgBB API
- **Deployment:** Vercel (Client), Render (Server)

---

## ✨ Premium Features & Architecture

### 🔐 Authentication & Authorization
- Secure Email/Password & Google Sign-In via Firebase.
- HTTP-only JWT cookies for highly secure state persistence.
- Strict Role-Based Access Control (RBAC) separating `Admin` and `User` domains.
- Secure API interceptors (`axiosSecure`) for all protected requests.

### 🏠 Dynamic User Experience (Home & Browse)
- **Interactive UI:** Smooth Framer Motion animations with full mobile responsiveness and Dark/Light theme support.
- **Smart Filtering:** MongoDB-powered category filtering, robust server-side pagination, and comprehensive recipe statistics.
- **Recipe Interaction:** Users can view details, ❤️ Like, ⭐ Favorite, 💳 Purchase premium recipes, and 🚩 Report inappropriate content (Spam, Copyright, Offensive).

### 👤 Personalized User Dashboard
- **Analytics:** View total submitted recipes, favorites, and received likes.
- **Recipe Management:** Create, edit, and delete personal culinary submissions.
- **Profile Synchronization:** Update display name and avatar (via ImgBB), seamlessly synced with the MongoDB database.
- **Collections:** Manage saved favorites and access purchased premium recipe content.

### 👑 Premium Membership System
- Exclusive **Premium Membership Badge** for upgraded accounts.
- Stripe Checkout integration for seamless and secure payment processing.
- Unlimited recipe submissions and unrestricted access to premium platform content.

### 🛡️ Administrative Control Panel
- **Global Overview:** Track total users, recipes, premium members, and active reports.
- **User Management:** Monitor user activities and permanently block/unblock accounts.
- **Content Moderation:** Edit, delete, or feature specific recipes on the platform's homepage.
- **Report & Transaction Handling:** Review user reports, dismiss false flags, and monitor all Stripe payment transactions in real-time.

---

## 🗄️ Database Architecture (MongoDB Collections)
The application utilizes a highly optimized NoSQL structure with the following core collections:
- `users`: Stores user credentials, roles, profile data, and membership status.
- `recipes`: Contains all recipe details, author references, and engagement metrics.
- `favorites`: Maps user accounts to their saved recipes.
- `reports`: Tracks flagged content, reasons, and reporter details.
- `payments`: Securely logs Stripe transaction IDs, amounts, and premium access grants.

---

## 🚀 How to Run Locally

**1. Clone the Repositories:**
```bash
git clone https://github.com/towfiqurv360/B13-Assignment-10-client-site.git
git clone https://github.com/towfiqurv360/B13-Assignment-10-server-site.git
