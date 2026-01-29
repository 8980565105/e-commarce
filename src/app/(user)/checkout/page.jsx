"use client";
import { useCart } from "@/context/cartcontext";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { CreditCard, Wallet, ShoppingBag, AlertCircle } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/get-stripe";
import StripePaymentForm from "@/componets/StripePaymentForm";

export default function CheckoutPage() {
  const { cartItems = [], clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [clientSecret, setClientSecret] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [errors, setErrors] = useState({});

  const calculatedSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + price * qty;
    }, 0);
  }, [cartItems]);

  const shipping = calculatedSubtotal > 0 ? 100 : 0;
  const taxAmount = calculatedSubtotal > 0 ? calculatedSubtotal * 0.05 : 0;
  const grandTotal = calculatedSubtotal + shipping + taxAmount;

  useEffect(() => {
    if (grandTotal > 0 && paymentMethod === "Card") {
      fetch("/api/user/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          customerEmail: formData.email,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(() => toast.error("Payment gateway error"));
    }
  }, [grandTotal, paymentMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zip.trim()) newErrors.zip = "Zip code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error("તમારું કાર્ટ ખાલી છે!");
      return null;
    }

    if (!validateForm()) {
      toast.error("Please fill all details correctly");
      return null;
    }

    setLoading(true);

    const orderData = {
      customerInfo: formData,
      paymentMethod: paymentMethod,
      items: cartItems.map((item) => ({
        productId: item._id,
        title: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        size: item.selectedSize || "N/A",
        image: item.images?.[0] || "",
      })),
      subtotal: calculatedSubtotal,
      shippingFee: shipping,
      tax: taxAmount,
      totalAmount: grandTotal,
    };

    try {
      const response = await fetch("/api/user/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        setCurrentOrderId(result.orderId);
        if (paymentMethod === "Cash") {
          clearCart();
          toast.success("Order Placed (COD)! 🎉");
          router.push("/success");
        }
        return result.orderId;
      } else {
        toast.error(result.error || "Order creation failed");
        setLoading(false);
        return null;
      }
    } catch (error) {
      toast.error("Server connection error");
      setLoading(false);
      return null;
    }
  };

  const handleStripePayment = async (stripe, elements) => {
    const orderId = await handleOrderSubmit();

    if (orderId) {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        await fetch("/api/user/order", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
            status: "Paid",
            paymentStatus: "Paid",
            stripeId: paymentIntent.id,
          }),
        });

        clearCart();
        toast.success("Payment Successful! 🎉");
        router.push("/success");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-4 md:px-12 lg:px-24">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs not-italic">
                1
              </span>
              Delivery Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
              />
              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Full Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={errors.address}
                />
              </div>
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={errors.city}
              />
              <InputField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={errors.state}
              />
              <InputField
                label="Zip Code"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                error={errors.zip}
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs not-italic">
                2
              </span>
              Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <PaymentOption
                icon={<CreditCard size={20} />}
                label="Online Card"
                active={paymentMethod === "Card"}
                onClick={() => setPaymentMethod("Card")}
              />
              <PaymentOption
                icon={<Wallet size={20} />}
                label="Cash on Delivery"
                active={paymentMethod === "Cash"}
                onClick={() => setPaymentMethod("Cash")}
              />
            </div>

            <div className="mt-6">
              {paymentMethod === "Card" ? (
                clientSecret ? (
                  <Elements stripe={getStripe()} options={{ clientSecret }}>
                    <StripePaymentForm
                      onPaymentSuccess={handleStripePayment}
                      loading={loading}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl animate-pulse text-gray-400 font-bold uppercase text-xs tracking-widest">
                    Initializing Secure Gateway...
                  </div>
                )
              ) : (
                <button
                  onClick={handleOrderSubmit}
                  disabled={loading}
                  className="w-full mt-4 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:bg-gray-300 flex items-center justify-center gap-2"
                >
                  {loading ? "Processing Order..." : "Confirm COD Order"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 sticky top-10">
            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
              <ShoppingBag size={20} className="text-red-500" /> Order Summary
            </h2>
            <div className="space-y-4 max-h-100 overflow-y-auto pr-2 mb-6">
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-center border-b border-gray-50 pb-4"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.images?.[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black uppercase truncate text-gray-800">
                      {item.title}
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      Size: {item.selectedSize || "N/A"} | Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-black text-gray-900 mt-1">
                      ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t pt-6">
              <div className="flex justify-between text-gray-500 font-bold text-xs uppercase">
                <span>Subtotal</span>
                <span>₹{calculatedSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold text-xs uppercase">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold text-xs uppercase pb-4">
                <span>Tax (5%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-xl uppercase italic pt-4 border-t border-dashed">
                <span>Total Amount</span>
                <span className="text-red-500">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">
        {label}
      </label>
      <input
        {...props}
        className={`w-full p-4 bg-gray-50 border-2 rounded-2xl text-sm font-bold outline-none transition-all placeholder:text-gray-300 ${
          error
            ? "border-red-500 bg-red-50"
            : "border-transparent focus:bg-white focus:border-red-100"
        }`}
        placeholder={`Enter ${label}`}
      />
      {error && (
        <p className="text-red-500 text-[10px] font-bold uppercase flex items-center gap-1 ml-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function PaymentOption({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all flex-1 ${
        active
          ? "border-red-500 bg-red-50/50 text-red-500 shadow-inner"
          : "border-gray-50 bg-gray-50 text-gray-300 hover:border-gray-200"
      }`}
    >
      <div className={`mb-3 ${active ? "scale-110" : ""} transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-tighter text-center">
        {label}
      </span>
    </button>
  );
}
