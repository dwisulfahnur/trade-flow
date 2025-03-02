
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { UseSessionReturn } from '@clerk/types'

// Cache for the Supabase client and the last used token
let cachedSupabaseClient: SupabaseClient | null = null;
let lastToken: string | null | undefined = undefined;


function createClerkSupabaseClient(clerkToken: string) {
  if (lastToken === clerkToken && !!cachedSupabaseClient) {
    return cachedSupabaseClient;
  }

  lastToken = clerkToken;
  const newClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          // Insert the Clerk Supabase token into the headers
          const headers = new Headers(options?.headers)
          headers.set('Authorization', `Bearer ${clerkToken}`)

          // Call the default fetch
          return fetch(url, {
            ...options,
            headers,
          })
        },
      },
    },
  );

  cachedSupabaseClient = newClient;
  return newClient;
}

export default createClerkSupabaseClient