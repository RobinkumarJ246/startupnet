import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import Assistant Provider
import { AssistantProvider, RobotAssistant } from './components/InteractiveAssistant'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StartupNet",
  description: "Collab and grow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AssistantProvider>
          {children}
          <RobotAssistant />
        </AssistantProvider>
      </body>
    </html>
  );
}
