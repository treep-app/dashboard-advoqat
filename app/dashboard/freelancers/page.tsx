"use client";

import { useQuery } from "@tanstack/react-query";
import { freelancersService } from "@/services/freelancers.service";
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
  UserCheck,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Briefcase,
  TrendingUp,
  Filter,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FreelancersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");

  const { data: freelancers, isLoading } = useQuery({
    queryKey: ["freelancers"],
    queryFn: () => freelancersService.getAll(),
  });

  const filteredFreelancers =
    freelancers?.filter((freelancer) => {
      const expertiseAreas = Array.isArray(freelancer.expertise_areas) 
        ? freelancer.expertise_areas.join(" ") 
        : "";
      const matchesSearch =
        (freelancer.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (freelancer.email || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        expertiseAreas.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && freelancer.is_available) ||
        (availabilityFilter === "unavailable" && !freelancer.is_available);
      return matchesSearch && matchesAvailability;
    }) || [];

  const stats = {
    total: freelancers?.length || 0,
    available: freelancers?.filter((f) => f.is_available).length || 0,
    unavailable: freelancers?.filter((f) => !f.is_available).length || 0,
    verified: freelancers?.filter((f) => f.is_verified || f.verification_status === 'approved').length || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
              Freelancer Lawyers
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage freelancer lawyers and their availability
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Total Freelancers
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {stats.total}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Available
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {stats.available}
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">
                Unavailable
              </CardTitle>
              <XCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {stats.unavailable}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Verified
              </CardTitle>
              <Star className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {stats.verified}
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
                  placeholder="Search by name, email, or specialization..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
              <Select
                value={availabilityFilter}
                onValueChange={setAvailabilityFilter}
              >
                <SelectTrigger className="w-full sm:w-[200px] h-11 border-2 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by availability" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-muted/50 to-transparent pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl">Freelancer List</span>
              <Badge variant="outline" className="font-normal">
                {filteredFreelancers.length} {filteredFreelancers.length === 1 ? 'freelancer' : 'freelancers'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-muted-foreground font-medium">Loading freelancers...</p>
              </div>
            ) : filteredFreelancers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <UserCheck className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  {searchQuery || availabilityFilter !== "all"
                    ? "No freelancers match your filters"
                    : "No freelancers found"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || availabilityFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Freelancers will appear here once they register"}
                </p>
              </div>
            ) : (
              <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Freelancer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Joined Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFreelancers.map((freelancer) => (
                      <TableRow key={freelancer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold">
                              {freelancer.name
                                ?.charAt(0)
                                .toUpperCase() || "F"}
                            </div>
                            <div>
                              <div className="font-medium">
                                {freelancer.name || "N/A"}
                              </div>
                              {(freelancer.is_verified || freelancer.verification_status === 'approved') && (
                                <Badge
                                  variant="outline"
                                  className="mt-1 text-xs bg-purple-50 text-purple-700 border-purple-200"
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {freelancer.email || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {Array.isArray(freelancer.expertise_areas) && freelancer.expertise_areas.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {freelancer.expertise_areas.slice(0, 2).map((area, idx) => (
                                <Badge key={idx} variant="outline" className="font-normal text-xs">
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {area}
                                </Badge>
                              ))}
                              {freelancer.expertise_areas.length > 2 && (
                                <Badge variant="outline" className="font-normal text-xs">
                                  +{freelancer.expertise_areas.length - 2} more
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Not specified
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={freelancer.is_available ? "default" : "secondary"}
                            className={
                              freelancer.is_available
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {freelancer.is_available ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Available
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Unavailable
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {freelancer.performance_score != null && 
                           (typeof freelancer.performance_score === 'number' || 
                            (typeof freelancer.performance_score === 'string' && freelancer.performance_score !== '')) ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-medium">
                                  {Number(freelancer.performance_score).toFixed(1)}
                                </span>
                              </div>
                              {freelancer.total_earnings && 
                               (typeof freelancer.total_earnings === 'number' || 
                                (typeof freelancer.total_earnings === 'string' && freelancer.total_earnings !== '')) && (
                                <span className="text-xs text-muted-foreground">
                                  • ${Number(freelancer.total_earnings).toLocaleString()}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              N/A
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(freelancer.created_at)}
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
