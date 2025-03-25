"use client";

import { ResponsiveFunnel } from "@nivo/funnel";

interface FunnelChartProps {
  data: { id: string; value: number; label: string }[];
}

const FunnelChart = ({ data }: FunnelChartProps) => {
  console.log("📊 Datos recibidos en FunnelChart:", data);

  if (!data || data.length === 0) {
    return <div>No hay datos para mostrar</div>;
  }

  return (
    <div className="w-[500px] h-[400px]">
      <ResponsiveFunnel
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        colors={{ scheme: "spectral" }}
        borderWidth={20}
        labelColor={{ from: "color", modifiers: [["darker", 1.2]] }}
        beforeSeparatorLength={100}
        afterSeparatorLength={100}
        afterSeparatorOffset={20}
        currentPartSizeExtension={10}
        currentBorderWidth={40}
        motionConfig="wobbly"
        theme={{
          labels: {
            text: {
              fontSize: 14,
              fill: "#333",
            },
          },
          tooltip: {
            container: {
              background: "#9c10f7",
              color: "#fff",
              borderRadius: "5px",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
      />
    </div>
  );
};


export default FunnelChart;