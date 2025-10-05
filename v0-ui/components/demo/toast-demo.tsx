"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ToastIcons } from "@/components/ui/toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle, Download, Upload, Trash2, Settings } from "lucide-react";

export function ToastDemo() {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      title: "Security scan completed",
      description: "All vulnerabilities have been identified and documented.",
      variant: "success",
      icon: ToastIcons.success,
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Scan failed",
      description: "Unable to connect to the MCP server. Please check your connection.",
      variant: "destructive",
      icon: ToastIcons.error,
    });
  };

  const showWarningToast = () => {
    toast({
      title: "High risk detected",
      description: "Critical vulnerabilities found that require immediate attention.",
      variant: "warning",
      icon: ToastIcons.warning,
    });
  };

  const showInfoToast = () => {
    toast({
      title: "New update available",
      description: "Version 2.1.0 includes enhanced security features and bug fixes.",
      variant: "info",
      icon: ToastIcons.info,
    });
  };

  const showActionToast = () => {
    toast({
      title: "Export completed",
      description: "Your security report has been generated successfully.",
      variant: "success",
      icon: <Download className="h-5 w-5 text-green-600 dark:text-green-400" />,
      action: (
        <Button variant="outline" size="sm" className="ml-2">
          Download
        </Button>
      ),
    });
  };

  const showMultipleToasts = () => {
    toast({
      title: "Starting scan...",
      description: "Initializing security assessment",
      variant: "info",
      icon: ToastIcons.info,
    });
    setTimeout(() => {
      toast({
        title: "Warning detected",
        description: "Medium risk vulnerability found",
        variant: "warning",
        icon: ToastIcons.warning,
      });
    }, 1000);
    setTimeout(() => {
      toast({
        title: "Scan complete",
        description: "Assessment finished successfully",
        variant: "success",
        icon: ToastIcons.success,
      });
    }, 2000);
  };

  const showLongToast = () => {
    toast({
      title: "Comprehensive security analysis in progress",
      description: "This process may take several minutes as we analyze your MCP configuration, check for known vulnerabilities, validate authentication mechanisms, review access controls, and generate a detailed security report with actionable recommendations.",
      variant: "info",
      icon: ToastIcons.info,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Toast Notifications
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience smooth, animated toast notifications with different variants and interactive elements.
          </p>
        </motion.div>

        {/* Basic Toast Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Success Toast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={showSuccessToast} className="w-full">
                Show Success
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Error Toast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={showErrorToast} className="w-full bg-red-600 hover:bg-red-700 text-white">
                Show Error
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Warning Toast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={showWarningToast} variant="outline" className="w-full">
                Show Warning
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Info Toast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={showInfoToast} variant="secondary" className="w-full">
                Show Info
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Advanced Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                Action Toast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={showActionToast} variant="outline" className="w-full">
                Show with Action
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Multiple Toasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={showMultipleToasts} variant="secondary" className="w-full">
                Show Sequence
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-gray-600" />
                Long Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={showLongToast} variant="outline" className="w-full">
                Show Long Toast
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: "Smooth Animations",
              description: "Spring-based animations with smooth entrance and exit transitions."
            },
            {
              title: "Multiple Variants", 
              description: "Success, error, warning, and info variants with appropriate styling."
            },
            {
              title: "Interactive Actions",
              description: "Support for action buttons and custom interactive elements."
            },
            {
              title: "Auto Dismiss",
              description: "Configurable auto-dismiss timing with manual close options."
            }
          ].map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Usage Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Basic Usage:</h4>
                <code className="text-sm">
                  {`createToast.success("Success!", "Operation completed successfully");`}
                </code>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">With Action:</h4>
                <code className="text-sm">
                  {`toast({ title: "Export ready", action: <Button>Download</Button> });`}
                </code>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
