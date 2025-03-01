import { SupabaseClient } from "@supabase/supabase-js";
import { UseSessionReturn } from '@clerk/types'
import { Database } from "@/types/database.types";
import createClerkSupabaseClient from "@/lib/supabase";

class ApiKeysService {
  private supabaseClient: SupabaseClient;

  constructor(private session: UseSessionReturn['session']) {
    this.supabaseClient = createClerkSupabaseClient(session);

    this.getApiKeys = this.getApiKeys.bind(this);
    this.createApiKey = this.createApiKey.bind(this);
    this.updateApiKey = this.updateApiKey.bind(this);
    this.deleteApiKey = this.deleteApiKey.bind(this);
  }

  async getApiKeys(): Promise<Database['public']['Tables']['api_keys']['Row'][]> {
    const { data, error } = await this.supabaseClient.from('api_keys').select('*');
    if (error) throw error;
    return data
  }

  async createApiKey({ apiKey, secretKey, exchange }: {
    apiKey: string,
    secretKey: string,
    exchange: string
  }): Promise<Database['public']['Tables']['api_keys']['Row']> {
    const { data, error } = await this.supabaseClient.from('api_keys').insert({
      exchange,
      api_key: apiKey,
      api_secret: secretKey,
    }).select().single();

    if (error) throw error;
    return data;
  }

  async updateApiKey({ id, apiKey, secretKey, exchange }: {
    id: string,
    apiKey: string,
    secretKey: string,
    exchange: string
  }): Promise<Database['public']['Tables']['api_keys']['Row']> {
    const { data, error } = await this.supabaseClient.from('api_keys')
      .update({
        api_key: apiKey,
        api_secret: secretKey,
        exchange
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteApiKey(id: string) {
    const { data, error } = await this.supabaseClient.from('api_keys')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export default ApiKeysService;
