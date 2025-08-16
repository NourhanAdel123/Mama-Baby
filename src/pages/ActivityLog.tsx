import { useState } from "react";
import { Plus, Baby, Clock, Droplets, Moon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useActivityLog } from "../hooks/useActivityLog";
const ActivityLog = () => {
  const {
    activities,
    loading,
    addActivity: addActivityToDb,
  } = useActivityLog();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

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

  const addActivity = async (activityType, duration, notes) => {
    try {
      await addActivityToDb(activityType, duration, notes);
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to add activity:", error);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "feeding":
        return <Baby className="h-5 w-5" />;
      case "sleep":
        return <Moon className="h-5 w-5" />;
      case "diaper":
        return <Droplets className="h-5 w-5" />;
      case "cry":
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getActivityLabel = (type) => {
    switch (type) {
      case "feeding":
        return "الرضاعة";
      case "sleep":
        return "النوم";
      case "diaper":
        return "تغيير الحفاض";
      case "cry":
        return "البكاء";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "feeding":
        return "bg-blue-500";
      case "sleep":
        return "bg-purple-500";
      case "diaper":
        return "bg-green-500";
      case "cry":
        return "bg-red-500";
    }
  };

  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActivities = activities.filter(
      (a) => new Date(a.start_time) >= today
    );

    return {
      feeding: todayActivities.filter((a) => a.activity_type === "feeding")
        .length,
      sleep: todayActivities
        .filter((a) => a.activity_type === "sleep")
        .reduce((total, a) => total + (a.duration || 0), 0),
      diaper: todayActivities.filter((a) => a.activity_type === "diaper")
        .length,
      cry: todayActivities.filter((a) => a.activity_type === "cry").length,
    };
  };

  const stats = getTodayStats();

  const QuickAddButton = ({ type, icon, label, color }) => (
    <div
      className="bg-white rounded-lg shadow-md p-4 text-center cursor-pointer hover:shadow-lg transition"
      onClick={() => {
        setModalType(type);
        setModalOpen(true);
      }}
    >
      <div
        className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-3`}
      >
        {icon}
      </div>
      <h4 className="font-semibold text-sm">{label}</h4>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-200 to-green-50 p-4 rtl"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center m-10">
          {/* Header */}
          <h1 className="h1">تسجيل نشاط الطفل</h1>
          <p className="text-gray-600 text-xl">
            {" "}
            تتبعي أنشطة طفلك اليومية لمراقبة نموه وصحته
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols- lg:grid-cols-4 gap-4 mb-8 ">
          <div className="card text-center">
            <Baby className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-semibold text-sm mb-1">الرضاعة</h4>
            <p className="text-blue-500 font-bold text-2xl">{stats.feeding}</p>
            <p className="text-xs text-gray-500">مرة اليوم</p>
          </div>
          <div className="card text-center">
            <Moon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-semibold text-sm mb-1">النوم</h4>
            <p className="text-purple-500 font-bold text-2xl">
              {Math.floor(stats.sleep / 60)}
            </p>
            <p className="text-xs text-gray-500">ساعة اليوم</p>
          </div>
          <div className="card text-center">
            <Droplets className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-semibold text-sm mb-1">الحفاضات</h4>
            <p className="text-green-500 font-bold text-2xl">{stats.diaper}</p>
            <p className="text-xs text-gray-500">مرة اليوم</p>
          </div>
          <div className="card text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h4 className="font-semibold text-sm mb-1">البكاء</h4>
            <p className="text-red-500 font-bold text-2xl">{stats.cry}</p>
            <p className="text-xs text-gray-500">مرة اليوم</p>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAddButton
            type="feeding"
            icon={<Baby className="h-6 w-6" />}
            label="الرضاعة"
            color="bg-blue-500"
          />
          <QuickAddButton
            type="sleep"
            icon={<Moon className="h-6 w-6" />}
            label="النوم"
            color="bg-purple-500"
          />
          <QuickAddButton
            type="diaper"
            icon={<Droplets className="h-6 w-6" />}
            label="تغيير الحفاض"
            color="bg-green-500"
          />
          <QuickAddButton
            type="cry"
            icon={<AlertCircle className="h-6 w-6" />}
            label="البكاء"
            color="bg-red-500"
          />
        </div>

        {/* Activity Log */}
        <div>
          <h2 className="h2 flex items-center gap-2">
            <Clock className="h-6 w-6" />
            سجل الأنشطة
          </h2>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Baby className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لم يتم تسجيل أي أنشطة بعد</p>
              <p className="text-sm">ابدئي بتسجيل أنشطة طفلك اليومية</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className={`${getActivityColor(
                    activity.activity_type
                  )} w-10 h-10 rounded-full flex items-center justify-center text-white`}
                >
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1">
                  <div
                    className="flex
                items-center
                  gap-2 mb-1"
                  >
                    <h4 className="font-semibold">
                      {getActivityLabel(activity.activity_type)}
                    </h4>
                    {activity.duration && (
                      <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                        {activity.duration} دقيقة
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {format(new Date(activity.start_time), "HH:mm", {
                      locale: ar,
                    })}
                    {activity.end_time && (
                      <>
                        {" "}
                        -{" "}
                        {format(new Date(activity.end_time), "HH:mm", {
                          locale: ar,
                        })}
                      </>
                    )}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(activity.start_time), "dd/MM", {
                    locale: ar,
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Custom Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">
              إضافة {getActivityLabel(modalType)}
            </h3>
            {modalType === "feeding" && (
              <div className="grid grid-cols-2 gap-4">
                {[15, 20, 25, 30].map((min) => (
                  <button
                    key={min}
                    className="border rounded p-2 hover:bg-gray-100"
                    onClick={() => addActivity(modalType, min)}
                  >
                    {min} دقيقة
                  </button>
                ))}
              </div>
            )}
            {modalType === "sleep" && (
              <div className="grid grid-cols-2 gap-4">
                {[30, 60, 120, 180].map((min) => (
                  <button
                    key={min}
                    className="border rounded p-2 hover:bg-gray-100"
                    onClick={() => addActivity(modalType, min)}
                  >
                    {min < 60 ? `${min} دقيقة` : `${min / 60} ساعة`}
                  </button>
                ))}
              </div>
            )}
            {(modalType === "diaper" || modalType === "cry") && (
              <button
                className="bg-primary text-white w-full py-2 rounded mt-2"
                onClick={() => addActivity(modalType)}
              >
                تسجيل {getActivityLabel(modalType)}
              </button>
            )}
            <button
              className="text-red-500 mt-4 w-full"
              onClick={() => setModalOpen(false)}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
