import { SupabaseClient } from "@supabase/supabase-js";
import { UseSessionReturn } from '@clerk/types';
import createClerkSupabaseClient from "@/lib/supabase";
import moment from "moment";

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
  private supabaseClient: SupabaseClient | null;

  constructor(private session: UseSessionReturn['session']) {
    this.session = session;
    this.supabaseClient = null;
    this.getTrades = this.getTrades.bind(this);
    this.createTrade = this.createTrade.bind(this);
    this.updateTrade = this.updateTrade.bind(this);
    this.deleteTrade = this.deleteTrade.bind(this);
    this.getTradeById = this.getTradeById.bind(this);
  }

  async getSupabaseClient(): Promise<SupabaseClient> {
    if (!this.supabaseClient) {
      const token = await this.session?.getToken({ template: 'supabase' });
      if (!token) {
        throw new Error('Failed to get authorize user');
      }
      this.supabaseClient = createClerkSupabaseClient(token);
    }
    return this.supabaseClient;
  }

  async getTrades({ startDate, endDate, limit = 10, offset = 0 }: { startDate?: string, endDate?: string, limit?: number, offset?: number }): Promise<Trade[]> {
    const supabaseClient = await this.getSupabaseClient();
    const query = supabaseClient
      .from('user_trades')
      .select('*')

    if (startDate) query.gte('date', moment(startDate).format('YYYY-MM-DD'));
    if (endDate) query.lte('date', moment(endDate).format('YYYY-MM-DD'));

    const { data, error } = await query
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  }

  async getTradeById(id: string): Promise<Trade> {
    const supabaseClient = await this.getSupabaseClient();
    const { data, error } = await supabaseClient
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

    const supabaseClient = await this.getSupabaseClient();
    const { data, error } = await supabaseClient
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

    const supabaseClient = await this.getSupabaseClient();
    const { data, error } = await supabaseClient
      .from('user_trades')
      .update(updatedTrade)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTrade(id: string): Promise<void> {
    const supabaseClient = await this.getSupabaseClient();
    const { error } = await supabaseClient
      .from('user_trades')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getTradesByDateRange({ startDate, endDate }: { startDate?: string, endDate?: string }): Promise<Trade[]> {
    try {
      const trades = await this.getTrades({ startDate, endDate });
      return trades;
    } catch (error) {
      throw error;
    }
  }

  async getTradesCount({ startDate, endDate }: { startDate?: string, endDate?: string }): Promise<number> {
    const supabaseClient = await this.getSupabaseClient();
    const query = supabaseClient
      .from('user_trades').
      select('*', { count: 'exact', head: true })

    if (startDate) query.gte('date', startDate);
    if (endDate) query.lte('date', endDate);

    const { count, error } = await query;
    if (error) throw error;
    return count ?? 0;
  }

  async getTradesWinningCount({ startDate, endDate }: { startDate?: string, endDate?: string }): Promise<number> {
    const supabaseClient = await this.getSupabaseClient();
    const { count, error } = await supabaseClient
      .from('user_trades')
      .select('*', { count: 'exact', head: true })
      .gte('pnl', '0')
      .gte('date', startDate)
      .lte('date', endDate);
    if (error) throw error;
    return count ?? 0;
  }

  async getTradesLosingCount({ startDate, endDate }: { startDate?: string, endDate?: string }): Promise<number> {
    const supabaseClient = await this.getSupabaseClient();
    const { count, error } = await supabaseClient
      .from('user_trades')
      .select('*', { count: 'exact', head: true })
      .lte('pnl', '0')
      .gte('date', startDate)
      .lte('date', endDate);
    if (error) throw error;
    return count ?? 0;
  }

  async getTradesPnl({ startDate, endDate }: { startDate?: string, endDate?: string }): Promise<number> {
    const trades = await this.getTradesByDateRange({ startDate, endDate });
    let pnl = 0
    trades.forEach(trade => {
      pnl += trade.pnl;
    });
    return pnl;
  }

  async getDailyPerformance({ startDate, endDate }: { startDate?: Date, endDate?: Date }): Promise<{ date: string, pnl: number }[]> {
    if (!endDate) endDate = new Date();
    if (!startDate) startDate = moment(endDate).subtract(7, 'days').toDate();

    const supabaseClient = await this.getSupabaseClient();
    const { data, error } = await supabaseClient
      .from('user_trades')
      .select('date, pnl')
      .gte('date', moment(startDate).format('YYYY-MM-DD'))
      .lte('date', moment(endDate).format('YYYY-MM-DD'))
      .order('date', { ascending: false });

    if (error) throw error;

    const performanceData: { date: string, pnl: number }[] = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const pnl = data?.find(trade => trade.date === moment(currentDate).format('YYYY-MM-DD'))?.pnl ?? 0;
      performanceData.push({
        pnl,
        date: moment(currentDate).format('YYYY-MM-DD'),
      });
      currentDate = moment(currentDate).add(1, 'day').toDate();
    }

    return performanceData;
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