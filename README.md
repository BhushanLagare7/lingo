# 🦉 Lingo

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-orange?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Lingo** is a comprehensive, gamified language learning platform built with modern web technologies. Inspired by popular language apps, it offers a full-stack experience featuring interactive lessons, an administrative dashboard, and a subscription-based model. 🌟

---

## ✨ Key Features

- **🎓 Interactive Learning**: Engage in diverse challenge types (`SELECT`, `ASSIST`) with multimedia support (images/audio).
- **🎮 Gamification**: Stay motivated with Experience Points (XP), a Heart/Life system, and competitive Leaderboards.
- **🛡️ Admin Dashboard**: Built with `react-admin`, allowing for easy management of courses, units, lessons, and challenges.
- **💳 Pro Subscriptions**: Integration with Stripe for managing premium subscriptions and unlimited hearts.
- **🔐 Secure Auth**: User authentication and management powered by Clerk.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **🎨 Modern UI**: Beautifully crafted components using Tailwind CSS 4 and Shadcn UI.

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js**: 20.x or later 🟢
- **Database**: A Neon PostgreSQL account 🐘
- **Auth**: A Clerk account for authentication 🔑
- **Payments**: A Stripe account for payments 💳

### 🛠️ Setup Instructions

1.  **Clone the repository**: 📂
    ```bash
    git clone https://github.com/BhushanLagare7/lingo.git
    cd lingo
    ```

2.  **Install dependencies**: 📦
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**: ⚙️
    Create a `.env` file in the root directory and add the following:
    ```env
    # 🔐 Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
    CLERK_SECRET_KEY=your_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/learn
    NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/learn
    ADMIN_USER_ID=your_clerk_user_id

    # 🐘 Database
    DATABASE_URL=your_neon_postgres_url

    # 💳 Stripe
    STRIPE_API_KEY=your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

    # 🌐 App URL
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Initialize the Database**: 🏗️
    ```bash
    npm run db:push
    ```

5.  **Seed the Database (Optional)**: 🌱
    ```bash
    npm run db:seed
    npm run db:reset
    npm run db:prod
    ```

6.  **Start the development server**: 🔥
    ```bash
    npm run dev
    ```

---

## 🛠️ Tech Stack

| Technology | Purpose | Icon |
| :--- | :--- | :---: |
| **Next.js** | Framework | ⚛️ |
| **TypeScript** | Language | 📘 |
| **Drizzle ORM** | Database Access | 💧 |
| **PostgreSQL** | Database | 🐘 |
| **Clerk** | Authentication | 🔐 |
| **Stripe** | Payments | 💳 |
| **Tailwind CSS** | Styling | 🎨 |
| **Shadcn UI** | UI Components | 🏗️ |
| **Zustand** | State Management | 🐻 |

---

## 📖 Usage

### 👤 User Experience
- **Landing Page**: Introduction to the platform and secure authentication. 🏠
- **Learning Dashboard (/learn)**: Access units and interactive lessons for your active course. 📚
- **Leaderboard**: Compete with other users and climb the ranks based on XP. 🏆
- **Shop**: Use earned XP to refill hearts or subscribe to **Lingo Pro** for unlimited hearts. 🛒

### 🛡️ Administrative Experience
- **Admin Panel (/admin)**: Accessible only to the `ADMIN_USER_ID` specified in `.env`.
- Manage the entire learning hierarchy: `Courses` ➔ `Units` ➔ `Lessons` ➔ `Challenges` ➔ `Options`. 📝

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. 💖

1.  Fork the Project 🍴
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`) 🌿
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`) 💾
4.  Push to the Branch (`git push origin feature/AmazingFeature`) 🚀
5.  Open a Pull Request 🔄

---

## 🆘 Support

If you have any questions or need help, please feel free to:
- Open an [Issue](https://github.com/BhushanLagare7/lingo/issues) 🐛
- Refer to the [Next.js Documentation](https://nextjs.org/docs) 📖

---

## 👤 Maintainers

- **Bhushan Lagare** - [GitHub](https://github.com/BhushanLagare7) 👨‍💻

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 📜
