import React, { useState, useEffect } from "react";
import { supabase } from "../integration/supabase/client";
import { Heart, Baby, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) navigate("/");
    };
    checkUser();
  }, [navigate]);

  // تسجيل الدخول / إنشاء حساب
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (isLoggedIn) {
        // --- تسجيل الدخول ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      } else {
        // --- إنشاء حساب ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        // إذا لم يتم إنشاء user جديد (البريد مسجل مسبقاً)
        if (!data.user) {
          setErrorMessage(
            "البريد الإلكتروني مسجل بالفعل أو يحتاج لتأكيد البريد"
          );
          setLoading(false);
          return;
        }

        // ✅ إظهار المودال مباشرة بعد إنشاء الحساب
        setShowModal(true);
      }
    } catch (error: any) {
      let message = "حدث خطأ غير متوقع";

      if (error.message.includes("Invalid login credentials")) {
        message = "بيانات الدخول غير صحيحة";
      } else if (
        error.message.includes("Password should be at least 6 characters")
      ) {
        message = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
      } else if (error.message.includes("Unable to validate email address")) {
        message = "عنوان البريد الإلكتروني غير صحيح";
      }

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // بعد ما يضغط "تم" في المودال
  const handleModalClose = () => {
    setShowModal(false);
    setIsLoggedIn(true);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-200 to-green-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-1">
              <Heart className="h-10 w-10 text-pink-500" />
              <Baby className="h-10 w-10 text-pink-400" />
              <Shield className="h-10 w-10 text-pink-500" />
            </div>
            <h1 className="text-4xl font-bold text-pink-500 mb-6">بيبي كير</h1>
            <p className="text-gray-600">رفيقك في رحلة الأمومة والطفولة</p>
          </div>

          {/* Card */}
          <div className="card">
            <div className="text-center mb-6">
              <div className="text-xl text-pink-600 font-semibold">
                {isLoggedIn ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  dir="rtl"
                >
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-400"
                  dir="rtl"
                  placeholder="أدخلي عنوان بريدك الإلكتروني"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  dir="rtl"
                >
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-400"
                  dir="rtl"
                  placeholder="أدخلي كلمة المرور"
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <p className="text-red-500 text-sm text-center">
                  {errorMessage}
                </p>
              )}

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                disabled={loading}
              >
                {loading
                  ? "جارٍ التحميل..."
                  : isLoggedIn
                  ? "دخول"
                  : "إنشاء حساب"}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                {isLoggedIn ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
              </p>
              <button
                type="button"
                className="text-pink-500 font-semibold hover:underline"
                onClick={() => setIsLoggedIn(!isLoggedIn)}
              >
                {isLoggedIn ? "إنشاء حساب جديد" : "تسجيل الدخول"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
            <h2 className="text-xl font-bold text-pink-600 mb-3">
              تم إنشاء الحساب بنجاح 🎉
            </h2>
            <p className="text-gray-700 mb-6">
              تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. من فضلك افتحي بريدك
              لتفعيل الحساب.
            </p>
            <button
              onClick={handleModalClose}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
            >
              تم
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Auth;
