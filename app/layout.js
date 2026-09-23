import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";

export const metadata = {
  title: "Product Admin Dashboard",
  description: "Manage products backed by the DummyJSON API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <AuthProvider>
          <ProductProvider>{children}</ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
