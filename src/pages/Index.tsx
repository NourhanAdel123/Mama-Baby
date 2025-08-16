import {
  Heart,
  Baby,
  Apple,
  Shield,
  Calendar,
  MessageCircle,
  Settings,
  Clock,
  TrendingUp,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, loading, error } = useUserProfile();
  const [greeting, setGreeting] = useState("");

  const handeSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const motherName = profile?.mother_name || "الأم العزيزة";
  const currentWeek = profile?.current_week || 20;

  const menuItems = [
    {
      title: "متابعة الحمل",
      description: "تطور الجنين أسبوع بأسبوع",
      icon: Heart,
      link: "/pregnancy-weeks",
      color: "bg-pink-500",
      gradient: "from-pink-400 to-rose-500",
    },
    {
      title: "تطور الطفل",
      description: "نمو الطفل بعد الولادة",
      icon: Baby,
      link: "/baby-development",
      color: "bg-blue-500",
      gradient: "from-blue-400 to-indigo-500",
    },
    {
      title: "نصائح صحية",
      description: "تغذية وصحة الأم والطفل",
      icon: Apple,
      link: "/health-tips",
      color: "bg-green-500",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      title: "جدول التطعيمات",
      description: "مواعيد تطعيمات الطفل",
      icon: Shield,
      link: "/vaccination-schedule",
      color: "bg-purple-500",
      gradient: "from-purple-400 to-violet-500",
    },
    {
      title: "تسجيل النشاط",
      description: "رضاعة، نوم، وأنشطة أخرى",
      icon: Calendar,
      link: "/activity-log",
      color: "bg-orange-500",
      gradient: "from-orange-400 to-amber-500",
    },
    {
      title: "الأسئلة الشائعة الطبية",
      description: "أسئلة وإجابات سريعة",
      icon: MessageCircle,
      link: "/consultation",
      color: "bg-teal-500",
      gradient: "from-teal-400 to-cyan-500",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-50 pb-6rtl "
      dir="rtl"
    >
      <div className=" bg-[#F16F9D] text-white p-6 " dir="rtl">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-fade-in text-white">
                مساء الخير{greeting}, {motherName} 🤱
              </h1>
              <p className="text-white/90 animate-fade-in">
                كيف حالك اليوم؟ نحن هنا لمساعدتك في رحلة الأمومة
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/settings"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-md flex justify-center items-center"
              >
                <Settings className="w-5 h-5 " />
              </Link>
              <button
                onClick={handeSignOut}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-md flex justify-center items-center"
              >
                <LogOut />
              </button>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between bm-3">
              <h3 className="font-semibold">أسبوع الحمل الحالي</h3>
              <p className="px-3 py-2 bg-white/30 rounded-3xl">
                الأسبوع {currentWeek}
              </p>
            </div>

            <div className=" bg-primary  rounded-full h-3 overflow-hidden m-2">
              <div
                className=" bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentWeek / 40) * 100}%` }}
              ></div>
            </div>

            <p className="text-sm text-white/80">
              {Math.round((currentWeek / 40) * 100)}% من رحلة الحمل
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto py-6 px-4 ">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          <div className="text-center shadow-sm hover:shadow-md translate-all duration-300 bg-white rounded-lg py-4">
            <TrendingUp className="w-6 h-6 mx-auto text-primary mt-2" />
            <p className="font-semibold"> الأسبوع</p>
            <p className="text-xl font-bold text-primary">{currentWeek}</p>
          </div>
          <div className="text-center shadow-sm hover:shadow-md translate-all duration-300 bg-white rounded-lg py-4">
            <Clock className="w-6 h-6 mx-auto text-green-500 mt-2" />
            <p className="font-semibold">أيام متبقية</p>
            <p className="text-xl font-bold  text-green-500">
              {(40 - currentWeek) * 7}
            </p>
          </div>
          <div className="text-center shadow-sm hover:shadow-md translate-all duration-300 bg-white rounded-lg py-4">
            <Shield className="w-6 h-6 mx-auto text-blue-500 mt-2" />
            <p className="font-semibold"> تطعيمات</p>
            <p className="text-xl font-bold  text-blue-500 ">7</p>
          </div>
          <div className="text-center shadow-sm hover:shadow-md translate-all duration-300 bg-white rounded-lg py-4">
            <Bell className="w-6 h-6 mx-auto text-orange-500  mt-2" />
            <p className="font-semibold">تذكيرات</p>
            <p className="text-xl font-bold  text-orange-500 "> 3</p>
          </div>
        </div>
      </div>

      <div className=" max-w-4xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.link}>
            <div className=" shadow-sm hover:shadow-md translate-all duration-300 bg-white rounded-lg p-6">
              <div
                className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl text-primary font-semibold">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="p-4">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md  ">
          <div>
            <Heart className="w-6 h-6 text-pink-500 mb-2" />
            <h2 className="text-xl font-semibold mb-2">نصائح اليوم</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            اشربي الماء بكمية كافية يومياً (8-10 أكواب) للحفاظ على صحتك وصحة
            طفلك. الماء يساعد في نقل العناصر الغذائية للجنين ويقلل من أعراض
            الحمل المزعجة. 💧
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
{
  /*  */
}
