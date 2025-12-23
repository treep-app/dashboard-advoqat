"use client";

import { useQuery } from "@tanstack/react-query";
import { barristersService } from "@/services/barristers.service";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedSearch } from "@/components/ui/enhanced-search";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import {
  Search,
  Scale,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  User,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BarristersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: barristers, isLoading } = useQuery({
    queryKey: ["barristers"],
    queryFn: () => barristersService.getAll(),
  });

  const filteredBarristers =
    barristers?.filter((barrister) => {
      const matchesSearch =
        (barrister.user?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (barrister.user?.email || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        barrister.verification_status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  const stats = {
    total: barristers?.length || 0,
    verified: barristers?.filter((b) => b.verification_status === "verified")
      .length || 0,
    pending: barristers?.filter((b) => b.verification_status === "pending")
      .length || 0,
    rejected: barristers?.filter((b) => b.verification_status === "rejected")
      .length || 0,
  };

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      {
        icon: React.ReactNode;
        variant: "default" | "secondary" | "destructive";
        className: string;
      }
    > = {
      verified: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        variant: "default",
        className: "bg-green-50 text-green-700 border-green-200",
      },
      pending: {
        icon: <Clock className="h-3 w-3" />,
        variant: "secondary",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      rejected: {
        icon: <XCircle className="h-3 w-3" />,
        variant: "destructive",
        className: "bg-red-50 text-red-700 border-red-200",
      },
    };

    const statusConfig = config[status] || config.pending;
    return (
      <Badge
        variant={statusConfig.variant}
        className={`${statusConfig.className} gap-1.5 font-medium`}
      >
        {statusConfig.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getProfileCompletionColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <Scale className="h-6 w-6" />
              </div>
              Barristers
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor barrister accounts and verification status
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Total Barristers
              </CardTitle>
              <Scale className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {stats.total}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Verified
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {stats.verified}
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">
                {stats.pending}
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-700">
                Rejected
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                {stats.rejected}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <EnhancedSearch
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-11 border-2 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-muted/50 to-transparent pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl">Barrister List</span>
              <Badge variant="outline" className="font-normal">
                {filteredBarristers.length} {filteredBarristers.length === 1 ? 'barrister' : 'barristers'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-muted-foreground font-medium">Loading barristers...</p>
              </div>
            ) : filteredBarristers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Scale className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  {searchQuery || statusFilter !== "all"
                    ? "No barristers match your filters"
                    : "No barristers found"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Barristers will appear here once they register"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barrister</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Verification Status</TableHead>
                    <TableHead>Profile Completion</TableHead>
                    <TableHead>Joined Date</TableHead>
                  </TableRow>
                </TableHeader>
                  <TableBody>
                    {filteredBarristers.map((barrister) => (
                      <TableRow key={barrister.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold">
                              {barrister.user?.name
                                ?.charAt(0)
                                .toUpperCase() || "B"}
                            </div>
                            <div>
                              <div className="font-medium">
                                {barrister.user?.name || "N/A"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {barrister.user?.email || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(barrister.verification_status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all`}
                                style={{
                                  width: `${barrister.profile_completion || 0}%`,
                                }}
                              />
                            </div>
                            <span
                              className={`text-sm font-medium min-w-[3rem] ${getProfileCompletionColor(
                                barrister.profile_completion || 0
                              )}`}
                            >
                              {barrister.profile_completion || 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(barrister.created_at)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
