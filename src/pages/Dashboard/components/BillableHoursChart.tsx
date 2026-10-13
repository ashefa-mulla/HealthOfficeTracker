import React, { useState } from 'react';
import { ClientProjectSummaryItem } from '@/types/dashboard/dashboard.types';

interface Props {
  data: ClientProjectSummaryItem[];
}

export const BillableHoursChart: React.FC<Props> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-muted bg-light rounded-3">
        No billable hours recorded for this client in the current month.
      </div>
    );
  }

  const chartData = data.map((item) => ({
    person: item.person || 'Member',
    billableHours: Number(item.billableHours) || 0,
    nonBillableHours: Number(item.nonBillableHours) || 0,
  }));

  const maxVal = Math.max(10, ...chartData.map((d) => d.billableHours));
  const padding = { top: 40, right: 30, bottom: 60, left: 60 };
  const totalWidth = Math.max(500, chartData.length * 85 + padding.left + padding.right);
  const height = 350;
  const plotWidth = totalWidth - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const yTicks = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), Math.ceil(maxVal)];
  const distinctYTicks = Array.from(new Set(yTicks)).sort((a, b) => a - b);
  const columnWidth = plotWidth / chartData.length;
  const barWidth = Math.min(45, columnWidth * 0.5);

  return (
    <div className="w-100 overflow-hidden">
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <svg
          viewBox={`0 0 ${totalWidth} ${height}`}
          style={{ minWidth: totalWidth, height: height, display: 'block' }}
        >
          {/* Y Grid Lines */}
          {distinctYTicks.map((tickVal) => {
            const y = padding.top + plotHeight - (tickVal / maxVal) * plotHeight;
            return (
              <g key={`billable-ytick-${tickVal}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={totalWidth - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill="#64748b"
                  fontWeight="500"
                >
                  {tickVal}h
                </text>
              </g>
            );
          })}

          {/* Y Axis Label */}
          <text
            x={-height / 2 + 10}
            y={16}
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize={12}
            fill="#475569"
            fontWeight="600"
          >
            Billable Hours
          </text>

          {/* Bars */}
          {chartData.map((item, idx) => {
            const centerX = padding.left + idx * columnWidth + columnWidth / 2;
            const barHeight = maxVal > 0 ? (item.billableHours / maxVal) * plotHeight : 0;
            const posX = centerX - barWidth / 2;
            const posY = padding.top + plotHeight - barHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={`billable-bar-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                {isHovered && (
                  <rect
                    x={centerX - columnWidth / 2 + 4}
                    y={padding.top}
                    width={columnWidth - 8}
                    height={plotHeight}
                    fill="#f0fdf4"
                    opacity={0.8}
                    rx={6}
                  />
                )}

                {/* Column */}
                <rect
                  x={posX}
                  y={posY}
                  width={barWidth}
                  height={Math.max(3, barHeight)}
                  fill="#10b981"
                  rx={5}
                  style={{
                    transition: 'all 0.25s ease',
                    opacity: isHovered ? 1 : 0.88,
                    filter: isHovered ? 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.4))' : 'none',
                  }}
                />

                {/* Label on top of column */}
                <text
                  x={centerX}
                  y={posY - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="bold"
                  fill="#065f46"
                >
                  {item.billableHours.toFixed(1)}
                </text>

                {/* Person Name */}
                <text
                  x={centerX}
                  y={padding.top + plotHeight + 20}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={isHovered ? '700' : '600'}
                  fill={isHovered ? '#0f172a' : '#475569'}
                >
                  {item.person}
                </text>

                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={centerX - 65}
                      y={posY - 50}
                      width={130}
                      height={40}
                      rx={6}
                      fill="#0f172a"
                      opacity={0.95}
                    />
                    <text
                      x={centerX}
                      y={posY - 34}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={11}
                      fontWeight="bold"
                    >
                      {item.person}
                    </text>
                    <text
                      x={centerX}
                      y={posY - 18}
                      textAnchor="middle"
                      fill="#34d399"
                      fontSize={10}
                    >
                      Billable: {item.billableHours}h | Non: {item.nonBillableHours}h
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* X Axis Line */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={totalWidth - padding.right}
            y2={padding.top + plotHeight}
            stroke="#cbd5e1"
            strokeWidth={1.5}
          />
        </svg>
      </div>
    </div>
  );
};

export default BillableHoursChart;
