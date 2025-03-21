import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import Assistant Provider
import { AssistantProvider, RobotAssistant } from './components/InteractiveAssistant'
// Import Auth Provider
import { AuthProvider } from './lib/auth/AuthContext';

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
        <AuthProvider>
          <AssistantProvider>
            {children}
            <RobotAssistant />
          </AssistantProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
