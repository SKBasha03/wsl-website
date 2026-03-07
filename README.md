
  # FC25 League Website

  This is a code bundle for FC25 League Website. The original project is available at https://www.figma.com/design/uYqGBTBn1S5Oym0iwx0Sur/FC25-League-Website.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Auth (Firebase)

  This project uses Firebase Authentication (Email/Password) for **register**, **login**, and **logout**.

  1. Create a Firebase project in the Firebase console.
  2. Add a Web App to get your config values.
  3. Enable **Authentication → Sign-in method → Email/Password**.
  4. Create `.env.local` in the project root and copy values from `.env.example`.

  After that, restart `npm run dev`.
  