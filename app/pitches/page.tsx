"use client";

import { useState } from "react";
import { usePitches, useUpdatePitchStatus } from "@/hooks/use-api";
import { AdminLayout } from "@/components/layout/admin-layout";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Edit2, AlertCircle, Plus } from "lucide-react";

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-green-500/20", text: "text-green-400" },
  maintenance: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  inactive: { bg: "bg-gray-500/20", text: "text-gray-400" },
  blocked: { bg: "bg-red-500/20", text: "text-red-400" },
};

const pitchTypeStyles: Record<string, string> = {
  indoor: "bg-blue-500/20 text-blue-400",
  outdoor: "bg-green-500/20 text-green-400",
};

export default function PitchesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filters = statusFilter !== "all" ? { status: statusFilter } : undefined;
  const { data, isLoading } = usePitches(page, limit, filters);
  const updateStatus = useUpdatePitchStatus();

  const handleStatusChange = (pitchId: string, newStatus: string) => {
    updateStatus.mutate({ id: pitchId, status: newStatus });
  };

  const totalPages = data?.totalPages || 1;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Pitch Management</h1>
            <p className="text-slate-400 mt-1">Manage all sports pitches and facilities</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Pitch
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by name, city or owner..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 bg-transparent"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton columns={7} rows={10} />
        ) : data?.pitches && data.pitches.length > 0 ? (
          <Card className="border-slate-700 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 border-slate-700">
                    <TableHead className="text-slate-300">Pitch Details</TableHead>
                    <TableHead className="text-slate-300">Owner</TableHead>
                    <TableHead className="text-slate-300">Location</TableHead>
                    <TableHead className="text-slate-300">Price / Hr</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-right text-slate-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pitches.map((pitch: any) => {
                    const colors =
                      statusColors[pitch.status] || statusColors.active;
                    return (
                      <TableRow key={pitch._id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">
                              {pitch.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {pitch.sport?.name || "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {pitch.owner?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {pitch.city?.name || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          {pitch.price?.toLocaleString()} {pitch.currency}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-0 ${
                              pitchTypeStyles[pitch.pitchType] ||
                              "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {pitch.pitchType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-0 ${colors.bg} ${colors.text}`}
                          >
                            {pitch.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {pitch.status === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10 bg-transparent"
                                onClick={() =>
                                  handleStatusChange(
                                    pitch._id,
                                    "maintenance"
                                  )
                                }
                              >
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Set Maintenance
                              </Button>
                            )}
                            {pitch.status === "maintenance" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() =>
                                  handleStatusChange(pitch._id, "active")
                                }
                              >
                                Activate
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card className="p-12 border-slate-700 bg-slate-900 text-center">
            <p className="text-slate-400">No pitches found</p>
          </Card>
        )}

        {/* Pagination */}
        {data?.pitches && data.pitches.length > 0 && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Page {page} of {totalPages} ({data?.total} total pitches)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-slate-700 bg-transparent"
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center px-4 py-2 text-sm text-slate-300">
                {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                className="border-slate-700 bg-transparent"
                disabled={page >= totalPages}
                onClick={() => setPage(Math.min(totalPages, page + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
