import React, { useState, useEffect } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { profile, loading, updateProfile } = useUserProfile();
  const navigate = useNavigate();

  // نحفظ القيم كـ String عشان ندعم التفريغ
  const [motherName, setMotherName] = useState("");
  const [currentWeek, setCurrentWeek] = useState(""); // كان number، خليناه نصي
  const [babyBirthDate, setBabyBirthDate] = useState("");
  const [motherNotes, setMotherNotes] = useState("");

  // املأ الحقول من البروفايل + الملاحظات من localStorage
  useEffect(() => {
    if (profile) {
      setMotherName(profile.mother_name || "");
      setCurrentWeek(
        profile.current_week != null ? String(profile.current_week) : ""
      );
      setBabyBirthDate(profile.baby_birth_date || "");
    }
  }, [profile]);

  useEffect(() => {
    const savedNotes = localStorage.getItem("motherNotes");
    if (savedNotes) setMotherNotes(savedNotes);
  }, []);

  const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));

  const handleSave = async () => {
    try {
      // حوّل الأسبوع لرقم مضبوط 1..42 إذا المستخدم كتب رقم
      const weekNum =
        currentWeek.trim() === ""
          ? undefined
          : clamp(parseInt(currentWeek, 10) || 0, 1, 42);

      // لو حقل فاضي، استخدم القيمة القديمة من الـ profile (عشان ما نمسحهاش)
      const payload: any = {
        mother_name:
          motherName.trim() !== ""
            ? motherName.trim()
            : profile?.mother_name ?? undefined,
        current_week:
          weekNum !== undefined ? weekNum : profile?.current_week ?? undefined,
        baby_birth_date:
          babyBirthDate !== ""
            ? babyBirthDate
            : profile?.baby_birth_date ?? undefined,
      };

      await updateProfile(payload);

      // خزّن الملاحظات محليًا
      localStorage.setItem("motherNotes", motherNotes);

      alert("تم حفظ التغييرات بنجاح");
    } catch (error) {
      console.error("حدث خطأ أثناء الحفظ:", error);
      alert("حدث خطأ أثناء حفظ الإعدادات");
    }
    navigate("/");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-pink-200 to-green-50 p-4 rtl flex items-center justify-center"
        dir="rtl"
      >
        <p>جاري تحميل الإعدادات...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-pink-200 to-green-50 p-4 rtl"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mt-10">
          <h1 className="text-4xl text-primary">الإعدادات</h1>
          <p className="text-gray-600 text-lg">تخصيص التطبيق حسب احتياجاتك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* المعلومات الشخصية */}
          <div className="card mt-8">
            <h2 className="h2">المعلومات الشخصية</h2>
            <div className="space-y-4">
              <div>
                <label className="label">اسم الأم</label>
                <input
                  type="text"
                  placeholder="أدخلي اسمك"
                  className="input"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                />
              </div>

              <div>
                <label className="label">أسبوع الحمل الحالي</label>
                <input
                  type="number"
                  min="1"
                  max="42"
                  className="input"
                  value={currentWeek}
                  onChange={(e) => {
                    // اسمحي بالتفريغ أثناء الكتابة
                    setCurrentWeek(e.target.value);
                  }}
                  onBlur={() => {
                    // عند الخروج من الحقل لو فيه قيمة، نضبطها 1..42
                    if (currentWeek.trim() !== "") {
                      const n = clamp(parseInt(currentWeek, 10) || 0, 1, 42);
                      setCurrentWeek(String(n));
                    }
                  }}
                />
              </div>

              <div>
                <label className="label">تاريخ الولادة</label>
                <input
                  type="date"
                  className="input"
                  value={babyBirthDate}
                  onChange={(e) => setBabyBirthDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ملاحظات الأم */}
          <div className="card mt-6">
            <h2 className="h2">ملاحظات الأم</h2>
            <p className="text-sm text-gray-500 mb-4">
              اكتبي أي ملاحظات أو تذكيرات تهمك خلال فترة الحمل أو بعد الولادة.
            </p>
            <textarea
              className="input min-h-[120px]"
              placeholder="اكتبي ملاحظاتك هنا..."
              value={motherNotes}
              onChange={(e) => setMotherNotes(e.target.value)}
            />
          </div>
        </div>

        {/* زر الحفظ */}
        <div className="text-center mt-8 items-center">
          <button className="btn" onClick={handleSave}>
            حفظ التغييرات
          </button>
        </div>

        <div className="card mt-8">
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
}
