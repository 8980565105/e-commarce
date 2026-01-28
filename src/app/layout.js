import "./globals.css";
import HeaderSwitcher from "@/componets/headerswitch";
import Footerswitch from "@/componets/Footerswitche";
import { CartProvider } from "@/context/cartcontext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <CartProvider>
          <HeaderSwitcher />
          {children}
          <Footerswitch />
        </CartProvider>
      </body>
    </html>
  );
}
