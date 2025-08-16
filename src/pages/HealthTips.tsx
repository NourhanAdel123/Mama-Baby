import React, { useState } from "react";
import {
  Apple,
  Heart,
  Dumbbell,
  Moon,
  Coffee,
  Baby,
  Salad,
  Droplets,
} from "lucide-react";
import { useHealthTips } from "../hooks/useSupabaseData";

const HealthTips = () => {
  const { data: healthTips, loading } = useHealthTips();
  const [activeTab, setActiveTab] = useState("first");

  const currentData = healthTips.find((item) => item.phase === activeTab);

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

  const TabContent = ({ data }: { data: typeof currentData }) => {
    return (
      <div className="grid gap-6">
        {/* Nutrition Section */}
        <div className="card">
          <div className=" flex items-center gap-2 h2 font-bold mb-4" dir="rtl">
            <Apple className="h-6 w-6" />
            التغذية الصحية
          </div>
          <div className="space-y-3">
            {data?.nutrition.map((tip, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-100 to-white rounded-lg"
              >
                <span className="bg-gray-100 rounded-full px-2 py-1 text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-900">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Exercises & Tips Section */}
          <div className="card">
            <div className="flex items-center gap-2 h2 font-bold mb-4">
              <Dumbbell className="h-6 w-6" />
              التمارين المناسبة
            </div>
            <div className="space-y-3">
              {data?.exercise.map((exercise, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r 
                from-white to-green-50
               rounded-lg rtl"
                >
                  <Heart className="h-4 w-4 text-primary" />
                  <p className="text-sm text-gray-900">{exercise}</p>
                </div>
              ))}
            </div>
          </div>

          {/* General Tips */}
          <div className="card">
            <div className="flex items-center gap-2 h2 font-bold mb-4">
              <Moon className="h-6 w-6" />
              نصائح عامة
            </div>
            <div className="space-y-3">
              {data?.tips.map((exercise, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r 
                from-white to-pink-50
               rounded-lg rtl"
                >
                  <Baby className="h-4 w-4 text-primary" />
                  <p className="text-sm text-gray-900">{exercise}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-200 to-green- p-4 rtl"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center m-10">
          <h1 className="h1"> نصائح صحية وغذائية</h1>
          <p className="text-gray-600 text-xl">
            دليلك الشامل للصحة والتغذية أثناء الحمل وبعد الولادة
          </p>
        </div>
        {/*quick tips*/}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <Droplets className="h2 h-8 w-8 mx-auto" />
            <h4>شرب الماء</h4>
            <p>8-10 أكواب يومياً</p>
          </div>
          <div className="card text-center">
            <Salad className="h2 h-8 w-8 mx-auto" />
            <h4>الخضار والفواكه</h4>
            <p>5 حصص يومياً</p>
          </div>
          <div className="card text-center">
            <Coffee className="h2 h-8 w-8 mx-auto" />
            <h4>تقليل الكافيين</h4>
            <p> كوب واحد يومياً</p>
          </div>
          <div className="card text-center">
            <Moon className="h2 h-8 w-8 mx-auto" />
            <h4>النوم الكافي</h4>
            <p>7-9 ساعات يومياً</p>
          </div>
        </div>

        {/* Tabs without component */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8 bg-gray-100 p-1 rounded-lg ">
          {[
            { key: "first", label: "الثلث الأول" },
            { key: "second", label: "الثلث الثاني" },
            { key: "third", label: "الثلث الثالث" },
            { key: "postpartum", label: "بعد الولادة" },
          ].map((tab) => (
            <button
              className={`p-2 rounded-lg cursor-pointer ${
                activeTab === tab.key ? "active" : "inactive"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {<TabContent data={currentData} />}
      </div>
    </div>
  );
};

export default HealthTips;
