import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Building, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  weeklyVisits: number;
  monthlyVisits: number;
  companyVisits: { company: string; count: number }[];
  dailyVisits: { date: string; visits: number }[];
  visitTypes: { type: string; count: number }[];
}

const VisitorStatistics = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<VisitorStats>({
    totalVisits: 0,
    todayVisits: 0,
    weeklyVisits: 0,
    monthlyVisits: 0,
    companyVisits: [],
    dailyVisits: [],
    visitTypes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Fetch all visitor data
      const { data: allVisitors } = await supabase
        .from('CHECKIN_visitors')
        .select('*')
        .order('check_in_time', { ascending: false });

      if (!allVisitors) return;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate basic stats
      const totalVisits = allVisitors.length;
      const todayVisits = allVisitors.filter(v => 
        new Date(v.check_in_time) >= today
      ).length;
      const weeklyVisits = allVisitors.filter(v => 
        new Date(v.check_in_time) >= weekAgo
      ).length;
      const monthlyVisits = allVisitors.filter(v => 
        new Date(v.check_in_time) >= monthAgo
      ).length;

      // Company statistics
      const companyCount = allVisitors.reduce((acc, visitor) => {
        acc[visitor.company] = (acc[visitor.company] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const companyVisits = Object.entries(companyCount)
        .map(([company, count]) => ({ company, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Daily visits for the last 30 days
      const dailyCount = allVisitors
        .filter(v => new Date(v.check_in_time) >= monthAgo)
        .reduce((acc, visitor) => {
          const date = new Date(visitor.check_in_time).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const dailyVisits = Object.entries(dailyCount)
        .map(([date, visits]) => ({ date, visits }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Visit types
      const visitTypes = [
        { 
          type: 'Reguljära besök', 
          count: allVisitors.filter(v => !v.is_service_personnel && !v.is_school_visit).length 
        },
        { 
          type: 'Servicepersonal', 
          count: allVisitors.filter(v => v.is_service_personnel).length 
        },
        { 
          type: 'Skolbesök', 
          count: allVisitors.filter(v => v.is_school_visit).length 
        }
      ].filter(item => item.count > 0);

      setStats({
        totalVisits,
        todayVisits,
        weeklyVisits,
        monthlyVisits,
        companyVisits,
        dailyVisits,
        visitTypes
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--muted))'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Laddar statistik...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Besöksstatistik</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt antal besök</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Besök idag</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Senaste veckan</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Senaste månaden</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyVisits}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Visits Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Besök per dag (senaste 30 dagarna)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('sv-SE')}
                  formatter={(value) => [value, 'Besök']}
                />
                <Bar dataKey="visits" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Visit Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Besökstyper</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.visitTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.visitTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Mest besökande företag
          </CardTitle>
          <CardDescription>Top 10 företag baserat på antal besök</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.companyVisits.map((company, index) => (
              <div key={company.company} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                  <span className="font-medium">{company.company}</span>
                </div>
                <span className="text-lg font-bold">{company.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorStatistics;