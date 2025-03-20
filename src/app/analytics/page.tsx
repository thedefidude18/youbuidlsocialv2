"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { mockPosts } from "@/lib/mock-data";

// Mock analytics data
const ENGAGEMENT_DATA = [
  { date: 'Mon', likes: 120, comments: 45, recasts: 22, impressions: 1200 },
  { date: 'Tue', likes: 145, comments: 53, recasts: 28, impressions: 1350 },
  { date: 'Wed', likes: 162, comments: 61, recasts: 35, impressions: 1480 },
  { date: 'Thu', likes: 134, comments: 49, recasts: 25, impressions: 1320 },
  { date: 'Fri', likes: 180, comments: 72, recasts: 42, impressions: 1650 },
  { date: 'Sat', likes: 220, comments: 85, recasts: 55, impressions: 2100 },
  { date: 'Sun', likes: 198, comments: 76, recasts: 48, impressions: 1890 },
];

const MONTHLY_ENGAGEMENT = [
  { month: 'Jan', interactions: 2400 },
  { month: 'Feb', interactions: 3100 },
  { month: 'Mar', interactions: 2800 },
  { month: 'Apr', interactions: 3200 },
  { month: 'May', interactions: 3800 },
  { month: 'Jun', interactions: 3500 },
  { month: 'Jul', interactions: 3700 },
  { month: 'Aug', interactions: 4100 },
  { month: 'Sep', interactions: 3900 },
  { month: 'Oct', interactions: 4200 },
  { month: 'Nov', interactions: 4500 },
  { month: 'Dec', interactions: 5000 },
];

const AUDIENCE_DATA = [
  { name: 'Developers', value: 35 },
  { name: 'Crypto Enthusiasts', value: 25 },
  { name: 'NFT Collectors', value: 15 },
  { name: 'Investors', value: 15 },
  { name: 'Others', value: 10 },
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const OPTIMAL_TIME_DATA = [
  { time: '8 AM', engagement: 35 },
  { time: '10 AM', engagement: 65 },
  { time: '12 PM', engagement: 78 },
  { time: '2 PM', engagement: 90 },
  { time: '4 PM', engagement: 120 },
  { time: '6 PM', engagement: 150 },
  { time: '8 PM', engagement: 180 },
  { time: '10 PM', engagement: 135 },
  { time: '12 AM', engagement: 85 },
];

// Mock post performance data
const topPosts = mockPosts
  .map(post => ({
    id: post.id,
    content: post.content.length > 60 ? post.content.substring(0, 60) + '...' : post.content,
    likes: post.stats.likes,
    comments: post.stats.comments,
    recasts: post.stats.recasts,
    engagement: post.stats.likes + post.stats.comments + post.stats.recasts,
    date: post.timestamp
  }))
  .sort((a, b) => b.engagement - a.engagement)
  .slice(0, 5);

// Follower growth data
const FOLLOWER_GROWTH = [
  { date: 'Jan 1', followers: 1200 },
  { date: 'Jan 15', followers: 1350 },
  { date: 'Feb 1', followers: 1500 },
  { date: 'Feb 15', followers: 1720 },
  { date: 'Mar 1', followers: 1950 },
  { date: 'Mar 15', followers: 2250 },
  { date: 'Apr 1', followers: 2580 },
  { date: 'Apr 15', followers: 2820 },
  { date: 'May 1', followers: 3100 },
];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <MainLayout>
        <div className="flex flex-col min-h-0 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <div className="h-10 w-36 bg-muted rounded-md animate-pulse"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6 h-32 animate-pulse flex flex-col space-y-4">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6 h-80 animate-pulse">
                <div className="h-6 w-40 bg-muted rounded mb-4"></div>
                <div className="h-64 w-full bg-muted/30 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 min-h-0 p-6 overflow-y-auto pb-16 md:pb-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as 'week' | 'month' | 'year')}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32.5K</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↑ 12%</span> vs. last {timeRange}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.3%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↑ 0.8%</span> vs. last {timeRange}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profile Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,842</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↑ 18%</span> vs. last {timeRange}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">238</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-rose-500 font-medium">↓ 4%</span> vs. last {timeRange}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Overview</CardTitle>
              <CardDescription>Likes, comments, and recasts over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ENGAGEMENT_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs text-muted-foreground" />
                  <YAxis className="text-xs text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="likes" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="recasts" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>Breakdown of your audience interests</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={AUDIENCE_DATA}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {AUDIENCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* More Detailed Analytics */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimal Posting Times</CardTitle>
              <CardDescription>When your audience is most active</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={OPTIMAL_TIME_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" className="text-xs text-muted-foreground" />
                  <YAxis className="text-xs text-muted-foreground" />
                  <Tooltip
                    formatter={(value: any) => [`${value} interactions`, 'Engagement']}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="engagement" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follower Growth</CardTitle>
              <CardDescription>How your audience has grown over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FOLLOWER_GROWTH} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs text-muted-foreground" />
                  <YAxis className="text-xs text-muted-foreground" />
                  <Tooltip
                    formatter={(value: any) => [`${value} followers`, 'Total']}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="followers" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Your posts with the highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-4 pl-0">Content</th>
                    <th className="text-center font-medium p-4">Likes</th>
                    <th className="text-center font-medium p-4">Comments</th>
                    <th className="text-center font-medium p-4">Recasts</th>
                    <th className="text-right font-medium p-4 pr-0">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.map((post, i) => (
                    <tr key={post.id} className="border-b">
                      <td className="p-4 pl-0">{post.content}</td>
                      <td className="text-center p-4">{post.likes}</td>
                      <td className="text-center p-4">{post.comments}</td>
                      <td className="text-center p-4">{post.recasts}</td>
                      <td className="text-right font-medium p-4 pr-0">{post.engagement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Monthly Engagement Trends</CardTitle>
            <CardDescription>Total interactions by month</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_ENGAGEMENT} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs text-muted-foreground" />
                <YAxis className="text-xs text-muted-foreground" />
                <Tooltip
                  formatter={(value: any) => [`${value} interactions`, 'Engagement']}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="interactions" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">AI-Generated Insights</h2>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12" y2="8"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Content Suggestion</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Posts with images receive 35% more engagement than text-only posts. Consider adding visuals to your next updates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Engagement Pattern</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Your audience is most active between 4 PM and 8 PM. Schedule your important posts during this window for maximum reach.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Content Performance</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Topics related to #DeFi and #NFT consistently outperform other content categories by 42%. Consider creating more content in these areas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
