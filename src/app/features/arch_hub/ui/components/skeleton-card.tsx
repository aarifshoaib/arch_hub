import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function SkeletonCard() {
  return (
    <Card className="w-full animate-pulse border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Owner Information */}
        <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div>
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex justify-between space-x-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div>
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        {/* Strategy */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
