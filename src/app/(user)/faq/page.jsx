"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, HelpCircle, Mail } from "lucide-react";

const faqData = [
  {
    id: 1,
    question: "Tamari service su che?",
    answer:
      "Ame amara customers ne best digital solutions ane products provide kariye chiye. Amari team 24/7 tamari madat mate hajar che.",
  },
  {
    id: 2,
    question: "Payment mate kaya options available che?",
    answer:
      "Tame UPI, Debit Card, Credit Card, ane Net Banking mathi payment kari sako cho. Badha payments 100% secure che.",
  },
  {
    id: 3,
    question: "Order cancel kai rite kari sakay?",
    answer:
      "Tame tamara dashboard ma jaine 'My Orders' section mathi order cancel kari sako cho. Refund 5-7 divas ma tamara account ma avi jase.",
  },
  {
    id: 4,
    question: "Su tamari pase koi physical store che?",
    answer:
      "Hali ma ame fakt online service provide kariye chiye, jethi ame tamne sasta bhav ma premium quality api sakiye.",
  },
  {
    id: 5,
    question: "Support mate tamne kai rite contact karvo?",
    answer:
      "Tame amara contact page par jaine form bhari sako cho athva direct support@example.com par email kari sako cho.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <span className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <HelpCircle size={32} />
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Tamara badha prashno na javab ahi mali jase. Jo biju kai puchvu hoy
            to contact karo.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </span>
                {openId === faq.id ? (
                  <ChevronUp className="text-blue-600" />
                ) : (
                  <ChevronDown className="text-gray-400" />
                )}
              </button>

              {/* Smooth Dropdown Animation */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openId === faq.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Contact Box */}
        <div className="mt-16 bg-blue-600 rounded-3xl p-8 text-center text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-2">
            What Confucius is still there?
          </h3>
          <p className="mb-6 opacity-90">
            Our team is always ready to help you.
          </p>
          <div className="flex justify-center items-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-gray-100 transition-all"
            >
              <Mail size={20} />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
