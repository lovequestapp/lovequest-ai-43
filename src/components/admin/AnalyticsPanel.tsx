
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 400, premium: 240 },
  { name: 'Feb', users: 480, premium: 260 },
  { name: 'Mar', users: 550, premium: 290 },
  { name: 'Apr', users: 680, premium: 320 },
  { name: 'May', users: 720, premium: 350 },
  { name: 'Jun', users: 800, premium: 410 },
  { name: 'Jul', users: 870, premium: 450 },
];

const AnalyticsPanel = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-love-800">Analytics</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Total users and premium subscribers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="Total Users" />
                  <Line type="monotone" dataKey="premium" stroke="#f43f5e" name="Premium Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardDescription>Monthly active users and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Engagement metrics will appear here
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Subscription and in-app purchase metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Revenue metrics will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
