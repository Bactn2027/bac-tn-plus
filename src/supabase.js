import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dknteztahvmuxdrfltnz.supabase.co";
const supabasePublishableKey = "sb_publishable_JBzXS4IrAhJObKk6oVJuGw_O4xkc064";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
