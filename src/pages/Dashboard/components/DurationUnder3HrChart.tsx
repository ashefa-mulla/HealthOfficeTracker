import React, { useState } from 'react';
import { Below3HrEmpDuration } from '@/types/dashboard/dashboard.types';

interface Props {
  data: Below3HrEmpDuration[];
  dateTitle?: string;
}

const BAR_COLORS = [
  '#4CAF50',
  '#2196F3',
  '#FF9800',
  '#9C27B0',
  '#F44336',
  '#3F51B5',
  '#00BCD4',
  '#8BC34A',
  '#FFC107',
  '#E91E63',
  '#009688',
  '#673AB7',
  '#795548',
  '#607D8B',
  '#CDDC39',
];

const getTotalHours = (durationStr: string): number => {
  if (!durationStr) return 0;
  const hrMatch = durationStr.match(/(\d+)\s*hr/i);
  const minMatch = durationStr.match(/(\d+)\s*min/i);
  const secMatch = durationStr.match(/(\d+)\s*sec/i);

  const hours = hrMatch ? parseInt(hrMatch[1], 10) : 0;
  const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
  const seconds = secMatch ? parseInt(secMatch[1], 10) : 0;

  return hours + minutes / 60 + seconds / 3600;
};

const formatHoursToHHMM = (hours: number): string => {
  if (hours == null || isNaN(hours)) return '0:00';
  const totalMinutes = Math.round(hours * 60);
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  return `${hh}:${mm.toString().padStart(2, '0')}`;
};

export const DurationUnder3HrChart: React.FC<Props> = ({ data, dateTitle }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return null;
  }

  // Parse and sort by hours ascending
  const chartData = data
    .map((item, idx) => {
      const hours = getTotalHours(item.total_Duration);
      return {
        id: item.id || idx,
        name: (item.name || 'User').split(' ')[0].trim(),
        fullName: item.name || 'User',
        hours,
        rawDuration: item.total_Duration,
      };
    })
    .sort((a, b) => a.hours - b.hours);

  const maxVal = Math.max(3, ...chartData.map((d) => d.hours));
  const padding = { top: 35, right: 25, bottom: 65, left: 45 };
  const totalWidth = Math.max(400, chartData.length * 60 + padding.left + padding.right);
  const height = 330;
  const plotWidth = totalWidth - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const yTicks = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, Math.ceil(maxVal)];
  const distinctYTicks = Array.from(new Set(yTicks.filter((y) => y <= maxVal + 0.5))).sort(
    (a, b) => a - b
  );

  const columnWidth = plotWidth / chartData.length;
  const barWidth = Math.min(38, columnWidth * 0.55);

  return (
    <div className="w-100 overflow-hidden">
      <div className="mb-2 text-center">
        <h5 className="fw-bold text-dark mb-1 fs-6">
          Who Logged Under 3 Hours {dateTitle ? `— ${dateTitle}` : ''}
        </h5>
        <div className="text-muted small" style={{ fontSize: '11px' }}>
          Daily logged duration below minimum threshold (3 Hours)
        </div>
      </div>

      <div style={{ overflowX: 'auto', width: '100%' }}>
        <svg
          viewBox={`0 0 ${totalWidth} ${height}`}
          style={{ minWidth: totalWidth, width: '100%', height: height, display: 'block' }}
        >
          {/* Y Axis Grid Lines */}
          {distinctYTicks.map((tickVal) => {
            const y = padding.top + plotHeight - (tickVal / maxVal) * plotHeight;
            return (
              <g key={`duration-ytick-${tickVal}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={totalWidth - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={10}
                  fill="#64748b"
                  fontWeight="500"
                >
                  {tickVal.toFixed(1)}h
                </text>
              </g>
            );
          })}

          {/* Y Axis Label */}
          <text
            x={-height / 2 + 10}
            y={12}
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize={11}
            fill="#475569"
            fontWeight="600"
          >
            Duration (Hours)
          </text>

          {/* Bars */}
          {chartData.map((item, idx) => {
            const centerX = padding.left + idx * columnWidth + columnWidth / 2;
            const barHeight = maxVal > 0 ? (item.hours / maxVal) * plotHeight : 0;
            const posX = centerX - barWidth / 2;
            const posY = padding.top + plotHeight - barHeight;
            const barColor = BAR_COLORS[idx % BAR_COLORS.length];
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={`duration-bar-${item.id}-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Background column highlight */}
                {isHovered && (
                  <rect
                    x={centerX - columnWidth / 2 + 2}
                    y={padding.top}
                    width={columnWidth - 4}
                    height={plotHeight}
                    fill="#f8fafc"
                    opacity={0.8}
                    rx={4}
                  />
                )}

                {/* Column Bar */}
                <rect
                  x={posX}
                  y={posY}
                  width={barWidth}
                  height={Math.max(3, barHeight)}
                  fill={barColor}
                  rx={4}
                  style={{
                    transition: 'all 0.25s ease',
                    opacity: isHovered ? 1 : 0.9,
                    filter: isHovered ? `drop-shadow(0 4px 8px ${barColor}66)` : 'none',
                  }}
                />

                {/* Label on Top of Bar (HH:mm) */}
                <text
                  x={centerX}
                  y={posY - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight="bold"
                  fill="#1e293b"
                >
                  {formatHoursToHHMM(item.hours)}
                </text>

                {/* Employee Name (Rotated 35deg) */}
                <text
                  x={centerX}
                  y={padding.top + plotHeight + 12}
                  transform={`rotate(35, ${centerX}, ${padding.top + plotHeight + 12})`}
                  textAnchor="start"
                  fontSize={10}
                  fontWeight={isHovered ? '700' : '600'}
                  fill={isHovered ? '#0f172a' : '#475569'}
                >
                  {item.name}
                </text>

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={centerX - 65}
                      y={posY - 48}
                      width={130}
                      height={38}
                      rx={6}
                      fill="#0f172a"
                      opacity={0.95}
                    />
                    <text
                      x={centerX}
                      y={posY - 34}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={10}
                      fontWeight="bold"
                    >
                      {item.fullName}
                    </text>
                    <text
                      x={centerX}
                      y={posY - 20}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize={9.5}
                      fontWeight="600"
                    >
                      Duration: {formatHoursToHHMM(item.hours)}
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

export default DurationUnder3HrChart;
