"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface PriceChartProps {
  symbol: string
}

export default function PriceChart({ symbol }: PriceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    const createChart = async () => {
      if (!chartRef.current) return

      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Mock data for the chart
      const mockData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: `${symbol} Price`,
            data: [33, 53, 85, 41, 44, 65, 80, 67, 56, 89, 76, 92],
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      }

      const ctx = chartRef.current.getContext("2d")
      if (!ctx) return

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: mockData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        },
      })
    }

    createChart()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [symbol])

  return <canvas ref={chartRef} />
}
