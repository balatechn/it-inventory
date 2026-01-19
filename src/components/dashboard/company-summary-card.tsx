import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

interface CompanySummary {
  code: string;
  name: string;
  systems: number;
  software: number;
  mobiles: number;
  activeRequests: number;
}

interface CompanySummaryCardProps {
  companies: CompanySummary[];
}

export function CompanySummaryCard({ companies }: CompanySummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#6A89A7]" />
          Company-wise Inventory Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {companies.map((company) => (
            <div
              key={company.code}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#070B47] flex items-center justify-center text-white font-semibold text-sm">
                  {company.code.substring(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-[#070B47]">{company.name}</p>
                  <p className="text-xs text-gray-500">{company.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-[#070B47]">{company.systems}</p>
                  <p className="text-xs text-gray-500">Systems</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-[#6A89A7]">{company.software}</p>
                  <p className="text-xs text-gray-500">Software</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">{company.mobiles}</p>
                  <p className="text-xs text-gray-500">Mobiles</p>
                </div>
                {company.activeRequests > 0 && (
                  <Badge variant="warning" className="ml-2">
                    {company.activeRequests} pending
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
