import { ShieldCheck, Lock, Eye, FileText, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "January 2026";

  const sections = [
    {
      icon: <Eye size={24} className="text-blue-600" />,
      title: "Information We Collect",
      content:
        "Ame tame jyare form bharo chho tyre tamaru Naam, Email, ane Subject collection kariye chiye. Aa data amara database ma secure store thai che.",
    },
    {
      icon: <Lock size={24} className="text-blue-600" />,
      title: "How We Protect Your Data",
      content:
        "Tamara data ne secure rakhva mate ame SSL encryption ane modern database protection techniques vapriye chiye. Ame tamari permission vagar data share nathi karta.",
    },
    {
      icon: <Globe size={24} className="text-blue-600" />,
      title: "Cookies",
      content:
        "Amari website better user experience mate cookies no upyog kare che. Tame tamara browser setting mathi cookies disable kari sako chho.",
    },
    {
      icon: <FileText size={24} className="text-blue-600" />,
      title: "Third-Party Links",
      content:
        "Kyarek amari site par biji websites ni links hoi sake che. E website ni privacy policy alag hoi sake che, tethi amari koi jabadari nathi.",
    },
  ];

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-10 mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <ShieldCheck size={48} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-500 font-medium">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            Amari website use karva badal tamaro abhar. Ame tamari privacy ne
            bau j gambhirtathi laiye chiye. Aa policy ma ame samjaviyu che ke
            tame amne je data apo chho teno ame kai rite upyog kariye chiye.
          </p>
        </section>

        {/* Privacy Sections Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((item, index) => (
            <div
              key={index}
              className="p-6 border border-gray-100 rounded-2xl bg-gray-50 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Rights Section */}
        <div className="mt-12 p-8 bg-blue-900 text-white rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
          <ul className="list-disc list-inside space-y-2 opacity-90">
            <li>Tame tamara data delete karva mate request kari sako chho.</li>
            <li>Tamari personal info update karvano tamne hakk che.</li>
            <li>Marketing emails ne unsubscribe kari sakay che.</li>
          </ul>
        </div>

        {/* Contact info footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 italic">
            Jo tamne privacy babate koi pan prashna hoy to amne contact page par
            jaine message karo.
          </p>
        </div>
      </div>
    </div>
  );
}
