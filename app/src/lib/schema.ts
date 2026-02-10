import { z } from 'zod';

/**
 * テイスティングデータの詳細構造 (Payload)
 * フロントエンドの入力バリデーションとバックエンドの型定義を兼ねる
 */
export const TastingContentSchema = z.object({
  brand_name: z.string().min(1, '銘柄名は必須です'),
  brewery: z.string().optional().nullable(),
  // 舌マップの座標データ
  tongue_map: z.array(z.object({
    x: z.number(),
    y: z.number(),
  })),
  // 時系列の強弱データ
  time_intensity: z.array(z.object({
    x: z.number(),
    y: z.number(),
  })),
  memo: z.string().optional(),
});

/**
 * イベント自体の構造
 */
export const TastingEventSchema = z.object({
  aggregate_id: z.string().uuid(),
  event_type: z.enum(['RECORDED', 'UPDATED', 'DELETED']),
  payload: TastingContentSchema.nullable(), // DELETED時はnull
  version: z.number().int().positive(),
  created_at: z.string().datetime().optional(),
});

// TypeScript用の型抽出
export type TastingContent = z.infer<typeof TastingContentSchema>;
export type TastingEvent = z.infer<typeof TastingEventSchema>;