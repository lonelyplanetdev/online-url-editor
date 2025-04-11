import { z } from 'zod';

// Define the authentication response schema
export const AdsAuthResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val)),
});

export type AdsAuthResponse = z.infer<typeof AdsAuthResponseSchema>;

// Define the ad click report item schema
export const AdClickReportItemSchema = z.object({
  server_datetime: z.string(),
  subid_1: z.string().nullable(),
  visits: z.number(),
  clicks: z.number(),
  estimated_revenue: z.string().transform((val) => parseFloat(val)),
});

export type AdClickReportItem = z.infer<typeof AdClickReportItemSchema>;

// Define the report response schema
export const AdClickResponseSchema = z.object({
  current_page: z.number(),
  data: z.array(AdClickReportItemSchema),
  first_page_url: z.string(),
  last_page: z.number(),
  last_page_url: z.string(),
  links: z.array(
    z.object({
      url: z.string().nullable(),
      label: z.string(),
      active: z.boolean(),
    }),
  ),
  next_page_url: z.string().nullable(),
  path: z.string(),
  per_page: z.number(),
  prev_page_url: z.string().nullable(),
  total: z.number(),
  aggregates: z.object({
    totals: z.object({
      visits: z.number(),
      clicks: z.number(),
      estimated_revenue: z.number(),
    }),
    subtotals: z.object({
      visits: z.number(),
      clicks: z.number(),
      estimated_revenue: z.number(),
    }),
  }),
});

export type AdClickResponse = z.infer<typeof AdClickResponseSchema>;

export interface AdsClientConfig {
  username: string;
  password: string;
  secretKey: string;
  baseUrl?: string;
}

export class AdsClient {
  private readonly username: string;
  private readonly password: string;
  private readonly secretKey: string;
  private readonly baseUrl: string;

  private accessToken: string | null = null;
  private tokenExpiresAt: Date | null = null;

  constructor(config: AdsClientConfig) {
    this.username = config.username;
    this.password = config.password;
    this.secretKey = config.secretKey;
    this.baseUrl = config.baseUrl ?? 'https://api.ads.com';
  }

  /**
   * Check if the current token is valid
   * @returns Boolean indicating if the token is valid
   */
  public isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiresAt) {
      return false;
    }

    // Add a buffer of 60 seconds to ensure we don't use tokens that are about to expire
    const bufferMs = 60 * 1000;
    return new Date(this.tokenExpiresAt.getTime() - bufferMs) > new Date();
  }

  /**
   * Authenticate with the Ads.com API
   * @throws Error if authentication fails
   */
  public async authenticate(): Promise<void> {
    if (this.isTokenValid()) {
      return;
    }

    try {
      const response = await fetch(`${this.baseUrl}/ads/auth/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          secret_key: this.secretKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const authData = AdsAuthResponseSchema.parse(data);

      this.accessToken = authData.access_token;

      // Calculate token expiration time
      const expiresInMs = authData.expires_in * 1000;
      this.tokenExpiresAt = new Date(Date.now() + expiresInMs);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid authentication response: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get the current access token, authenticating if necessary
   * @returns The current access token
   * @throws Error if authentication fails
   */
  public async getAccessToken(): Promise<string> {
    if (!this.isTokenValid()) {
      await this.authenticate();
    }

    if (!this.accessToken) {
      throw new Error('Failed to get access token');
    }

    return this.accessToken;
  }

  /**
   * Get ad clicks data for a specific date range
   * @param utcDatetimeRange Array of exactly 2 date strings in format 'YYYY-MM-DD'
   * @returns Array of unique ad click report items
   * @throws Error if request fails or response is invalid
   */
  public async getAdClicks(utcDatetimeRange: [string, string]): Promise<AdClickReportItem[]> {
    if (!Array.isArray(utcDatetimeRange) || utcDatetimeRange.length !== 2) {
      throw new Error('dateRange must be an array with exactly 2 strings');
    }

    const [startDate, endDate] = utcDatetimeRange;

    // Validate date and time format
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!dateTimeRegex.test(startDate) || !dateTimeRegex.test(endDate)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD HH:MM:SS');
    }

    const token = await this.getAccessToken();

    let currentPage = 1;
    let lastPage = 1;
    const allItems: AdClickReportItem[] = [];

    do {
      const requestBody = {
        columns: ['server_datetime', 'subid_1', 'visits', 'clicks', 'estimated_revenue'],
        filter_by: [
          {
            column: 'server_datetime',
            operator: 'between',
            value: [startDate, endDate],
          },
        ],
        group_by: ['server_datetime', 'subid_1'],
        order_by: [
          {
            column: 'estimated_revenue',
            order: 'desc',
          },
        ],
        page: currentPage,
        per_page: 1000,
      };

      try {
        const response = await fetch(`${this.baseUrl}/ads/reports/parking-events`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ad clicks: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        const validatedData = AdClickResponseSchema.parse(data);

        allItems.push(...validatedData.data);

        lastPage = validatedData.last_page;
        currentPage++;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Invalid response format: ${error.message}`);
        }
        throw error;
      }
    } while (currentPage <= lastPage);

    // Deduplicate items using a Set with a unique identifier
    const uniqueItems = Array.from(
      new Map(
        allItems.map((item) => [
          `${item.server_datetime}-${item.subid_1}-${item.clicks}-${item.estimated_revenue}`,
          item,
        ]),
      ).values(),
    );

    return uniqueItems;
  }
}
