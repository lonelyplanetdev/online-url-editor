'use client';

import * as React from 'react';
import { Button } from '~/components/ui/button';
import { BuysideDataRow, SellsideDataRow } from '.';
import { StringFilter, NumberFilter } from './filtering';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Checkbox } from '~/components/ui/checkbox';
import { Badge } from '~/components/ui/badge';
import { ArrowUpDown, MoveDown, MoveUp, X } from 'lucide-react';

export default function Viewer({
  data,
  filters,
  dates,
}: {
  filters: (StringFilter | NumberFilter)[];
  data: {
    buyside: BuysideDataRow[];
    sellside: SellsideDataRow[];
  };
  dates: string[];
}) {
  const [level, setLevel] = React.useState<'campaign' | 'adset' | 'ad'>('campaign');
  const levelFilters = React.useMemo(() => filters.filter((f) => f.level === level), [filters, level]);

  const [selectedCampaignIds, setSelectedCampaignIds] = React.useState<Set<string>>(new Set());
  const [selectedAdsetIds, setSelectedAdsetIds] = React.useState<Set<string>>(new Set());
  const [selectedAdIds, setSelectedAdIds] = React.useState<Set<string>>(new Set());

  const currencyColumns = React.useMemo(() => ['spend', 'revenue', 'margin', 'rpac', 'cpac'], []);
  const percentageColumns = React.useMemo(() => ['roi'], []);

  const getFormattedValue = (column: string, value: number) => {
    if (currencyColumns.includes(column)) {
      return value.toFixed(2);
    } else if (percentageColumns.includes(column)) {
      return (value * 100).toFixed(2) + '%';
    } else {
      return value.toString();
    }
  };

  const filteredBuysideData = React.useMemo(
    () => data.buyside.filter((row) => dates.includes(row.date)),
    [data.buyside, dates],
  );

  const filteredSellsideData = React.useMemo(
    () => data.sellside.filter((row) => dates.includes(row.date)),
    [data.sellside, dates],
  );

  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | null>(null);

  const handleSort = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortColumn(null);
      setSortDirection(null);
    }
  };

  const campaignsData = React.useMemo(() => {
    const campaigns: Record<
      string,
      {
        name: string;
        id: string;
        spend: number;
        clicks: number;
        impressions: number;
        revenue: number;
        views: number;
        rpac: number;
        cpac: number;
        margin: number;
        roi: number;
        adset_ids: Set<string>;
        ad_ids: Set<string>;
      }
    > = {};

    filteredBuysideData.forEach((row) => {
      const campaign_id = row.campaign_id;
      if (!campaigns[campaign_id]) {
        campaigns[campaign_id] = {
          name: row.campaign_name,
          id: campaign_id,
          spend: 0,
          clicks: 0,
          impressions: 0,
          revenue: 0,
          views: 0,
          rpac: 0,
          cpac: 0,
          margin: 0,
          roi: 0,
          adset_ids: new Set(),
          ad_ids: new Set(),
        };
      }
      campaigns[campaign_id].spend += row.spend;
      campaigns[campaign_id].clicks += row.clicks;
      campaigns[campaign_id].impressions += row.impressions;
      campaigns[campaign_id].adset_ids.add(row.adset_id);
      campaigns[campaign_id].ad_ids.add(row.ad_id);
    });

    const revenuePerAdId: Record<string, number> = {};
    const viewsPerAdId: Record<string, number> = {};

    filteredSellsideData.forEach((row) => {
      const ad_id = row.ad_id;
      if (!revenuePerAdId[ad_id]) {
        revenuePerAdId[ad_id] = 0;
      }
      if (!viewsPerAdId[ad_id]) {
        viewsPerAdId[ad_id] = 0;
      }
      revenuePerAdId[ad_id] += row.revenue;
      viewsPerAdId[ad_id] += row.views;
    });

    Object.values(campaigns).forEach((campaign) => {
      let campaignRevenue = 0;
      let campaignViews = 0;
      campaign.ad_ids.forEach((ad_id) => {
        if (revenuePerAdId[ad_id]) {
          campaignRevenue += revenuePerAdId[ad_id];
        }
        if (viewsPerAdId[ad_id]) {
          campaignViews += viewsPerAdId[ad_id];
        }
      });
      campaign.revenue = campaignRevenue;
      campaign.views = campaignViews;
      campaign.margin = campaign.revenue - campaign.spend;
      campaign.roi = campaign.spend !== 0 ? campaign.margin / campaign.spend : 0;
      campaign.cpac = campaign.clicks !== 0 ? campaign.spend / campaign.clicks : 0;
      campaign.rpac = campaign.clicks !== 0 ? campaign.revenue / campaign.clicks : 0;
    });

    const campaignsArray = Object.values(campaigns);

    const filteredCampaigns = campaignsArray.filter((campaign) => {
      return levelFilters.every((filter) => {
        const column = filter.column;
        const operator = filter.operator;
        const value = filter.value;
        const campaignValue = campaign[column as keyof typeof campaign];

        if (typeof campaignValue === 'string' && typeof value === 'string') {
          switch (operator) {
            case 'equals':
              return campaignValue === value;
            case 'contains':
              return campaignValue.includes(value);
            case 'in_list':
              return value.split(',').includes(campaignValue);
            case 'not_equals':
              return campaignValue !== value;
            case 'not_contains':
              return !campaignValue.includes(value);
            case 'not_in_list':
              return !value.split(',').includes(campaignValue);
            default:
              return true;
          }
        } else if (typeof campaignValue === 'number' && typeof value === 'number') {
          switch (operator) {
            case 'equals':
              return campaignValue === value;
            case 'not_equals':
              return campaignValue !== value;
            case 'greater_than':
              return campaignValue > value;
            case 'less_than':
              return campaignValue < value;
            case 'greater_than_or_equals':
              return campaignValue >= value;
            case 'less_than_or_equals':
              return campaignValue <= value;
            default:
              return true;
          }
        } else {
          return true;
        }
      });
    });

    if (sortColumn && sortDirection) {
      filteredCampaigns.sort((a, b) => {
        const valueA = a[sortColumn as keyof typeof a];
        const valueB = b[sortColumn as keyof typeof b];

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        } else if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
          return 0;
        }
      });
    }

    return filteredCampaigns;
  }, [filteredBuysideData, filteredSellsideData, levelFilters, sortColumn, sortDirection]);

  const adsetData = React.useMemo(() => {
    // Create campaignIdToName mapping
    const campaignIdToName: Record<string, string> = {};
    filteredBuysideData.forEach((row) => {
      const campaign_id = row.campaign_id;
      if (!campaignIdToName[campaign_id]) {
        campaignIdToName[campaign_id] = row.campaign_name;
      }
    });

    // Get campaign name filters
    const campaignNameFilters = filters.filter(
      (f) => f.level === 'campaign' && f.column === 'name' && typeof f.value === 'string',
    ) as StringFilter[];

    // Get matchingCampaignIds based on campaign name filters
    const matchingCampaignIds = Object.entries(campaignIdToName)
      .filter(([campaign_id, campaign_name]) => {
        return campaignNameFilters.every((filter) => {
          const operator = filter.operator;
          const value = filter.value;
          switch (operator) {
            case 'equals':
              return campaign_name === value;
            case 'contains':
              return campaign_name.includes(value);
            case 'in_list':
              return value.split(',').includes(campaign_name);
            case 'not_equals':
              return campaign_name !== value;
            case 'not_contains':
              return !campaign_name.includes(value);
            case 'not_in_list':
              return !value.split(',').includes(campaign_name);
            default:
              return true;
          }
        });
      })
      .map(([campaign_id]) => campaign_id);

    const adsets: Record<
      string,
      {
        name: string;
        id: string;
        campaign_id: string;
        spend: number;
        clicks: number;
        impressions: number;
        revenue: number;
        views: number;
        rpac: number;
        cpac: number;
        margin: number;
        roi: number;
        ad_ids: Set<string>;
      }
    > = {};

    filteredBuysideData.forEach((row) => {
      // Check if row should be included based on matchingCampaignIds and selectedCampaignIds
      if (
        (matchingCampaignIds.length > 0 && !matchingCampaignIds.includes(row.campaign_id)) ||
        (selectedCampaignIds.size > 0 && !selectedCampaignIds.has(row.campaign_id))
      ) {
        return;
      }

      const adset_id = row.adset_id;
      if (!adsets[adset_id]) {
        adsets[adset_id] = {
          name: row.adset_name,
          id: adset_id,
          campaign_id: row.campaign_id,
          spend: 0,
          clicks: 0,
          impressions: 0,
          revenue: 0,
          views: 0,
          rpac: 0,
          cpac: 0,
          margin: 0,
          roi: 0,
          ad_ids: new Set(),
        };
      }
      adsets[adset_id].spend += row.spend;
      adsets[adset_id].clicks += row.clicks;
      adsets[adset_id].impressions += row.impressions;
      adsets[adset_id].ad_ids.add(row.ad_id);
    });

    const revenuePerAdId: Record<string, number> = {};
    const viewsPerAdId: Record<string, number> = {};

    filteredSellsideData.forEach((row) => {
      const ad_id = row.ad_id;
      if (!revenuePerAdId[ad_id]) {
        revenuePerAdId[ad_id] = 0;
      }
      if (!viewsPerAdId[ad_id]) {
        viewsPerAdId[ad_id] = 0;
      }
      revenuePerAdId[ad_id] += row.revenue;
      viewsPerAdId[ad_id] += row.views;
    });

    Object.values(adsets).forEach((adset) => {
      let adsetRevenue = 0;
      let adsetViews = 0;
      adset.ad_ids.forEach((ad_id) => {
        if (revenuePerAdId[ad_id]) {
          adsetRevenue += revenuePerAdId[ad_id];
        }
        if (viewsPerAdId[ad_id]) {
          adsetViews += viewsPerAdId[ad_id];
        }
      });
      adset.revenue = adsetRevenue;
      adset.views = adsetViews;
      adset.margin = adset.revenue - adset.spend;
      adset.roi = adset.spend !== 0 ? adset.margin / adset.spend : 0;
      adset.cpac = adset.clicks !== 0 ? adset.spend / adset.clicks : 0;
      adset.rpac = adset.clicks !== 0 ? adset.revenue / adset.clicks : 0;
    });

    const adsetsArray = Object.values(adsets);

    const filteredAdsets = adsetsArray.filter((adset) => {
      return levelFilters.every((filter) => {
        const column = filter.column;
        const operator = filter.operator;
        const value = filter.value;
        const adsetValue = adset[column as keyof typeof adset];

        if (typeof adsetValue === 'string' && typeof value === 'string') {
          switch (operator) {
            case 'equals':
              return adsetValue === value;
            case 'contains':
              return adsetValue.includes(value);
            case 'in_list':
              return value.split(',').includes(adsetValue);
            case 'not_equals':
              return adsetValue !== value;
            case 'not_contains':
              return !adsetValue.includes(value);
            case 'not_in_list':
              return !value.split(',').includes(adsetValue);
            default:
              return true;
          }
        } else if (typeof adsetValue === 'number' && typeof value === 'number') {
          switch (operator) {
            case 'equals':
              return adsetValue === value;
            case 'not_equals':
              return adsetValue !== value;
            case 'greater_than':
              return adsetValue > value;
            case 'less_than':
              return adsetValue < value;
            case 'greater_than_or_equals':
              return adsetValue >= value;
            case 'less_than_or_equals':
              return adsetValue <= value;
            default:
              return true;
          }
        } else {
          return true;
        }
      });
    });

    if (sortColumn && sortDirection) {
      filteredAdsets.sort((a, b) => {
        const valueA = a[sortColumn as keyof typeof a];
        const valueB = b[sortColumn as keyof typeof b];

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        } else if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
          return 0;
        }
      });
    }

    return filteredAdsets;
  }, [
    filteredBuysideData,
    filteredSellsideData,
    levelFilters,
    filters,
    selectedCampaignIds,
    sortColumn,
    sortDirection,
  ]);

  const adData = React.useMemo(() => {
    // Create adsetIdToName mapping
    const adsetIdToName: Record<string, string> = {};
    const adsetIdToCampaignId: Record<string, string> = {};
    filteredBuysideData.forEach((row) => {
      const adset_id = row.adset_id;
      if (!adsetIdToName[adset_id]) {
        adsetIdToName[adset_id] = row.adset_name;
        adsetIdToCampaignId[adset_id] = row.campaign_id;
      }
    });

    // Get adset name filters
    const adsetNameFilters = filters.filter(
      (f) => f.level === 'adset' && f.column === 'name' && typeof f.value === 'string',
    ) as StringFilter[];

    // Get matchingAdsetIds based on adset name filters
    const matchingAdsetIds = Object.entries(adsetIdToName)
      .filter(([adset_id, adset_name]) => {
        return adsetNameFilters.every((filter) => {
          const operator = filter.operator;
          const value = filter.value;
          switch (operator) {
            case 'equals':
              return adset_name === value;
            case 'contains':
              return adset_name.includes(value);
            case 'in_list':
              return value.split(',').includes(adset_name);
            case 'not_equals':
              return adset_name !== value;
            case 'not_contains':
              return !adset_name.includes(value);
            case 'not_in_list':
              return !value.split(',').includes(adset_name);
            default:
              return true;
          }
        });
      })
      .map(([adset_id]) => adset_id);

    // Get campaign name filters
    const campaignNameFilters = filters.filter(
      (f) => f.level === 'campaign' && f.column === 'name' && typeof f.value === 'string',
    ) as StringFilter[];

    // Create campaignIdToName mapping
    const campaignIdToName: Record<string, string> = {};
    filteredBuysideData.forEach((row) => {
      const campaign_id = row.campaign_id;
      if (!campaignIdToName[campaign_id]) {
        campaignIdToName[campaign_id] = row.campaign_name;
      }
    });

    // Get matchingCampaignIds based on campaign name filters
    const matchingCampaignIds = Object.entries(campaignIdToName)
      .filter(([campaign_id, campaign_name]) => {
        return campaignNameFilters.every((filter) => {
          const operator = filter.operator;
          const value = filter.value;
          switch (operator) {
            case 'equals':
              return campaign_name === value;
            case 'contains':
              return campaign_name.includes(value);
            case 'in_list':
              return value.split(',').includes(campaign_name);
            case 'not_equals':
              return campaign_name !== value;
            case 'not_contains':
              return !campaign_name.includes(value);
            case 'not_in_list':
              return !value.split(',').includes(campaign_name);
            default:
              return true;
          }
        });
      })
      .map(([campaign_id]) => campaign_id);

    const ads: Record<
      string,
      {
        name: string;
        id: string;
        adset_id: string;
        campaign_id: string;
        spend: number;
        clicks: number;
        impressions: number;
        revenue: number;
        views: number;
        rpac: number;
        cpac: number;
        margin: number;
        roi: number;
      }
    > = {};

    filteredBuysideData.forEach((row) => {
      const campaign_id = row.campaign_id;
      const adset_id = row.adset_id;

      // Check if row should be included based on matchingAdsetIds, selectedAdsetIds, matchingCampaignIds, and selectedCampaignIds
      if (
        (matchingCampaignIds.length > 0 && !matchingCampaignIds.includes(campaign_id)) ||
        (selectedCampaignIds.size > 0 && !selectedCampaignIds.has(campaign_id)) ||
        (matchingAdsetIds.length > 0 && !matchingAdsetIds.includes(adset_id)) ||
        (selectedAdsetIds.size > 0 && !selectedAdsetIds.has(adset_id))
      ) {
        return;
      }

      const ad_id = row.ad_id;
      if (!ads[ad_id]) {
        ads[ad_id] = {
          name: row.ad_name,
          id: ad_id,
          adset_id: adset_id,
          campaign_id: campaign_id,
          spend: 0,
          clicks: 0,
          impressions: 0,
          revenue: 0,
          views: 0,
          rpac: 0,
          cpac: 0,
          margin: 0,
          roi: 0,
        };
      }
      ads[ad_id].spend += row.spend;
      ads[ad_id].clicks += row.clicks;
      ads[ad_id].impressions += row.impressions;
    });

    const revenuePerAdId: Record<string, number> = {};
    const viewsPerAdId: Record<string, number> = {};

    filteredSellsideData.forEach((row) => {
      const ad_id = row.ad_id;
      if (!revenuePerAdId[ad_id]) {
        revenuePerAdId[ad_id] = 0;
      }
      if (!viewsPerAdId[ad_id]) {
        viewsPerAdId[ad_id] = 0;
      }
      revenuePerAdId[ad_id] += row.revenue;
      viewsPerAdId[ad_id] += row.views;
    });

    Object.values(ads).forEach((ad) => {
      const ad_id = ad.id;
      const adRevenue = revenuePerAdId[ad_id] || 0;
      const adViews = viewsPerAdId[ad_id] || 0;
      ad.revenue = adRevenue;
      ad.views = adViews;
      ad.margin = ad.revenue - ad.spend;
      ad.roi = ad.spend !== 0 ? ad.margin / ad.spend : 0;
      ad.cpac = ad.clicks !== 0 ? ad.spend / ad.clicks : 0;
      ad.rpac = ad.clicks !== 0 ? ad.revenue / ad.clicks : 0;
    });

    const adsArray = Object.values(ads);

    const filteredAds = adsArray.filter((ad) => {
      return levelFilters.every((filter) => {
        const column = filter.column;
        const operator = filter.operator;
        const value = filter.value;
        const adValue = ad[column as keyof typeof ad];

        if (typeof adValue === 'string' && typeof value === 'string') {
          switch (operator) {
            case 'equals':
              return adValue === value;
            case 'contains':
              return adValue.includes(value);
            case 'in_list':
              return value.split(',').includes(adValue);
            case 'not_equals':
              return adValue !== value;
            case 'not_contains':
              return !adValue.includes(value);
            case 'not_in_list':
              return !value.split(',').includes(adValue);
            default:
              return true;
          }
        } else if (typeof adValue === 'number' && typeof value === 'number') {
          switch (operator) {
            case 'equals':
              return adValue === value;
            case 'not_equals':
              return adValue !== value;
            case 'greater_than':
              return adValue > value;
            case 'less_than':
              return adValue < value;
            case 'greater_than_or_equals':
              return adValue >= value;
            case 'less_than_or_equals':
              return adValue <= value;
            default:
              return true;
          }
        } else {
          return true;
        }
      });
    });

    if (sortColumn && sortDirection) {
      filteredAds.sort((a, b) => {
        const valueA = a[sortColumn as keyof typeof a];
        const valueB = b[sortColumn as keyof typeof b];

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        } else if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
          return 0;
        }
      });
    }

    return filteredAds;
  }, [
    filteredBuysideData,
    filteredSellsideData,
    levelFilters,
    filters,
    selectedAdsetIds,
    selectedCampaignIds,
    sortColumn,
    sortDirection,
  ]);

  const handleDeselectAll = (e: React.MouseEvent, levelType: 'campaign' | 'adset' | 'ad') => {
    e.preventDefault();
    e.stopPropagation();
    if (levelType === 'campaign') {
      setSelectedCampaignIds(new Set());
    } else if (levelType === 'adset') {
      setSelectedAdsetIds(new Set());
    } else if (levelType === 'ad') {
      setSelectedAdIds(new Set());
    }
  };

  const handleNameClick = (id: string, levelType: 'campaign' | 'adset') => {
    if (levelType === 'campaign') {
      setSelectedCampaignIds(new Set([id]));
      setLevel('adset');
    } else if (levelType === 'adset') {
      setSelectedAdsetIds(new Set([id]));
      setLevel('ad');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'spend', label: 'Spend' },
    { key: 'clicks', label: 'Clicks' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'views', label: 'Views' },
    { key: 'rpac', label: 'RPAC' },
    { key: 'cpac', label: 'CPAC' },
    { key: 'margin', label: 'Margin' },
    { key: 'roi', label: 'ROI' },
  ];

  return (
    <div className="h-full space-y-4">
      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            setLevel('campaign');
          }}
          className="relative flex-1"
          variant={level === 'campaign' ? 'destructive' : 'secondary'}
        >
          Campaign
          {selectedCampaignIds.size > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 flex items-center"
              onClick={(e) => handleDeselectAll(e, 'campaign')}
            >
              {selectedCampaignIds.size} Selected{' '}
              <X
                size={16}
                className="ml-1"
              />
            </Badge>
          )}
        </Button>
        <Button
          onClick={() => {
            setLevel('adset');
          }}
          className="relative flex-1"
          variant={level === 'adset' ? 'destructive' : 'secondary'}
        >
          Adset
          {selectedAdsetIds.size > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 flex items-center"
              onClick={(e) => handleDeselectAll(e, 'adset')}
            >
              {selectedAdsetIds.size} Selected{' '}
              <X
                size={16}
                className="ml-1"
              />
            </Badge>
          )}
        </Button>
        <Button
          onClick={() => {
            setLevel('ad');
          }}
          className="relative flex-1"
          variant={level === 'ad' ? 'destructive' : 'secondary'}
        >
          Ad
          {selectedAdIds.size > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 flex items-center"
              onClick={(e) => handleDeselectAll(e, 'ad')}
            >
              {selectedAdIds.size} Selected{' '}
              <X
                size={16}
                className="ml-1"
              />
            </Badge>
          )}
        </Button>
      </div>
      <ScrollArea className="h-full rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-primary-foreground">
            <TableRow>
              <TableHead className="size-12 p-0">
                <div className="flex size-full items-center justify-center">
                  <Checkbox
                    checked={
                      level === 'campaign'
                        ? selectedCampaignIds.size === campaignsData.length && campaignsData.length > 0
                        : level === 'adset'
                          ? selectedAdsetIds.size === adsetData.length && adsetData.length > 0
                          : selectedAdIds.size === adData.length && adData.length > 0
                    }
                    onCheckedChange={(checked) => {
                      if (level === 'campaign') {
                        if (checked) {
                          setSelectedCampaignIds(new Set(campaignsData.map((campaign) => campaign.id)));
                        } else {
                          setSelectedCampaignIds(new Set());
                        }
                      } else if (level === 'adset') {
                        if (checked) {
                          setSelectedAdsetIds(new Set(adsetData.map((adset) => adset.id)));
                        } else {
                          setSelectedAdsetIds(new Set());
                        }
                      } else if (level === 'ad') {
                        if (checked) {
                          setSelectedAdIds(new Set(adData.map((ad) => ad.id)));
                        } else {
                          setSelectedAdIds(new Set());
                        }
                      }
                    }}
                  />
                </div>
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    {sortColumn === column.key && sortDirection === 'asc' ? (
                      <MoveUp
                        size={16}
                        className="text-green-500"
                      />
                    ) : sortColumn === column.key && sortDirection === 'desc' ? (
                      <MoveDown
                        size={16}
                        className="text-red-500"
                      />
                    ) : (
                      <ArrowUpDown
                        size={16}
                        className="text-muted-foreground"
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {level === 'campaign' &&
              campaignsData.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="size-12 p-0">
                    <div className="flex size-full items-center justify-center">
                      <Checkbox
                        checked={selectedCampaignIds.has(campaign.id)}
                        onCheckedChange={(checked) => {
                          setSelectedCampaignIds((prev) => {
                            const newSet = new Set(prev);
                            if (checked) {
                              newSet.add(campaign.id);
                            } else {
                              newSet.delete(campaign.id);
                            }
                            return newSet;
                          });
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => handleNameClick(campaign.id, 'campaign')}
                  >
                    <span className="line-clamp-1">{campaign.name}</span>
                    <span className="text-muted-foreground">{campaign.id}</span>
                  </TableCell>{' '}
                  <TableCell>{getFormattedValue('spend', campaign.spend)}</TableCell>
                  <TableCell>{campaign.clicks}</TableCell>
                  <TableCell>{campaign.impressions}</TableCell>
                  <TableCell>{getFormattedValue('revenue', campaign.revenue)}</TableCell>
                  <TableCell>{campaign.views}</TableCell>
                  <TableCell>{getFormattedValue('rpac', campaign.rpac)}</TableCell>
                  <TableCell>{getFormattedValue('cpac', campaign.cpac)}</TableCell>
                  <TableCell>
                    <span className={campaign.margin >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {getFormattedValue('margin', campaign.margin)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={campaign.roi >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {getFormattedValue('roi', campaign.roi)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            {level === 'adset' &&
              adsetData.map((adset) => (
                <TableRow key={adset.id}>
                  <TableCell className="size-12 p-0">
                    <div className="flex size-full items-center justify-center">
                      <Checkbox
                        checked={selectedAdsetIds.has(adset.id)}
                        onCheckedChange={(checked) => {
                          setSelectedAdsetIds((prev) => {
                            const newSet = new Set(prev);
                            if (checked) {
                              newSet.add(adset.id);
                            } else {
                              newSet.delete(adset.id);
                            }
                            return newSet;
                          });
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => handleNameClick(adset.id, 'adset')}
                  >
                    <span className="line-clamp-1">{adset.name}</span>
                    <span className="text-muted-foreground">{adset.id}</span>
                  </TableCell>
                  <TableCell>{getFormattedValue('spend', adset.spend)}</TableCell>
                  <TableCell>{adset.clicks}</TableCell>
                  <TableCell>{adset.impressions}</TableCell>
                  <TableCell>{getFormattedValue('revenue', adset.revenue)}</TableCell>
                  <TableCell>{adset.views}</TableCell>
                  <TableCell>{getFormattedValue('rpac', adset.rpac)}</TableCell>
                  <TableCell>{getFormattedValue('cpac', adset.cpac)}</TableCell>
                  <TableCell>
                    <span className={adset.margin >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {getFormattedValue('margin', adset.margin)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={adset.roi >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {getFormattedValue('roi', adset.roi)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            {level === 'ad' &&
              adData.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="size-12 p-0">
                    <div className="flex size-full items-center justify-center">
                      <Checkbox
                        checked={selectedAdIds.has(ad.id)}
                        onCheckedChange={(checked) => {
                          setSelectedAdIds((prev) => {
                            const newSet = new Set(prev);
                            if (checked) {
                              newSet.add(ad.id);
                            } else {
                              newSet.delete(ad.id);
                            }
                            return newSet;
                          });
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="cursor-pointer">
                    <span className="line-clamp-1">{ad.name}</span>
                    <span className="text-muted-foreground">{ad.id}</span>
                  </TableCell>{' '}
                  <TableCell>{getFormattedValue('spend', ad.spend)}</TableCell>
                  <TableCell>{ad.clicks}</TableCell>
                  <TableCell>{ad.impressions}</TableCell>
                  <TableCell>{getFormattedValue('revenue', ad.revenue)}</TableCell>
                  <TableCell>{ad.views}</TableCell>
                  <TableCell>{getFormattedValue('rpac', ad.rpac)}</TableCell>
                  <TableCell>{getFormattedValue('cpac', ad.cpac)}</TableCell>
                  <TableCell>
                    <span className={ad.margin >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {getFormattedValue('margin', ad.margin)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={ad.roi >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {getFormattedValue('roi', ad.roi)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
