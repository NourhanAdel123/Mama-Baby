import { useState } from "react";
import { useFrequentQuestions } from "../hooks/useSupabaseData";
import {
  MessageCircle,
  Phone,
  Heart,
  Baby,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Consultation = () => {
  const { data: frequentQuestions, loading: faqLoading } =
    useFrequentQuestions();
  const [openQuestions, setopenQuestions] = useState([]);

  const toggleQuestion = (id) => {
    setopenQuestions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const categories = [
    {
      title: "أسئلة الحمل",
      icon: Baby,
      color: "text-pink-500",
      questions: frequentQuestions.filter(
        (q) =>
          q.question.includes("الحمل") ||
          q.question.includes("الطفل") ||
          q.question.includes("الولادة") ||
          q.question.includes("حامل")
      ),
    },
    {
      title: "أسئلة الرضاعة والتغذية",
      icon: Heart,
      color: "text-green-500",
      questions: frequentQuestions.filter(
        (q) =>
          q.question.includes("الرضاعة") ||
          q.question.includes("الحليب") ||
          q.question.includes("الأكل") ||
          q.question.includes("التغذية")
      ),
    },
    {
      title: "أسئلة الصحة العامة",
      icon: Clock,
      color: "text-blue-500",
      questions: frequentQuestions.filter(
        (q) =>
          q.question.includes("النوم") ||
          q.question.includes("الحرارة") ||
          q.question.includes("البكاء") ||
          q.question.includes("الصحة")
      ),
    },
  ];

  if (faqLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 rtl flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-500">جاري تحميل الأسئلة...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-200 to-green-50 p-4 rtl"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center m-10">
          {/* Header */}
          <h1 className="h1">الأسئلة الشائعة الطبية</h1>
          <p className="text-gray-600 text-xl">
            {" "}
            إجابات موثوقة لأهم الأسئلة حول الحمل والأمومة والطفولة
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-6">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx} className="card ">
                {/* header */}
                <div className=" flex justify-between text-center mb-4">
                  <div
                    className={`flex items-center gap-3 ${category.color} mb-4`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="font-bold">{category.title}</span>
                  </div>
                  <span className="flex bg-gray-100 text-gray-600 text-xs px-2 rounded-full items-center">
                    {category.questions.length} سؤال
                  </span>
                </div>
                <div className="space-y-3">
                  {category.questions.map((faq) => {
                    const isOpen = openQuestions.includes(faq.id);
                    return (
                      <div key={faq.id} className="border rounded-lg">
                        <button
                          className="w-full flex justify-between items-center p-4 text-right hover:bg-green-50"
                          onClick={() => toggleQuestion(faq.id)}
                        >
                          <span className="text-sm font-medium flex-1">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 p-4 bg-gray-50 border rounded-lg">
                            <p className="text-sm leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8 flex gap-3">
          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-red-700 mb-2">
              تنبيه مهم للغاية
            </h4>
            <p className="text-sm text-red-600">
              هذه المعلومات للإرشاد العام فقط ولا تغني عن استشارة الطبيب المختص.
              في حالات الطوارئ، اتصلي بالطبيب أو اذهبي لأقرب مستشفى فوراً.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="card mt-8 ">
          <h3 className="text-center font-semibold">
            تطبيق متابعة الحمل والأطفال
          </h3>
          <p className="text-center text-gray-500">
            الإصدار 1.0.0 • تم التطوير بـ ❤️ لصحة الأم والطفل
          </p>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
