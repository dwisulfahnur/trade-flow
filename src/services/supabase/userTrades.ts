import { SupabaseClient } from "@supabase/supabase-js";
import { UseSessionReturn } from '@clerk/types';
import { Database } from "@/types/database.types";
import createClerkSupabaseClient from "@/lib/supabase";

export interface Trade {
  id?: string;
  user_id?: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount?: number;
  entry_price?: number;
  exit_price?: number;
  fee?: number;
  pnl: number;
  notes?: string;
  date: string;
  created_at?: string;
  exchange_id?: string;
  exchange_order_id?: string;
  is_synchronized?: boolean;
  last_synced_at?: string;
}

export type TradeInput = Omit<Trade, 'id' | 'user_id' | 'created_at'>;

class UserTradesService {
  private supabaseClient: SupabaseClient;

  constructor(private session: UseSessionReturn['session']) {
    this.supabaseClient = createClerkSupabaseClient(session);

    // Bind methods to preserve 'this' context
    this.getTrades = this.getTrades.bind(this);
    this.createTrade = this.createTrade.bind(this);
    this.updateTrade = this.updateTrade.bind(this);
    this.deleteTrade = this.deleteTrade.bind(this);
    this.getTradeById = this.getTradeById.bind(this);
  }

  async getTrades(): Promise<Trade[]> {
    const { data, error } = await this.supabaseClient
      .from('user_trades')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getTradeById(id: string): Promise<Trade> {
    const { data, error } = await this.supabaseClient
      .from('user_trades')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createTrade(trade: TradeInput): Promise<Trade> {
    // If detailed fields are provided, calculate PNL if not already set
    let pnl = trade.pnl;
    if (trade.amount && trade.entry_price && trade.exit_price && !pnl) {
      pnl = this.calculatePnl(trade);

      // Subtract fee if provided
      if (trade.fee) {
        pnl -= trade.fee;
      }
    }

    const { data, error } = await this.supabaseClient
      .from('user_trades')
      .insert({
        ...trade,
        pnl: pnl,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTrade(id: string, trade: Partial<TradeInput>): Promise<Trade> {
    // If entry or exit price is updated, recalculate PNL
    let updatedTrade = { ...trade };

    // Only recalculate PNL if we have all the necessary fields and PNL wasn't explicitly set
    if (!trade.pnl &&
      (trade.entry_price !== undefined || trade.exit_price !== undefined ||
        trade.amount !== undefined || trade.type !== undefined || trade.fee !== undefined)) {

      const currentTrade = await this.getTradeById(id);

      // Only proceed if we have all required fields either from the update or the current trade
      if ((trade.amount || currentTrade.amount) &&
        (trade.entry_price || currentTrade.entry_price) &&
        (trade.exit_price || currentTrade.exit_price)) {

        // Create a trade object with only the properties needed for PNL calculation
        const tradeForPnl = {
          type: trade.type || currentTrade.type,
          amount: trade.amount !== undefined ? trade.amount : currentTrade.amount,
          entry_price: trade.entry_price !== undefined ? trade.entry_price : currentTrade.entry_price,
          exit_price: trade.exit_price !== undefined ? trade.exit_price : currentTrade.exit_price,
        };

        let calculatedPnl = this.calculatePnl(tradeForPnl);

        // Subtract fee if provided
        const fee = trade.fee !== undefined ? trade.fee : currentTrade.fee;
        if (fee) {
          calculatedPnl -= fee;
        }

        updatedTrade.pnl = calculatedPnl;
      }
    }

    const { data, error } = await this.supabaseClient
      .from('user_trades')
      .update(updatedTrade)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTrade(id: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('user_trades')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Helper method to calculate PNL
  private calculatePnl(trade: Pick<Trade, 'type' | 'amount' | 'entry_price' | 'exit_price'>): number {
    // Handle nullable fields safely
    if (!trade.amount || !trade.entry_price || !trade.exit_price) {
      return 0;
    }

    if (trade.type === 'buy') {
      return (trade.exit_price - trade.entry_price) * trade.amount;
    } else {
      return (trade.entry_price - trade.exit_price) * trade.amount;
    }
  }
}

export default UserTradesService; 