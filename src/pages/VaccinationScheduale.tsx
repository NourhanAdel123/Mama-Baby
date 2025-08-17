import React, { useState, useEffect } from "react";
import {
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Baby,
} from "lucide-react";
import { useVaccinationSchedule } from "../hooks/useSupabaseData";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUserVaccinations } from "../hooks/useUserVaccinations";

const VaccinationScheduale = () => {
  const { data: vaccinationSchedule, loading } = useVaccinationSchedule();
  const { profile, updateProfile } = useUserProfile();
  const {
    isVaccinationCompleted,
    toggleVaccination,
    loading: vaccinesLoading,
  } = useUserVaccinations();

  const [babyBirthDate, setBabyBirthDate] = useState<Date | null>(null);

  useEffect(() => {
    if (profile?.baby_birth_date) {
      setBabyBirthDate(new Date(profile.baby_birth_date));
    }
  }, [profile]);

  if (loading || vaccinesLoading) {
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

  const handleDateChange = async (date: string) => {
    const newDate = new Date(date);
    setBabyBirthDate(newDate);
    try {
      await updateProfile({ baby_birth_date: date });
    } catch (error) {
      console.error("Error updating birth date:", error);
    }
  };

  const handleVaccineToggle = async (vaccineId: string) => {
    try {
      const isCurrentlyCompleted = isVaccinationCompleted(vaccineId);
      await toggleVaccination(vaccineId, !isCurrentlyCompleted);
    } catch (error) {
      console.error("Error toggling vaccination:", error);
    }
  };

  const getUpcomingVaccines = () => {
    if (!babyBirthDate) return 0;
    const today = new Date();
    const birthTime = babyBirthDate.getTime();
    const currentAge = Math.floor(
      (today.getTime() - birthTime) / (1000 * 60 * 60 * 24)
    );
    return vaccinationSchedule
      .filter(
        (schedule) =>
          schedule.age_in_days >= currentAge &&
          schedule.age_in_days <= currentAge + 30
      )
      .reduce((count, schedule) => count + schedule.vaccines.length, 0);
  };

  const getDueVaccines = () => {
    if (!babyBirthDate) return 0;
    const today = new Date();
    const birthTime = babyBirthDate.getTime();
    const currentAge = Math.floor(
      (today.getTime() - birthTime) / (1000 * 60 * 60 * 24)
    );
    return vaccinationSchedule
      .filter((schedule) => schedule.age_in_days <= currentAge)
      .reduce((count, schedule) => count + schedule.vaccines.length, 0);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-200 to-green-50 p-4 rtl"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* عنوان الصفحة */}
        <div className="text-center m-10">
          <h1 className="h1"> جدول التطعيمات</h1>
          <p className="text-gray-600 text-xl">
            جدول شامل لجميع التطعيمات الأساسية للطفل في السنة الأولى
          </p>
        </div>

        {/* إدخال تاريخ الميلاد */}
        {!babyBirthDate && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="flex items-center gap-2 text-pink-600 font-semibold text-lg mb-4">
              <Baby className="h-6 w-6" /> تاريخ ميلاد الطفل
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="date"
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400"
                onChange={(e) => handleDateChange(e.target.value)}
                value={
                  babyBirthDate
                    ? new Date(babyBirthDate).toISOString().split("T")[0]
                    : ""
                }
              />
              <p className="text-sm text-gray-500">
                أدخلي تاريخ ميلاد طفلك لتتبع مواعيد التطعيمات
              </p>
            </div>
          </div>
        )}

        {/* الإحصائيات السريعة */}
        {babyBirthDate && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-1" />
              <h4 className="font font-semibold text-sm mb-1">مكتملة</h4>
              <p className="text-2xl font-bold text-green-500">
                {vaccinationSchedule.reduce(
                  (count, schedule) =>
                    count +
                    schedule.vaccines.filter((vaccine) =>
                      isVaccinationCompleted(`${schedule.id}-${vaccine.name}`)
                    ).length,
                  0
                )}
              </p>
            </div>
            <div className="card text-center">
              <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font font-semibold text-sm mb-1">مستحقة</h4>
              <p className="text-2xl font-bold text-orange-500">
                {getDueVaccines()}
              </p>
            </div>
            <div className="card text-center">
              <AlertCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font font-semibold text-sm mb-1">قادمة</h4>
              <p className="text-2xl font-bold text-blue-500">
                {getUpcomingVaccines()}
              </p>
            </div>
          </div>
        )}

        {/* جدول التطعيمات */}
        <div className="space-y-6">
          {vaccinationSchedule.map((schedule, scheduleIndex) => (
            <div key={scheduleIndex} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="h3 flex gap-2 items-center">
                  <Calendar className="h-6 w-6" /> {schedule.age}
                </h3>
                <span className="border border-gray-300 rounded-full px-2 py-1 text-sm">
                  {schedule.vaccines.length} تطعيم
                </span>
              </div>
              <div className="space-y-4">
                {schedule.vaccines.map((vaccine, vaccineIndex) => {
                  const vaccineId = `${schedule.id}-${vaccine.name}`;
                  const isCompleted = isVaccinationCompleted(vaccineId);
                  return (
                    <div
                      key={vaccineIndex}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 ${
                        isCompleted
                          ? "bg-green-50 border-green-200"
                          : vaccine.important
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => handleVaccineToggle(vaccineId)}
                        className="appearance-none w-6 h-6 border-2 border-gray-400 rounded 
                          checked:bg-green-500 checked:border-green-500 
                          flex items-center justify-center 
                          checked:before:content-['✓'] checked:before:text-white checked:before:text-sm cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{vaccine.name}</h4>
                          <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                            <Shield className="h-3 w-3" /> إجباري
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {vaccine.description}
                        </p>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ملاحظات مهمة */}
        <div className="mt-8 space-y-3 card">
          <h3 className="flex items-center gap-2 text-lg font-semibold h2">
            <AlertCircle className="h-6 w-6" /> ملاحظات مهمة
          </h3>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            <p>التطعيمات الإجبارية ضرورية لحماية طفلك من الأمراض الخطيرة</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <p>احرصي على المواعيد المحددة للحصول على أفضل حماية</p>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <p>استشيري الطبيب في حالة تأخر أي تطعيم أو ظهور أعراض جانبية</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationScheduale;
