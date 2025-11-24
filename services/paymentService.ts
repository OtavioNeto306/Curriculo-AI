import { supabase } from './supabase';

export const createPayment = async (email: string, firstName: string, lastName: string) => {
    const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { email, firstName, lastName }
    });

    if (error) throw error;
    return data;
};
