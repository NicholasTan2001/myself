"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

export default function Chart({ todos, checkedItems }) {

    const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

    const totalTasks = todos.length;
    const completedTasks = Object.values(checkedItems).filter(Boolean).length;

    const series = todos.map(() => 1);
    const labels = todos.map((t) => t.name);
    const colors = todos.map((_, index) =>
        checkedItems[index] ? "#f08686ff" : "#bbc1caff"
    );

    const options = {
        chart: {
            type: "pie",
            height: 500,
        },
        labels,
        colors,
        legend: {
            position: "bottom",
            fontWeight: "600",

        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: "12px",
                fontWeight: "600",
            },
            formatter: (_, opts) => {
                const label = opts.w.globals.labels[opts.seriesIndex];
                return label;
            },
        },
        tooltip: {
            y: {
                formatter: (_, opts) => (checkedItems[opts.seriesIndex] ? "Completed" : "Not Completed")
            },
        },
        fill: { type: "solid", opacity: 1 },
        plotOptions: { pie: { expandOnClick: true } },
        states: {
            normal: { filter: { type: "none" } },
            hover: { filter: { type: "darken", value: 0.6 } },
            active: { filter: { type: "darken", value: 0.8 } },
        },
        dropShadow: { enabled: true, top: 4, left: 3, blur: 8, color: "#000", opacity: 0.25 },
    };

    return (
        <>
            {totalTasks > 0 ? (
                <div className="w-full mt-3 bg-white ">
                    <div className="">

                        <ReactApexChart
                            options={options}
                            series={series}
                            type="pie"
                            height="200%"
                        />
                    </div>
                    {/* Completed Summary */}
                    <div className="mt-3">
                        <p className="flex justify-end font-semibold text-black">
                            Completed (
                            {totalTasks > 0
                                ? Math.round((completedTasks / totalTasks) * 100)
                                : 0}
                            %)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-full mt-5">
                    <div className="flex justify-center">
                        <Image
                            src="/notask.png"
                            alt="No tasks"
                            width={120}
                            height={120}
                            className="opacity-80"
                        />
                    </div>
                    <p className="text-gray-400 font-semibold text-center">
                        No tasks available today.
                    </p>
                    <p className=" text-right font-semibold text-black mt-5">
                        Completed: (0%)
                    </p>
                </div >

            )
            }
        </>
    );
}
