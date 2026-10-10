"use client";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

export function SankeyChart({ lang }: { lang: string }) {
  const option = useMemo(() => ({
    tooltip: { trigger: "item" },
    series: {
      type: "sankey",
      data: [
        { name: lang === "ar" ? "رأس المال الكلي" : "Total Capital", itemStyle: { color: "#0F5132" } },
        { name: lang === "ar" ? "العتاد" : "Hardware", itemStyle: { color: "#D4AF37" } },
        { name: lang === "ar" ? "الاشتراكات" : "Subscriptions", itemStyle: { color: "#F97316" } },
        { name: lang === "ar" ? "البحث والتطوير" : "R&D", itemStyle: { color: "#3B82F6" } },
        { name: lang === "ar" ? "التسويق" : "Marketing", itemStyle: { color: "#8B5CF6" } },
      ],
      links: [
        { source: lang === "ar" ? "رأس المال الكلي" : "Total Capital", target: lang === "ar" ? "العتاد" : "Hardware", value: 45 },
        { source: lang === "ar" ? "رأس المال الكلي" : "Total Capital", target: lang === "ar" ? "الاشتراكات" : "Subscriptions", value: 20 },
        { source: lang === "ar" ? "رأس المال الكلي" : "Total Capital", target: lang === "ar" ? "البحث والتطوير" : "R&D", value: 20 },
        { source: lang === "ar" ? "رأس المال الكلي" : "Total Capital", target: lang === "ar" ? "التسويق" : "Marketing", value: 15 },
      ],
      lineStyle: { curveness: 0.5 },
    },
  }), [lang]);
  return <ReactECharts option={option} style={{ height: "500px" }} />;
}

export function TreemapChart({ lang }: { lang: string }) {
  const option = useMemo(() => ({
    series: {
      type: "treemap",
      data: [
        { name: lang === "ar" ? "العتاد" : "Hardware", value: 45, itemStyle: { color: "#0F5132" } },
        { name: lang === "ar" ? "الاشتراكات" : "Subscriptions", value: 20, itemStyle: { color: "#D4AF37" } },
        { name: lang === "ar" ? "البحث والتطوير" : "R&D", value: 20, itemStyle: { color: "#3B82F6" } },
        { name: lang === "ar" ? "التسويق" : "Marketing", value: 15, itemStyle: { color: "#8B5CF6" } },
      ],
      label: { show: true, formatter: "{b}\n{c}%", color: "#fff" },
    },
  }), [lang]);
  return <ReactECharts option={option} style={{ height: "500px" }} />;
}

export function SunburstChart({ lang }: { lang: string }) {
  const option = useMemo(() => ({
    series: {
      type: "sunburst",
      data: [{
        name: lang === "ar" ? "الميزانية" : "Budget",
        children: [
          { name: lang === "ar" ? "العتاد" : "Hardware", value: 45, itemStyle: { color: "#0F5132" } },
          { name: lang === "ar" ? "اشتراكات" : "Subscriptions", value: 20, itemStyle: { color: "#D4AF37" } },
          { name: lang === "ar" ? "بحث وتطوير" : "R&D", value: 20, itemStyle: { color: "#3B82F6" } },
          { name: lang === "ar" ? "تسويق" : "Marketing", value: 15, itemStyle: { color: "#8B5CF6" } },
        ],
      }],
      radius: ["0%", "90%"],
    },
  }), [lang]);
  return <ReactECharts option={option} style={{ height: "500px" }} />;
}

export function RadarChart({ lang }: { lang: string }) {
  const option = useMemo(() => ({
    radar: {
      indicator: [
        { name: lang === "ar" ? "البحث والتطوير" : "R&D", max: 100 },
        { name: lang === "ar" ? "التسويق" : "Marketing", max: 100 },
        { name: lang === "ar" ? "العتاد" : "Hardware", max: 100 },
        { name: lang === "ar" ? "الفريق" : "Team", max: 100 },
        { name: lang === "ar" ? "التمويل" : "Funding", max: 100 },
      ],
    },
    series: [{
      type: "radar",
      data: [
        { value: [85, 75, 90, 70, 80], name: "Seen", areaStyle: { color: "rgba(15,81,50,0.3)" } },
        { value: [70, 80, 75, 85, 70], name: lang === "ar" ? "المنافسون" : "Competitors", lineStyle: { type: "dashed" } },
      ],
    }],
  }), [lang]);
  return <ReactECharts option={option} style={{ height: "400px" }} />;
}

export function BubbleChart({ lang }: { lang: string }) {
  const option = useMemo(() => ({
    xAxis: { name: lang === "ar" ? "الاستثمار ($K)" : "Investment ($K)", type: "value" },
    yAxis: { name: lang === "ar" ? "العائد ($K)" : "ROI ($K)", type: "value" },
    series: [{
      type: "scatter",
      symbolSize: (d: any) => Math.sqrt(d[2]) * 3,
      data: [[15, 22, 22, "2026"], [45, 85, 85, "2027"], [90, 180, 180, "2028"]],
      itemStyle: { color: "#0F5132" },
    }],
  }), [lang]);
  return <ReactECharts option={option} style={{ height: "400px" }} />;
}

export function GanttChart({ lang }: { lang: string }) {
  const option = useMemo(() => ({
    xAxis: { type: "category", data: ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"] },
    yAxis: { type: "category", data: [lang === "ar" ? "العتاد" : "Hardware", lang === "ar" ? "الاشتراكات" : "Subscriptions", lang === "ar" ? "R&D" : "R&D", lang === "ar" ? "التسويق" : "Marketing"] },
    series: [{ type: "bar", data: [[100,0,0,0],[0,100,100,100],[0,0,100,100],[0,0,0,100]], itemStyle: { color: "#0F5132" } }],
  }), [lang]);
  return <ReactECharts option={option} style={{ height: "300px" }} />;
}

export function ChordDiagram({ lang }: { lang: string }) {
  const option = useMemo(() => ({
    series: [{
      type: "graph",
      layout: "circular",
      data: [
        { name: lang === "ar" ? "البحث والتطوير" : "R&D", value: 20, itemStyle: { color: "#3B82F6" } },
        { name: lang === "ar" ? "التسويق" : "Marketing", value: 15, itemStyle: { color: "#8B5CF6" } },
        { name: lang === "ar" ? "العتاد" : "Hardware", value: 45, itemStyle: { color: "#0F5132" } },
        { name: lang === "ar" ? "الاشتراكات" : "Subscriptions", value: 20, itemStyle: { color: "#D4AF37" } },
      ],
      links: [{ source: 0, target: 2, value: 10 }, { source: 0, target: 3, value: 8 }, { source: 1, target: 2, value: 5 }, { source: 1, target: 3, value: 7 }],
      emphasis: { focus: "adjacency" },
    }],
  }), [lang]);
  return <ReactECharts option={option} style={{ height: "400px" }} />;
        }
