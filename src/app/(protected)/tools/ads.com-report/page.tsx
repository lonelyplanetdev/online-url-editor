import { PageContent, PageDescription, PageHeader, PageTitle } from '~/components/page-details';
import { AdsClient } from '~/lib/ads.com';
import AdsComReportClient from './client';

const client = new AdsClient({
  username: process.env.ADS_COM_USERNAME!,
  password: process.env.ADS_COM_PASSWORD!,
  secretKey: process.env.ADS_COM_SECRET_KEY!,
});

export default function AdsComReportPage() {
  const fetchReportAction = async (utcDatetimeRange: [string, string]) => {
    'use server';
    console.log(utcDatetimeRange);
    const report = await client.getAdClicks(utcDatetimeRange);
    return report;
  };

  return (
    <>
      <PageHeader>
        <PageTitle>Ads.com Report</PageTitle>
        <PageDescription>Pull a report from ads.com for deep analysis.</PageDescription>
      </PageHeader>
      <PageContent container>
        <AdsComReportClient action={fetchReportAction} />
      </PageContent>
    </>
  );
}
