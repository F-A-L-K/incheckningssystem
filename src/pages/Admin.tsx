
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrentVisitors } from "@/components/admin/CurrentVisitors";
import { VisitorHistory } from "@/components/admin/VisitorHistory";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Tillbaka
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">Aktuella Besökare</TabsTrigger>
                <TabsTrigger value="history">Historik</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="mt-6">
                <CurrentVisitors />
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <VisitorHistory />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
