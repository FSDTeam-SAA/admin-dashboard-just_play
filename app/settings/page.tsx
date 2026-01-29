"use client";

import React from "react"

import { useState } from "react";
import { useSettings, useUpdateSettings } from "@/hooks/use-api";
import { AdminLayout } from "@/components/layout/admin-layout";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Settings as SettingsIcon,
  Shield,
  Activity,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState({
    appName: "",
    supportEmail: "",
    supportPhone: "",
    platformFee: 5,
    defaultCurrency: "IQD",
    defaultCity: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(formData);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Skeleton className="h-10 w-48 bg-slate-700 mb-4" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6 border-slate-700 bg-slate-900">
                <Skeleton className="h-6 w-40 bg-slate-800 mb-4" />
                <Skeleton className="h-40 bg-slate-800" />
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
          <p className="text-slate-400 mt-1">Manage platform configuration and settings</p>
        </div>

        {/* General Configuration */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              General Configuration
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                App Name
              </label>
              <Input
                type="text"
                value={formData.appName}
                onChange={(e) =>
                  setFormData({ ...formData, appName: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Support Email
              </label>
              <Input
                type="email"
                value={formData.supportEmail}
                onChange={(e) =>
                  setFormData({ ...formData, supportEmail: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Support Phone
              </label>
              <Input
                type="tel"
                value={formData.supportPhone}
                onChange={(e) =>
                  setFormData({ ...formData, supportPhone: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={updateSettings.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateSettings.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>

        {/* Business Rules */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Business Rules</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Platform Fee (%)
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Percentage taken from each online booking.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.platformFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platformFee: parseFloat(e.target.value),
                    })
                  }
                  className="w-24 bg-slate-800 border-slate-700 text-white"
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Default Currency
              </label>
              <Select
                value={formData.defaultCurrency}
                onValueChange={(value) =>
                  setFormData({ ...formData, defaultCurrency: value })
                }
              >
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="IQD">IQD (Iraqi Dinar)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Default City
              </label>
              <Input
                type="text"
                value={formData.defaultCity}
                onChange={(e) =>
                  setFormData({ ...formData, defaultCity: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={updateSettings.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Business Rules
            </Button>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-white">Change Admin Password</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Update your admin account password
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-slate-600 bg-transparent"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>

            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-white">Manage API Keys</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Create and manage API keys for integrations
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-slate-600 bg-transparent"
                >
                  Manage Keys
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* System Status */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">System Status</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">System Status</span>
              <span className="text-green-400 font-medium">System Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Version</span>
              <span className="text-slate-400">v2.1.0 (JustPlay)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Last Backup</span>
              <span className="text-slate-400">Today, 04:00 AM</span>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
