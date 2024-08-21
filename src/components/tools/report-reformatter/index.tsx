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

function ReportReformatterTool() {
  const [facebookReport, setFacebookReport] = React.useState<ReportDataRow[] | null>(null);
  const [newsbreakReport, setNewsbreakReport] = React.useState<ReportDataRow[] | null>(null);
  const [combinedData, setCombinedData] = React.useState<ReportDataRow[]>([]);

  React.useEffect(() => {
    const goodReports = [facebookReport, newsbreakReport].filter((report) => report !== null) as ReportDataRow[][];
    const combined = goodReports.flat();
    setCombinedData(combined);
  }, [facebookReport, newsbreakReport]);

  return (
    <div className="grid gap-8">
      <ReportUploads
        onFacebookData={setFacebookReport}
        onNewsbreakData={setNewsbreakReport}
      />
      <OutputData output={combinedData} />
      <Actions output={combinedData} />
    </div>
  );
}

export { ReportReformatterTool };
