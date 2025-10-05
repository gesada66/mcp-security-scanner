"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoadingCard, LoadingTable, LoadingSpinner, LoadingOverlay } from "@/components/ui/loading-states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateOverlayLoading = () => {
    setShowOverlay(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowOverlay(false), 500);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
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
            Loading State Animations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience smooth loading animations with skeleton screens, progress indicators, and overlay states.
          </p>
        </motion.div>

        {/* Demo Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4"
        >
          <Button onClick={simulateLoading} disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            {isLoading ? "Loading..." : "Simulate Loading"}
          </Button>
          <Button variant="outline" onClick={simulateOverlayLoading}>
            Show Overlay Loading
          </Button>
        </motion.div>

        {/* Loading Cards Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <LoadingCard 
            showProgress={isLoading}
            progressValue={progress}
            progressLabel="Loading security data..."
          />
          <LoadingCard 
            showProgress={isLoading}
            progressValue={progress}
            progressLabel="Analyzing threats..."
          />
          <LoadingCard 
            showProgress={isLoading}
            progressValue={progress}
            progressLabel="Generating report..."
          />
        </motion.div>

        {/* Loading Table Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Loading Table Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingTable rows={5} columns={4} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Spinner Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Small Spinner</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Medium Spinner</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <LoadingSpinner size="md" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Large Spinner</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: "Skeleton Screens",
              description: "Smooth placeholder animations that match your content structure."
            },
            {
              title: "Progress Indicators", 
              description: "Animated progress bars with smooth transitions and percentage display."
            },
            {
              title: "Loading Spinners",
              description: "Multiple sizes and styles for different loading contexts."
            },
            {
              title: "Overlay States",
              description: "Full-screen loading overlays with backdrop blur and cancellation options."
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
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={showOverlay}
        message="Processing security scan..."
        progress={progress}
        onCancel={() => setShowOverlay(false)}
      />
    </div>
  );
}
