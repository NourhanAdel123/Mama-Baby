import { useState, useEffect } from 'react';
import { supabase } from '../integration/supabase/client';

export interface Activity {
  id: string;
  activity_type: 'feeding' | 'sleep' | 'diaper' | 'cry';
  start_time: string;
  end_time?: string;
  duration?: number;
  notes?: string;
  created_at: string;
}

export const useActivityLog = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (error) throw error;
      setActivities((data as Activity[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (
    activityType: Activity['activity_type'], 
    duration?: number, 
    notes?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const now = new Date().toISOString();
      const endTime = duration ? new Date(Date.now() + duration * 60000).toISOString() : undefined;

      const { data, error } = await supabase
        .from('activity_log')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          start_time: now,
          end_time: endTime,
          duration,
          notes
        })
        .select()
        .single();

      if (error) throw error;
      
      setActivities(prev => [data as Activity, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activity_log')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setActivities(prev => prev.filter(activity => activity.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    addActivity,
    deleteActivity,
    refetch: fetchActivities
  };
};