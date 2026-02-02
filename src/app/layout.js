import "./globals.css";
import HeaderSwitcher from "@/componets/headerswitch";
import Footerswitch from "@/componets/Footerswitche";
import { CartProvider } from "@/context/cartcontext";

export const metadata = {
  title: {
    default: "Online E-Commerce Store", 
    template: "%s - E-Commerce Store", 
  },
  description: "Responsive e-commerce layout with Next.js",
};  
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
