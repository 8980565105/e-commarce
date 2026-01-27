

export default function UserLayout({ children }) {
  return (
    <section className="user-wrapper">
      {/* <CartProvider> */}
        {children}
        {/* <Footer/> */}
        {/* </CartProvider> */}
    </section>
  );
}
