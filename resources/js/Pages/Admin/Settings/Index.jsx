import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Download, Upload, Save } from "lucide-react";
import { toast } from "sonner";

export default function Settings({ settings, structure }) {
  const [activeTab, setActiveTab] = useState("general");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const { data, setData, post, processing } = useForm(
    Object.entries(settings).reduce((acc, [category, fields]) => {
      Object.entries(fields).forEach(([key, field]) => {
        acc[key] = field.value;
      });
      return acc;
    }, {})
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.settings.update"), {
      onSuccess: () => {
        toast.success("Settings updated successfully");
      },
      onError: (errors) => {
        toast.error("Failed to update settings");
        console.error(errors);
      },
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(route("admin.settings.export"));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "settings.json";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Settings exported successfully");
    } catch (error) {
      toast.error("Failed to export settings");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append("settings", file);

    try {
      const response = await fetch(route("admin.settings.import"), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Import failed");

      toast.success("Settings imported successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to import settings");
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  const renderField = (key, field) => {
    const value = data[key];
    const commonProps = {
      id: key,
      disabled: processing,
      "aria-label": key.split("_").join(" "),
    };

    switch (field.type) {
      case "text":
      case "email":
      case "url":
        return (
          <Input
            {...commonProps}
            type={field.type}
            value={value || ""}
            onChange={(e) => setData(key, e.target.value)}
          />
        );

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            value={value || ""}
            onChange={(e) => setData(key, e.target.value)}
          />
        );

      case "number":
        return (
          <Input
            {...commonProps}
            type="number"
            value={value || ""}
            onChange={(e) => setData(key, e.target.value)}
          />
        );

      case "boolean":
        return (
          <Switch
            {...commonProps}
            checked={value || false}
            onCheckedChange={(checked) => setData(key, checked)}
          />
        );

      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(value) => setData(key, value)}
            disabled={processing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(field.options).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "image":
        return (
          <ImageUpload
            currentImage={value}
            onImageChange={(file) => setData(key, file)}
            disabled={processing}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <Head title="Settings" />

      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting || processing}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => document.getElementById("import-file").click()}
                disabled={isImporting || processing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <input
                type="file"
                id="import-file"
                className="hidden"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting || processing}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Manage Settings</CardTitle>
              <CardDescription>
                Configure your application settings. Changes will be applied immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-6 gap-4 mb-8">
                  {Object.keys(structure).map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="capitalize"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(structure).map(([category, fields]) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid gap-6">
                      {Object.entries(fields).map(([key, field]) => (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={key} className="capitalize">
                            {key.split("_").join(" ")}
                          </Label>
                          {renderField(key, field)}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex justify-end mt-6">
                <Button type="submit" disabled={processing}>
                  <Save className="w-4 h-4 mr-2" />
                  {processing ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
} 