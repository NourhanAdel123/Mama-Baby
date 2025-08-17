import { useState, useEffect } from 'react';
import { supabase } from '../integration/supabase/client'

interface UserProfile {
  id: string;
  user_id: string;
  mother_name: string;
  current_week: number;
  baby_birth_date?: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // ✅ بدل single()

      if (error) throw error;

      if (!data) {
        // لو مفيش profile موجود، نعمله جديد
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            mother_name: 'الأم العزيزة',
            current_week: 20
          })
          .select()
          .maybeSingle(); // ✅ بدل single()

        if (insertError) throw insertError;
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'user_id'>>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('المستخدم غير مسجل');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .maybeSingle(); // ✅ يمنع 406 إذا مفيش record

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};
