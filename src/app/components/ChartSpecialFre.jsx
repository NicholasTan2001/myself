"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ChartSpecialFre({ fromDate, toDate }) {

    {/* Special To-Do List Frequency Chart */ }
    const [chartData, setChartData] = useState({
        series: [{ name: "Task Completion (%)", data: [] }],
        options: {
            chart: {
                type: "area",
                height: 200,
                toolbar: { show: false },
                zoom: { enabled: true },
                background: "#ffffffff",
            },
            stroke: {
                curve: "smooth",
                width: 4,
                colors: ["#7badf7ff"],
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 100],
                    colorStops: [
                        {
                            offset: 0,
                            color: "#0a66fcff",
                            opacity: 0.6,
                        },
                        {
                            offset: 100,
                            color: "#acc0efff",
                            opacity: 0.1,
                        },
                    ],
                },
            },
            grid: { show: false },
            xaxis: {
                categories: [],
                labels: {
                    rotate: -45,
                    style: { colors: "#000000ff", fontWeight: 600, fontSize: "11px" },
                    offsetX: 3,
                },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: {
                min: 0,
                max: 100,
                labels: {
                    show: true,
                    formatter: (val) => `${val}%`,
                    style: { colors: "#000000ff", fontWeight: 600, fontSize: "11px" },
                },
            },
            dataLabels: { enabled: false },
            tooltip: {
                theme: "dark",
                y: { formatter: (val) => `${val}% completed` },
            },
        },
    });

    {/* Effect: get the data from specialfrerecord api */ }
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/specialfrerecord");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);

                const from = new Date(fromDate);
                const to = new Date(toDate);

                const days = [];
                for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
                    days.push(d.toISOString().split("T")[0]);
                }

                const percentageMap = {};
                data.data.forEach((d) => {
                    percentageMap[d.date] = d.percentage;
                });

                const percentages = days.map((day) => percentageMap[day] || 0);

                setChartData((prev) => ({
                    ...prev,
                    series: [{ name: "Task Completion (%)", data: percentages }],
                    options: {
                        ...prev.options,
                        xaxis: { ...prev.options.xaxis, categories: days },
                    },
                }));
            } catch (err) {
                console.error("Error fetching chart data:", err);
            }
        }

        fetchData();
    }, [fromDate, toDate]);

    return (
        <div className="w-full text-sm lg:text-base">

            {/* Chart */}
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height={200}
            />
        </div>
    );
}
