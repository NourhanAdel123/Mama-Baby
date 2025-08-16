import { useState, useEffect } from 'react';
import { supabase } from '../integration/supabase/client';

export interface UserVaccination {
  id: string;
  vaccination_id: string;
  is_completed: boolean;
  completed_date?: string;
  created_at: string;
  updated_at: string;
}

export const useUserVaccinations = () => {
  const [vaccinations, setVaccinations] = useState<UserVaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVaccinations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_vaccinations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setVaccinations((data as UserVaccination[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleVaccination = async (vaccinationId: string, isCompleted: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const existing = vaccinations.find(v => v.vaccination_id === vaccinationId);

      if (existing) {
        const { data, error } = await supabase
          .from('user_vaccinations')
          .update({
            is_completed: isCompleted,
            completed_date: isCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        setVaccinations(prev => 
          prev.map(v => v.id === existing.id ? data as UserVaccination : v)
        );
      } else {
        const { data, error } = await supabase
          .from('user_vaccinations')
          .insert({
            user_id: user.id,
            vaccination_id: vaccinationId,
            is_completed: isCompleted,
            completed_date: isCompleted ? new Date().toISOString() : null
          })
          .select()
          .single();

        if (error) throw error;
        setVaccinations(prev => [...prev, data as UserVaccination]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const isVaccinationCompleted = (vaccinationId: string) => {
    const vaccination = vaccinations.find(v => v.vaccination_id === vaccinationId);
    return vaccination?.is_completed || false;
  };

  useEffect(() => {
    fetchVaccinations();
  }, []);

  return {
    vaccinations,
    loading,
    error,
    toggleVaccination,
    isVaccinationCompleted,
    refetch: fetchVaccinations
  };
};