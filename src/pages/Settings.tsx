import React, { useState, useEffect } from "react";
import { useUserProfile } from "../hooks/useUserProfile";

export default function Settings() {
  const [motherName, setMotherName] = useState("");
  const [currentWeek, setCurrentWeek] = useState(20);
  const [babyBirthDate, setBabyBirthDate] = useState("");
  const [motherNotes, setMotherNotes] = useState("");

  const { updateProfile } = useUserProfile();

  useEffect(() => {
    const savedNotes = localStorage.getItem("motherNotes");
    if (savedNotes) {
      setMotherNotes(savedNotes);
    }
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile({
        mother_name: motherName,
        current_week: currentWeek,
        baby_birth_date: babyBirthDate || undefined,
      });

      localStorage.setItem("motherNotes", motherNotes);

      alert("تم حفظ التغييرات بنجاح");
    } catch (error) {
      console.error("حدث خطأ أثناء الحفظ:", error);
      alert("حدث خطأ أثناء حفظ الإعدادات");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-pink-200 to-green-50 p-4 rtl"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mt-10">
          <h1 className="text-4xl text-primary"> الإعدادات</h1>
          <p className="text-gray-600 text-lg">تخصيص التطبيق حسب احتياجاتك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card for Personal Info */}
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
                  onChange={(e) =>
                    setCurrentWeek(parseInt(e.target.value) || 20)
                  }
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

          {/* Card for Mother's Notes */}
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
            ></textarea>
          </div>
        </div>

        {/* Save Changes Button */}
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
