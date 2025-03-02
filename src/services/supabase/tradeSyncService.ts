import { SupabaseClient } from "@supabase/supabase-js";
import { UseSessionReturn } from '@clerk/types';
import { Database } from "@/types/database.types";
import createClerkSupabaseClient from "@/lib/supabase";
import ApiKeysService from "./apiKeys";
import UserTradesService, { Trade, TradeInput } from "./userTrades";
import { ExchangeClient, createExchangeClient } from "@/lib/exchanges/exchangeClient";

export interface SyncOptions {
  apiKeyId: string;
  startDate?: Date;
  endDate?: Date;
  symbols?: string[];
}

export interface SyncResult {
  syncId: string;
  tradesImported: number;
  status: 'completed' | 'failed';
  errorMessage?: string;
}

class TradeSyncService {
  private supabaseClient: SupabaseClient;
  private apiKeysService: ApiKeysService;
  private userTradesService: UserTradesService;

  constructor(private session: UseSessionReturn['session']) {
    this.supabaseClient = createClerkSupabaseClient(session);
    this.apiKeysService = new ApiKeysService(session);
    this.userTradesService = new UserTradesService(session);

    // Bind methods
    this.syncTradesFromExchange = this.syncTradesFromExchange.bind(this);
    this.getSyncHistory = this.getSyncHistory.bind(this);
    this.getLatestSyncStatus = this.getLatestSyncStatus.bind(this);
  }

  async syncTradesFromExchange(options: SyncOptions): Promise<SyncResult> {
    try {
      // 1. Create a sync history record
      const { data: syncRecord, error: syncRecordError } = await this.supabaseClient
        .from('trade_sync_history')
        .insert({
          api_key_id: options.apiKeyId,
          exchange: '', // Will update this after getting API key details
          status: 'in_progress',
        })
        .select()
        .single();

      if (syncRecordError) throw syncRecordError;

      try {
        // 2. Get API key details
        const apiKey = await this.apiKeysService.getApiKeyById(options.apiKeyId);

        // 3. Update the exchange in sync record
        await this.supabaseClient
          .from('trade_sync_history')
          .update({ exchange: apiKey.exchange })
          .eq('id', syncRecord.id);

        // 4. Create exchange client
        const exchangeClient = createExchangeClient(
          apiKey.exchange,
          apiKey.api_key,
          apiKey.api_secret
        );

        // 5. Fetch trades from exchange
        const trades = await exchangeClient.fetchTrades({
          startTime: options.startDate?.getTime(),
          endTime: options.endDate?.getTime(),
          symbols: options.symbols,
        });

        // 6. Process and save trades
        let importedCount = 0;
        for (const trade of trades) {
          // Check if trade already exists by exchange_order_id
          const { data: existingTrades } = await this.supabaseClient
            .from('user_trades')
            .select('id')
            .eq('exchange_order_id', trade.orderId)
            .eq('exchange_id', apiKey.exchange);

          if (existingTrades && existingTrades.length > 0) {
            // Update existing trade
            await this.userTradesService.updateTrade(existingTrades[0].id, {
              ...this.mapExchangeTradeToTradeInput(trade, apiKey.exchange),
              is_synchronized: true,
              last_synced_at: new Date().toISOString(),
            });
          } else {
            // Create new trade
            await this.userTradesService.createTrade({
              ...this.mapExchangeTradeToTradeInput(trade, apiKey.exchange),
              exchange_id: apiKey.exchange,
              exchange_order_id: trade.orderId,
              is_synchronized: true,
              last_synced_at: new Date().toISOString(),
            });
          }
          importedCount++;
        }

        // 7. Update sync record as completed
        await this.supabaseClient
          .from('trade_sync_history')
          .update({
            status: 'completed',
            sync_end_time: new Date().toISOString(),
            trades_synced: importedCount,
          })
          .eq('id', syncRecord.id);

        return {
          syncId: syncRecord.id,
          tradesImported: importedCount,
          status: 'completed',
        };
      } catch (error) {
        // Handle error and update sync record
        console.error('Sync error:', error);
        await this.supabaseClient
          .from('trade_sync_history')
          .update({
            status: 'failed',
            sync_end_time: new Date().toISOString(),
            error_message: error instanceof Error ? error.message : String(error),
          })
          .eq('id', syncRecord.id);

        return {
          syncId: syncRecord.id,
          tradesImported: 0,
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : String(error),
        };
      }
    } catch (error) {
      console.error('Failed to start sync process:', error);
      throw error;
    }
  }

  async getSyncHistory(limit = 10): Promise<any[]> {
    const { data, error } = await this.supabaseClient
      .from('trade_sync_history')
      .select(`
        id,
        exchange,
        sync_start_time,
        sync_end_time,
        status,
        trades_synced,
        error_message,
        api_keys (
          id,
          exchange,
          label
        )
      `)
      .order('sync_start_time', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getLatestSyncStatus(): Promise<any | null> {
    const { data, error } = await this.supabaseClient
      .from('trade_sync_history')
      .select(`
        id,
        exchange,
        sync_start_time,
        sync_end_time,
        status,
        trades_synced,
        error_message
      `)
      .order('sync_start_time', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data || null;
  }

  private mapExchangeTradeToTradeInput(exchangeTrade: any, exchangeId: string): TradeInput {
    return {
      symbol: exchangeTrade.symbol,
      type: exchangeTrade.side.toLowerCase(),
      amount: exchangeTrade.amount,
      entry_price: exchangeTrade.type === 'buy' ? exchangeTrade.price : exchangeTrade.price,
      exit_price: exchangeTrade.type === 'sell' ? exchangeTrade.price : exchangeTrade.price,
      pnl: exchangeTrade.realizedPnl || 0,
      date: new Date(exchangeTrade.timestamp).toISOString().split('T')[0],
      notes: `Imported from ${exchangeId} exchange`,
    };
  }
}

export default TradeSyncService; 