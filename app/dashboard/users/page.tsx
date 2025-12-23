"use client";

import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
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
import { useState } from "react";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  User,
  Eye,
  Edit,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(),
    retry: 1,
  });

  const toggleRow = (userId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredUsers =
    users?.filter((user) => {
      const matchesSearch =
        (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone || "").includes(searchQuery);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    }) || [];

  const getRoleBadge = (role: string) => {
    const config: Record<
      string,
      { variant: "default" | "secondary" | "outline" | "destructive"; color: string }
    > = {
      user: { variant: "default", color: "bg-blue-100 text-blue-700 border-blue-200" },
      barrister: { variant: "secondary", color: "bg-purple-100 text-purple-700 border-purple-200" },
      freelancer: { variant: "outline", color: "bg-green-100 text-green-700 border-green-200" },
      admin: { variant: "default", color: "bg-orange-100 text-orange-700 border-orange-200" },
      super_admin: { variant: "default", color: "bg-red-100 text-red-700 border-red-200" },
    };

    const roleConfig = config[role] || config.user;
    return (
      <Badge
        variant={roleConfig.variant}
        className={`${roleConfig.color} font-medium`}
      >
        {role.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const roleCounts = users?.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ) || {};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Users Management
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage all platform users ({users?.length || 0} total)
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold mt-1">{users?.length || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Regular Users</p>
                  <p className="text-2xl font-bold mt-1">{roleCounts.user || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Barristers</p>
                  <p className="text-2xl font-bold mt-1">{roleCounts.barrister || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Freelancers</p>
                  <p className="text-2xl font-bold mt-1">{roleCounts.freelancer || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold mt-1">
                    {(roleCounts.admin || 0) + (roleCounts.super_admin || 0)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px]">
                <EnhancedSearch
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[200px] h-11 border-2 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="barrister">Barristers</SelectItem>
                  <SelectItem value="freelancer">Freelancers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="super_admin">Super Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-muted/50 to-transparent">
            <CardTitle className="flex items-center justify-between">
              <span>All Users ({filteredUsers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted-foreground mt-4">Loading users...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <p className="text-destructive font-medium">Error loading users</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {error instanceof Error ? error.message : "Failed to fetch users"}
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium">No users found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const isExpanded = expandedRows.has(user.id);
                      return (
                        <>
                          <TableRow
                            key={user.id}
                            className="hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => toggleRow(user.id)}
                          >
                            <TableCell>
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold shadow-lg">
                                {getUserInitials(user.name)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-semibold">{user.name || "N/A"}</p>
                                <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span className="truncate max-w-[200px]">{user.email || "N/A"}</span>
                                </div>
                                {user.phone && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>{user.phone}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(user.role || "user")}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>{user.created_at ? formatDate(user.created_at) : "N/A"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRow(user.id);
                                  }}
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={7} className="p-6">
                                <div className="space-y-6">
                                  {/* Basic Information */}
                                  <div>
                                    <h4 className="text-sm font-semibold mb-4 text-foreground">
                                      Basic Information
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                          User ID
                                        </p>
                                        <p className="text-sm font-medium">{user.id}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                          Supabase ID
                                        </p>
                                        <p className="text-sm font-mono text-xs truncate">
                                          {user.supabase_id || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                          Created
                                        </p>
                                        <p className="text-sm">
                                          {user.created_at
                                            ? formatDateTime(user.created_at)
                                            : "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                          Last Updated
                                        </p>
                                        <p className="text-sm">
                                          {user.updated_at
                                            ? formatDateTime(user.updated_at)
                                            : "N/A"}
                                        </p>
                                      </div>
                                      {user.phone && (
                                        <div>
                                          <p className="text-xs font-medium text-muted-foreground mb-2">
                                            Phone
                                          </p>
                                          <p className="text-sm">{user.phone}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Professional Information - Only for non-admin users */}
                                  {user.role !== "admin" &&
                                    user.role !== "super_admin" && (
                                      <>
                                        {(user.experience !== null &&
                                          user.experience !== undefined) ||
                                        user.expertise_areas ||
                                        user.verification_status ||
                                        user.is_verified !== null ||
                                        user.is_available !== null ||
                                        user.total_earnings ||
                                        user.performance_score ? (
                                          <div className="border-t pt-6">
                                            <h4 className="text-sm font-semibold mb-4 text-foreground">
                                              Professional Information
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                              {user.experience !== null &&
                                                user.experience !== undefined && (
                                                  <div>
                                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                                      Experience
                                                    </p>
                                                    <p className="text-sm font-medium">
                                                      {user.experience} years
                                                    </p>
                                                  </div>
                                                )}

                                              {user.expertise_areas &&
                                                user.expertise_areas.length > 0 && (
                                                  <div className="md:col-span-2">
                                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                                      Expertise Areas
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                      {user.expertise_areas.map(
                                                        (area, idx) => (
                                                          <Badge
                                                            key={idx}
                                                            variant="outline"
                                                            className="text-xs"
                                                          >
                                                            {area}
                                                          </Badge>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                )}

                                              {user.verification_status && (
                                                <div>
                                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                                    Verification Status
                                                  </p>
                                                  <Badge
                                                    variant={
                                                      user.verification_status ===
                                                      "approved"
                                                        ? "default"
                                                        : user.verification_status ===
                                                          "rejected"
                                                        ? "destructive"
                                                        : "secondary"
                                                    }
                                                    className="capitalize"
                                                  >
                                                    {user.verification_status}
                                                  </Badge>
                                                </div>
                                              )}

                                              {user.is_verified !== null &&
                                                user.is_verified !== undefined && (
                                                  <div>
                                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                                      Verified
                                                    </p>
                                                    <Badge
                                                      variant={
                                                        user.is_verified
                                                          ? "default"
                                                          : "secondary"
                                                      }
                                                    >
                                                      {user.is_verified
                                                        ? "Yes"
                                                        : "No"}
                                                    </Badge>
                                                  </div>
                                                )}

                                              {user.is_available !== null &&
                                                user.is_available !== undefined && (
                                                  <div>
                                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                                      Availability
                                                    </p>
                                                    <Badge
                                                      variant={
                                                        user.is_available
                                                          ? "default"
                                                          : "secondary"
                                                      }
                                                      className={
                                                        user.is_available
                                                          ? "bg-green-100 text-green-700 border-green-200"
                                                          : ""
                                                      }
                                                    >
                                                      {user.is_available
                                                        ? "Available"
                                                        : "Unavailable"}
                                                    </Badge>
                                                  </div>
                                                )}

                                              {user.total_earnings && (
                                                <div>
                                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                                    Total Earnings
                                                  </p>
                                                  <p className="text-sm font-semibold text-green-600">
                                                    ${Number(user.total_earnings).toLocaleString()}
                                                  </p>
                                                </div>
                                              )}

                                              {user.performance_score !== null &&
                                                user.performance_score !== undefined && (
                                                  <div>
                                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                                      Performance Score
                                                    </p>
                                                    <p className="text-sm font-semibold">
                                                      {Number(user.performance_score).toFixed(1)}/10
                                                    </p>
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        ) : null}

                                        {/* Documents Section */}
                                        {(user.id_card_url ||
                                          user.bar_certificate_url ||
                                          (user.additional_documents &&
                                            user.additional_documents.length > 0)) && (
                                          <div className="border-t pt-6">
                                            <h4 className="text-sm font-semibold mb-4 text-foreground">
                                              Documents
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                              {user.id_card_url && (
                                                <div className="p-3 border rounded-lg bg-muted/30">
                                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                                    ID Card
                                                  </p>
                                                  <a
                                                    href={user.id_card_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline flex items-center gap-2"
                                                  >
                                                    <FileText className="h-4 w-4" />
                                                    View Document
                                                  </a>
                                                </div>
                                              )}

                                              {user.bar_certificate_url && (
                                                <div className="p-3 border rounded-lg bg-muted/30">
                                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                                    Bar Certificate
                                                  </p>
                                                  <a
                                                    href={user.bar_certificate_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline flex items-center gap-2"
                                                  >
                                                    <FileText className="h-4 w-4" />
                                                    View Document
                                                  </a>
                                                </div>
                                              )}

                                              {user.additional_documents &&
                                                user.additional_documents.length > 0 && (
                                                  <div className="p-3 border rounded-lg bg-muted/30">
                                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                                      Additional Documents (
                                                      {user.additional_documents.length})
                                                    </p>
                                                    <div className="space-y-1">
                                                      {user.additional_documents.map(
                                                        (doc, idx) => (
                                                          <a
                                                            key={idx}
                                                            href={doc}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-primary hover:underline flex items-center gap-1 block"
                                                          >
                                                            <FileText className="h-3 w-3" />
                                                            Document {idx + 1}
                                                          </a>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}

                                  {/* Actions */}
                                  <div className="flex items-center gap-2 pt-6 border-t">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit User
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
