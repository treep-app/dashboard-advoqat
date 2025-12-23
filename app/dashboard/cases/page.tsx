"use client";

import { useQuery } from "@tanstack/react-query";
import { casesService } from "@/services/cases.service";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedSearch } from "@/components/ui/enhanced-search";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import {
  Search,
  Briefcase,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Filter,
  User,
  TrendingUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data: cases, isLoading } = useQuery({
    queryKey: ["cases"],
    queryFn: () => casesService.getAll(),
  });

  const filteredCases =
    cases?.filter((caseItem) => {
      const matchesSearch =
        (caseItem.title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (caseItem.client?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (caseItem.client?.email || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || caseItem.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" ||
        (caseItem.priority || "").toLowerCase() === priorityFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority;
    }) || [];

  const stats = {
    total: cases?.length || 0,
    active: cases?.filter((c) => c.status === "active").length || 0,
    pending: cases?.filter((c) => c.status === "pending").length || 0,
    completed: cases?.filter((c) => c.status === "completed").length || 0,
  };

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      {
        icon: React.ReactNode;
        variant: "default" | "secondary" | "destructive" | "outline";
        className: string;
      }
    > = {
      active: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        variant: "default",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      pending: {
        icon: <Clock className="h-3 w-3" />,
        variant: "secondary",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      completed: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        variant: "outline",
        className: "bg-green-50 text-green-700 border-green-200",
      },
      declined: {
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

  const getPriorityBadge = (priority: string | null | undefined) => {
    if (!priority) return <span className="text-muted-foreground text-sm">N/A</span>;
    
    const config: Record<string, { className: string; icon: React.ReactNode }> = {
      high: {
        className: "bg-red-50 text-red-700 border-red-200",
        icon: <AlertCircle className="h-3 w-3" />,
      },
      medium: {
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <Clock className="h-3 w-3" />,
      },
      low: {
        className: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle2 className="h-3 w-3" />,
      },
    };

    const priorityConfig = config[priority.toLowerCase()] || config.medium;
    return (
      <Badge
        variant="outline"
        className={`${priorityConfig.className} gap-1.5 font-medium`}
      >
        {priorityConfig.icon}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Briefcase className="h-6 w-6" />
              </div>
              Cases
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage all legal cases
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Total Cases
              </CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {stats.total}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Active
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {stats.active}
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

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Completed
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {stats.completed}
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
                  placeholder="Search by title, client name, or email..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-11 border-2 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by priority" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-muted/50 to-transparent pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl">Case List</span>
              <Badge variant="outline" className="font-normal">
                {filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-muted-foreground font-medium">Loading cases...</p>
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                    ? "No cases match your filters"
                    : "No cases found"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Cases will appear here once they are created"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                  <TableBody>
                    {filteredCases.map((caseItem) => (
                      <TableRow key={caseItem.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{caseItem.title}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xs font-semibold">
                              {caseItem.client?.name
                                ?.charAt(0)
                                .toUpperCase() || "C"}
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {caseItem.client?.name || "N/A"}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {caseItem.client?.email || "N/A"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                        <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(caseItem.created_at)}
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
