import React from "react";
import { useBabyDevelopment } from "../hooks/useSupabaseData";
import { useState } from "react";
import { Baby, Brain, Eye, Hand, Footprints, Heart, Clock } from "lucide-react";

const BabyDevelopment = () => {
  const { data: babyDevelopment, loading } = useBabyDevelopment();
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const getAbsoluteWeek = (month: number, week: number) => {
    return (month - 1) * 4 + week;
  };

  const getCurrentData = () => {
    const absoluteWeek = getAbsoluteWeek(selectedMonth, selectedWeek);
    let data = babyDevelopment.find(
      (item) => item.age_range === absoluteWeek.toString()
    );

    if (!data && selectedMonth <= 6) {
      const monthRangeMap: { [key: number]: string } = {
        1: "0-1",
        2: "1-2",
        3: "2-3",
        4: "3-4",
        5: "4-5",
        6: "5-6",
      };
      data = babyDevelopment.find(
        (item) => item.age_range === monthRangeMap[selectedMonth]
      );
    }
    return data || babyDevelopment[0];
  };

  const currentData = getCurrentData();

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
      <div className="...">
        <p>لا توجد بيانات متاحة</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-200 to-green-50 p-4 rtl"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center m-10">
          <h1 className="h1"> تطور الطفل بعد الولادة</h1>
          <p className="text-gray-600 text-xl">
            متابعة نمو ومهارات طفلك من الولادة حتى السنة الأولى
          </p>
        </div>
        {/* Month & Week Selector */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          {/* Month Selector */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-gray-600 text-md">الشهر</label>
            <select
              className="w-[180px] border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  الشهر {month}
                </option>
              ))}
            </select>
          </div>
          {/* Week Selector */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-gray-600 text-md">الأسبوع</label>
            <select
              className="w-[180px] border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 "
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4].map((week) => (
                <option key={week} value={week}>
                  الأسبوع {week}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-800">
              مراحل التطور
            </span>
            <span className="text-sm text-gray-500">
              {currentData.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-pink-500 h-3 rounded-full"
              style={{ width: `${currentData.progress}%` }}
            ></div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overview Card */}
          <div className="card text-center">
            <div className="text-6xl mb-4">{currentData.icon}</div>
            <h2 className="h2">{currentData.title}</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gradient-to-r from-white to-gray-100 p-4 rounded-lg">
                <Baby className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                <p className="text-sm font-semibold mb-1">الرضاعة</p>
                <p className="text-xs text-gray-500">{currentData.feeding}</p>
              </div>
              <div className="bg-gradient-to-r from-white to-gray-100 p-4 rounded-lg">
                <Clock className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                <p className="text-sm font-semibold mb-1">النوم</p>
                <p className="text-xs text-gray-500">{currentData.sleep}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-lg mt-4 text-right">
              <h4 className="font-semibold text-pink-700 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4" /> نصائح مهمة
              </h4>
              <p className="text-sm text-gray-500">{currentData.tips}</p>
            </div>
          </div>
          {/* Milestones Card */}
          <div className="card">
            <h2 className="h2 flex gap-2 items-center">
              <Brain className="h-6 w-6" /> المعالم التطويرية
            </h2>
            <div className="space-y-3">
              {currentData.milestones.map((milestone, index) => (
                <div className="flex gap-3 bg-gray-100 p-3 bg-gradient-to-r from-white to-gray-100 rounded-lg items-center">
                  <span className="text-xs">{index + 1}</span>
                  <p className="text-sm text-gray-800">{milestone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Development Areas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="card text-center">
            <Eye className="h-8 w-8 text-pink-500 mx-auto mb-2" />
            <h4 className="font-semibold text-sm">التطور البصري</h4>
          </div>
          <div className="card text-center">
            <Hand className="h-8 w-8 text-pink-500 mx-auto mb-2" />
            <h4 className="font-semibold text-sm">المهارات الحركية</h4>
          </div>
          <div className="card text-center">
            <Brain className="h-8 w-8 text-pink-500 mx-auto mb-2" />
            <h4 className="font-semibold text-sm">التطور المعرفي</h4>
          </div>
          <div className="card text-center">
            <Footprints className="h-8 w-8 text-pink-500 mx-auto mb-2" />
            <h4 className="font-semibold text-sm">التطور الحركي</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BabyDevelopment;
