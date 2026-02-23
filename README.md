<div align="center">
  <img src="public/favicon.ico" alt="Logo" width="80" height="80">

  <h1 align="center">✨ Elevate - The Premium Student Dashboard</h1>

  <p align="center">
    A beautiful, dynamic, and powerful glassmorphic dashboard built for modern students to track their courses, study hours, tasks, and exams seamlessly.
    <br />
    <br />
    <a href="#">View Demo</a>
    ·
    <a href="https://github.com/YOUR_USERNAME/student-dashboard/issues">Report Bug</a>
    ·
    <a href="https://github.com/YOUR_USERNAME/student-dashboard/issues">Request Feature</a>
  </p>
</div>

---

<div align="center">
  <img src="public/screenshots/dashboard.png" alt="Dashboard Screenshot" />
</div>

## 🌟 About The Project

Elevate is a highly polished, aesthetic-first Student Dashboard application designed to help learners manage their academic life efficiently. Leveraging the power of Next.js 14, React Server Components, and a robust PostgreSQL database via Prisma, the dashboard offers a rich, interactive, and beautifully animated user experience.

Whether you need to manage your daily to-do list with an integrated Pomodoro timer, log your weekly study hours, or visualize your upcoming exam timeline across a dynamic responsive calendar—Elevate has you covered.

### 🔥 Key Features

- **🎨 Premium UI/UX:** Gorgeous glassmorphic design system featuring buttery-smooth micro-animations, rich gradients, and dynamic light/dark theme toggling.
- **📊 Dynamic Analytics:** Real-time calculation of weekly "Study vs. Exam" hours, streak tracking, and live average performance scoring.
- **✅ Intelligent Task Management:** Integrated to-do lists that sync seamlessly with your calendar and support focus-session time logging via Pomodoro.
- **📅 Interactive Calendar:** A fully responsive, server-rendered calendar grid dynamically displaying your upcoming live classes and exams.
- **⚡ Blazing Fast:** Built on the Next.js App Router with React Server Actions for instant data mutations and zero client-side fetching waterfalls.
- **🔐 Secure Auth:** Full authentication flow integrated deeply into the database architecture to ensure your tasks remain private.

### 🛠️ Built With

This project relies on the following massive technologies:

* [![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
* [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
* [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
* [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
* [![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
* [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

If you want to run this dashboard locally, fork it, and modify it for your own personal daily use, follow these steps to get a local copy up and running easily.

### Prerequisites

You need `Node.js` installed and a PostgreSQL database.

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/YOUR_USERNAME/student-dashboard.git
   ```
2. **Install NPM packages**
   ```sh
   cd student-dashboard
   npm install
   ```
3. **Set up `.env` File**
   Create a `.env` file in the root directory and add your PostgreSQL connection string and a secret key for authentication:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/student_dashboard?schema=public"
   AUTH_SECRET="generate_a_random_very_long_secret_key_here"
   ```
4. **Push the Database Schema**
   Initialize your PostgreSQL database with the required tables:
   ```sh
   npx prisma db push
   ```
5. **Start the Development Server**
   ```sh
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000`.

---

## 📸 Screenshots

Here is a glimpse of the application in action.

<div align="center">
  <img src="public/screenshots/calendar.png" alt="Calendar Screen" width="48%" />
  <img src="public/screenshots/tasks.png" alt="Task Screen" width="48%" />
</div>

---

## 💡 Usage

1. **Dashboard:** Land on the home page to see your daily greeting dynamically updated with your remaining classes and active to-do items. Use the dynamic chart to manually log or retroactively record study hours.
2. **Tasks:** Organize your study items here. Click on a task to open the Focus Timer overlay, select a time duration, and track your deep-work sessions directly into the database.
3. **Calendar:** Get the "Big Picture" view. Any live class or exam you append dynamically plots itself directly onto this grid for easy viewing.
4. **Settings:** Need to code at night? Use the settings tab to persist your preferred Light or Dark mode.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📬 Contact & Links

**Nilanshu** - [@NilanshuGarhewal](https://www.linkedin.com/in/nilanshugarhewal/) - nilanshugarhewal@gmail.com

Project Link: [https://github.com/nilanshugarhewal/elevate](https://github.com/nilanshugarhewal/elevate)

---

<p align="center">
    Built with ❤️ and excessive amounts of coffee.
</p>
