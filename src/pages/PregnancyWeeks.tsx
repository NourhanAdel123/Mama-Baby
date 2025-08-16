import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Baby,
  Heart,
  Apple,
  Calendar,
} from "lucide-react";
import { usePregnancyWeeks } from "../hooks/useSupabaseData";

const PregnancyWeeks = () => {
  const { data: pregnancyData, loading } = usePregnancyWeeks();
  const [selectedWeek, setSelectedWeek] = useState(20);
  const weeks = pregnancyData
    .map((item) => item.week_number)
    .sort((a, b) => a - b);
  const currentData = pregnancyData.find(
    (item) => item.week_number === selectedWeek
  );

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-200 to-pink-300 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!currentData) {
    return (
      <div
        className="min-h-screen bg-gradient-soft p-4 rtl flex items-center justify-center"
        dir="rtl"
      >
        <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
      </div>
    );
  }

  const goToNext = () => {
    const currentIndex = weeks.indexOf(selectedWeek);
    if (currentIndex < weeks.length - 1) {
      setSelectedWeek(weeks[currentIndex + 1]);
    }
  };

  const goToprev = () => {
    const currentIndex = weeks.indexOf(selectedWeek);
    if (currentIndex > 0) {
      setSelectedWeek(weeks[currentIndex - 1]);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-pink-200 to-green-50 p-4 rtl"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center m-10">
          <h1 className="h1"> متابعة الحمل أسبوع بأسبوع</h1>
          <p className="text-gray-600 text-lg">
            رحلة نمو طفلك من الأسبوع الأول حتى الولادة
          </p>
        </div>

        {/* Week Selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {weeks.map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`px-4 py-2 rounded-lg border font-semibold transition ${
                selectedWeek === week
                  ? "bg-pink-500 text-white border-pink-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {week}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Visual Section */}
          <div className="card text-center">
            <div className="text-center text-6xl mb-4 animate-bounce-">
              {currentData.icon}
            </div>
            <h2 className="h2 text-center">الأسبوع {selectedWeek}</h2>
            <div className="bg-gray-100 text-gray-700 rounded-full inline-flex px-4 py-2 gap-2 mb-4">
              <Calendar />
              {selectedWeek} أسبوع من الحمل
            </div>
            {/* Info Boxes */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <Apple className="h-5 w-5 text-pink-600" />
                  <span>الحجم</span>
                </div>
                <p className="h3">{currentData.size}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-center gap-2 mb-2">
                  <Baby className="h-5 w-5 text-pink-600" />
                  <span>الوزن التقريبي</span>
                </div>
                <p className="h3">{currentData.weight}</p>
              </div>
            </div>
          </div>

          {/* Development Section */}
          <div className="card">
            <h3 className="h2 flex gap-2">
              <Heart />
              تطور الجنين
            </h3>

            <div className="bg-gradient-to-l from-green-100 to-pink-100 p-4 rounded-lg mb-6">
              <p className="text-gray-700">{currentData.development}</p>
            </div>

            <div className="bg-gradient-to-l from-green-100 to-gray-100 p-4 rounded-lg mb-6">
              <h4 className="flex gap-2 mb-2">
                <Heart className="h-5 w-5 text-sm" />
                <p className="font-semibold"> نصائح مهمة</p>
              </h4>
              <p className="text-gray-700">{currentData.tips}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className=" flex justify-between items-center">
          <button
            className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 hover:bg-gray-50"
            onClick={goToprev}
          >
            <ArrowRight />
            الأسبوع السابق
          </button>

          <div>
            <p className="text-sm">
              {weeks.indexOf(selectedWeek) + 1} من {weeks.length}
            </p>
          </div>

          <button
            className="flex items-center gap-2 bg-pink-400 rounded-lg text-white px-4 py-2 hover:bg-pink-500"
            onClick={goToNext}
          >
            الأسبوع التالي
            <ArrowLeft />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PregnancyWeeks;
