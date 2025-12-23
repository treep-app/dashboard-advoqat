"use client";

import { useQuery } from "@tanstack/react-query";
import { documentsService } from "@/services/documents.service";
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
  FileText,
  Mail,
  Calendar,
  ExternalLink,
  Download,
  Filter,
  Briefcase,
  User,
  File,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => documentsService.getAll(),
  });

  const filteredDocuments =
    documents?.filter((doc) => {
      const matchesSearch =
        (doc.document_type || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (doc.user?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (doc.user?.email || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (doc.case?.title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === "all" ||
        (doc.document_type || "").toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesType;
    }) || [];

  const documentTypes = Array.from(
    new Set(documents?.map((d) => d.document_type).filter(Boolean))
  );

  const stats = {
    total: documents?.length || 0,
    thisMonth: documents?.filter((doc) => {
      const docDate = new Date(doc.created_at);
      const now = new Date();
      return (
        docDate.getMonth() === now.getMonth() &&
        docDate.getFullYear() === now.getFullYear()
      );
    }).length || 0,
  };

  const getDocumentTypeIcon = (type: string | null | undefined) => {
    if (!type) return <File className="h-4 w-4" />;
    const lowerType = type.toLowerCase();
    if (lowerType.includes("contract") || lowerType.includes("agreement")) {
      return <FileText className="h-4 w-4" />;
    }
    if (lowerType.includes("brief") || lowerType.includes("motion")) {
      return <Briefcase className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <FileText className="h-6 w-6" />
              </div>
              AI Documents
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage all AI-generated legal documents
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">
                Total Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {stats.total}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                This Month
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {stats.thisMonth}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Document Types
              </CardTitle>
              <File className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {documentTypes.length}
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
                  placeholder="Search by type, owner, or case..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-11 border-2 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-muted/50 to-transparent pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl">Document List</span>
              <Badge variant="outline" className="font-normal">
                {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-muted-foreground font-medium">Loading documents...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  {searchQuery || typeFilter !== "all"
                    ? "No documents match your filters"
                    : "No documents found"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || typeFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Documents will appear here once they are generated"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Case</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                              {getDocumentTypeIcon(doc.document_type)}
                            </div>
                            <div>
                              <div className="font-medium">
                                {doc.document_type || "Unknown Type"}
                              </div>
                              <Badge
                                variant="outline"
                                className="mt-1 text-xs bg-orange-50 text-orange-700 border-orange-200"
                              >
                                AI Generated
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xs font-semibold">
                              {doc.user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {doc.user?.name || "N/A"}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {doc.user?.email || "N/A"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {doc.case?.title ? (
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{doc.case.title}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No case
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(doc.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {doc.file_url ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(doc.file_url, "_blank")}
                                className="gap-1.5"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = doc.file_url;
                                  link.download = `${doc.document_type || "document"}.pdf`;
                                  link.click();
                                }}
                                className="gap-1.5"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No file
                            </span>
                          )}
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
