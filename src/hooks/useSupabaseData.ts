import { useState,useEffect } from "react";
import {supabase} from "../integration/supabase/client";

export const useSupabaseData = <T>(tableName: string , orderBy?: string) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            let query = supabase.from<T>(tableName as any).select("*");

            if (orderBy) {
                query = query.order(orderBy);
            }

            const{ data: result, error } = await query;
            console.log(`[${tableName}] Supabase response:`, { result, error });
      console.log(`[${tableName}] Result type:`, typeof result);
      console.log(`[${tableName}] Is array:`, Array.isArray(result));
      console.log(`[${tableName}] Length:`, result?.length);

            if (error) {
                throw error;
            }
            setData(result || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tableName, orderBy]);

    return { data,
    loading,
    error,
    refetch: fetchData };
};

export const usePregnancyWeeks = () => 
  useSupabaseData<{
    id: string;
    week_number: number;
    size: string;
    weight: string;
    development: string;
    tips: string;
    icon: string;
  }>('pregnancy_weeks', 'week_number');

  export const useBabyDevelopment = () => 
  useSupabaseData<{
    id: string;
    age_range: string;
    title: string;
    milestones: string[];
    feeding: string;
    sleep: string;
    tips: string;
    icon: string;
    progress: number;
  }>('baby_development');

 export const useHealthTips = () => 
  useSupabaseData<{
    id: string;
    phase: string;
    title: string;
    nutrition: string[];
    exercise: string[];
    tips: string[];
  }>('health_tips');

  export const useVaccinationSchedule = () => 
  useSupabaseData<{
    id: string;
    age: string;
    age_in_days: number;
    vaccines: Array<{
      name: string;
      description: string;
      important: boolean;
    }>;
  }>('vaccination_schedule', 'age_in_days');

export const useFrequentQuestions = () => 
  useSupabaseData<{
    id: string;
    question: string;
    answer: string;
  }>('frequent_questions');
