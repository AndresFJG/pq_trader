'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, ExternalLink } from 'lucide-react';
import { cn, formatPercentage } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

interface MonthlyReturn {
  month: string;
  return: number;
}

interface TrackRecordData {
  name: string;
  totalReturn: number;
  period: string;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  darwinexUrl?: string;
  monthlyReturns: {
    year: number;
    months: MonthlyReturn[];
  }[];
  chartData: {
    date: string;
    equity: number;
  }[];
}

interface TrackRecordCardProps {
  data: TrackRecordData;
  className?: string;
}

export function TrackRecordCard({ data, className }: TrackRecordCardProps) {
  const { language } = useLanguage();
  
  const monthNames = language === 'es' 
    ? ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
    : ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  const isPositive = data.totalReturn > 0;

  const getReturnColor = (value: number) => {
    if (value > 0) return 'text-profit';
    if (value < 0) return 'text-loss';
    return 'text-neutral-400';
  };

  const getReturnBg = (value: number) => {
    if (value > 0) return 'bg-profit/10';
    if (value < 0) return 'bg-loss/10';
    return 'bg-neutral-500/10';
  };

  return (
    <Card className={cn('border-border/40 bg-surface/50', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{data.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'es' ? 'Periodo:' : 'Period:'} {data.period}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-6 w-6 text-profit" />
              ) : (
                <TrendingDown className="h-6 w-6 text-loss" />
              )}
              <span className={cn(
                'text-3xl font-bold',
                isPositive ? 'text-profit' : 'text-loss'
              )}>
                {formatPercentage(data.totalReturn)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'es' ? 'Retorno Total' : 'Total Return'}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Gráfico de Equity */}
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chartData}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#00C853' : '#FF3B30'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isPositive ? '#00C853' : '#FF3B30'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                stroke="#888"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#888' }}
              />
              <YAxis 
                stroke="#888"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#888' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: any) => [`${value.toFixed(2)}%`, language === 'es' ? 'Equity' : 'Equity']}
              />
              <Line
                type="monotone"
                dataKey="equity"
                stroke={isPositive ? '#00C853' : '#FF3B30'}
                strokeWidth={2}
                dot={false}
                fill="url(#equityGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Métricas Clave */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background/50 rounded-lg p-4 text-center border border-border/30">
            <Activity className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground mb-1">Max Drawdown</p>
            <p className="text-lg font-bold text-loss">{formatPercentage(data.maxDrawdown)}</p>
          </div>
          <div className="bg-background/50 rounded-lg p-4 text-center border border-border/30">
            <Activity className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
            <p className="text-lg font-bold text-foreground">{data.sharpeRatio.toFixed(2)}</p>
          </div>
          <div className="bg-background/50 rounded-lg p-4 text-center border border-border/30">
            <Activity className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
            <p className="text-lg font-bold text-profit">{formatPercentage(data.winRate)}</p>
          </div>
        </div>

        {/* Tabla de Retornos Mensuales */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            {language === 'es' ? 'Retorno Mensual' : 'Monthly Return'}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                    {language === 'es' ? 'Año' : 'Year'}
                  </th>
                  {monthNames.map((month) => (
                    <th key={month} className="text-center py-2 px-1 text-muted-foreground font-medium">
                      {month}
                    </th>
                  ))}
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">
                    {language === 'es' ? 'Total' : 'Total'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyReturns.map((yearData) => {
                  const yearTotal = yearData.months.reduce((sum, m) => sum + m.return, 0);
                  return (
                    <tr key={yearData.year} className="border-b border-border/20">
                      <td className="py-2 px-2 font-medium text-foreground">{yearData.year}</td>
                      {monthNames.map((_, idx) => {
                        const monthData = yearData.months[idx];
                        const value = monthData?.return ?? null;
                        
                        if (value === null) {
                          return <td key={idx} className="text-center py-2 px-1 text-muted-foreground">-</td>;
                        }

                        return (
                          <td key={idx} className="py-2 px-1">
                            <div className={cn(
                              'text-center py-1 px-0.5 rounded text-xs font-medium',
                              getReturnBg(value),
                              getReturnColor(value)
                            )}>
                              {value.toFixed(1)}%
                            </div>
                          </td>
                        );
                      })}
                      <td className={cn(
                        'text-right py-2 px-2 font-bold',
                        getReturnColor(yearTotal)
                      )}>
                        {yearTotal.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Badge de Estado */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-profit animate-pulse" />
            <span className="text-xs text-muted-foreground">
              {language === 'es' ? 'Sistema Activo' : 'Active System'}
            </span>
          </div>
          {data.darwinexUrl ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-profit hover:text-profit/80 hover:bg-profit/10 h-auto py-1 px-2"
              asChild
            >
              <a 
                href={data.darwinexUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                {language === 'es' ? 'Ver en Darwinex' : 'View on Darwinex'}
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          ) : (
            <a 
              href="#" 
              className="text-xs text-profit hover:text-profit/80 transition-colors font-medium"
            >
              {language === 'es' ? 'Ver Detalles →' : 'View Details →'}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
