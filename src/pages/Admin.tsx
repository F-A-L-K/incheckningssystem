
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCheckedInVisitors, checkOutVisitor, convertToVisitorFormat } from '@/services/visitorService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CurrentVisitors from '@/components/admin/CurrentVisitors';
import VisitorHistory from '@/components/admin/VisitorHistory';

const Admin = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Hantera besökare</p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Nuvarande besökare</TabsTrigger>
            <TabsTrigger value="history">Historik</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <CurrentVisitors />
          </TabsContent>
          
          <TabsContent value="history">
            <VisitorHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
