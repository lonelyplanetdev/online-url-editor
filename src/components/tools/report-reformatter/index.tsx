'use client';

import * as React from 'react';

export type ReportDataRow = {
  date: string;
  campaign_name: string;
  spend: number;
  uniques: number;
  cpc: number;
  cpr: number;
  traffic_source: string;
};

import { ReportUploads } from './report-uploads';
import { OutputData } from './output-data';
import { Actions } from './actions';
import { Exclusions } from './exclusions';

function ReportReformatterTool() {
  const [facebookReport, setFacebookReport] = React.useState<ReportDataRow[] | null>(null);
  const [newsbreakReport, setNewsbreakReport] = React.useState<ReportDataRow[] | null>(null);

  const [combinedData, setCombinedData] = React.useState<ReportDataRow[]>([]);
  const [excludeList, setExcludeList] = React.useState<string[]>([]);

  React.useEffect(() => {
    const combined = [...(facebookReport ?? []), ...(newsbreakReport ?? [])];
    setCombinedData(combined);
  }, [facebookReport, newsbreakReport]);

  return (
    <div className="grid gap-8">
      <ReportUploads
        onFacebookData={setFacebookReport}
        onNewsbreakData={setNewsbreakReport}
      />
      <OutputData output={combinedData.filter((row) => !excludeList.includes(row.campaign_name))} />
      <Exclusions onExclusionsChange={(exclusions) => setExcludeList(exclusions)} />
      <Actions output={combinedData.filter((row) => !excludeList.includes(row.campaign_name))} />
    </div>
  );
}

export { ReportReformatterTool };
