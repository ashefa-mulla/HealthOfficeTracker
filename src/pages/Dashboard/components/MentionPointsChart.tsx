import React, { useState } from 'react';
import { MentionPointsSummary } from '@/types/dashboard/dashboard.types';

interface Props {
  data: MentionPointsSummary[];
  dateRangeLabel?: string;
}

export const MentionPointsChart: React.FC<Props> = ({ data, dateRangeLabel }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="mdi mdi-chart-bar fs-2 text-muted mb-2 d-block"></i>
        <h5 className="fw-bold text-dark mb-1 fs-6">Feedback Summary</h5>
        <div className="small">No feedback mention points recorded for this period.</div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: (item.fullName || 'User').split(' ')[0],
    fullName: item.fullName || 'User',
    positive: Number(item.total_PositivePoints) || 0,
    negative: Number(item.total_NegativePoints) || 0,
  }));

  const maxVal = Math.max(
    5,
    ...chartData.map((d) => Math.max(d.positive, d.negative))
  );

  const padding = { top: 35, right: 25, bottom: 55, left: 45 };
  const totalWidth = Math.max(400, chartData.length * 65 + padding.left + padding.right);
  const height = 330;
  const plotWidth = totalWidth - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const yTicks = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), Math.ceil(maxVal)];
  const distinctYTicks = Array.from(new Set(yTicks)).sort((a, b) => a - b);

  const groupWidth = plotWidth / chartData.length;
  const barWidth = Math.min(22, groupWidth * 0.35);

  return (
    <div className="w-100 overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap ">
        <div>
          <h5 className="mb-0 text-dark fw-bold fs-6">Feedback Summary</h5>
          {dateRangeLabel && (
            <span className="text-primary small" style={{ fontSize: '11px' }}>
              {dateRangeLabel}
            </span>
          )}
        </div>
        <div className="d-flex align-items-center gap-2 small">
          <div className="d-flex align-items-center gap-1">
            <span
              style={{
                width: 10,
                height: 10,
                backgroundColor: '#FFA500',
                borderRadius: 2,
                display: 'inline-block',
              }}
            ></span>
            <span className="fw-semibold text-secondary" style={{ fontSize: '11px' }}>
              Positive
            </span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <span
              style={{
                width: 10,
                height: 10,
                backgroundColor: '#0080FF',
                borderRadius: 2,
                display: 'inline-block',
              }}
            ></span>
            <span className="fw-semibold text-secondary" style={{ fontSize: '11px' }}>
              Negative
            </span>
          </div>
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
              <g key={`y-grid-${tickVal}`}>
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
                  {tickVal}
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
            Points
          </text>

          {/* Bars */}
          {chartData.map((item, idx) => {
            const groupCenterX = padding.left + idx * groupWidth + groupWidth / 2;
            const posHeight = maxVal > 0 ? (item.positive / maxVal) * plotHeight : 0;
            const negHeight = maxVal > 0 ? (item.negative / maxVal) * plotHeight : 0;

            const posX = groupCenterX - barWidth - 2;
            const posY = padding.top + plotHeight - posHeight;

            const negX = groupCenterX + 2;
            const negY = padding.top + plotHeight - negHeight;

            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={`group-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Background hover highlight */}
                {isHovered && (
                  <rect
                    x={groupCenterX - groupWidth / 2 + 2}
                    y={padding.top}
                    width={groupWidth - 4}
                    height={plotHeight}
                    fill="#f1f5f9"
                    opacity={0.6}
                    rx={4}
                  />
                )}

                {/* Positive Bar (Orange) */}
                <rect
                  x={posX}
                  y={posY}
                  width={barWidth}
                  height={Math.max(2, posHeight)}
                  fill="#FFA500"
                  rx={3}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: isHovered ? 'drop-shadow(0 4px 6px rgba(255, 165, 0, 0.4))' : 'none',
                  }}
                />
                {item.positive > 0 && (
                  <text
                    x={posX + barWidth / 2}
                    y={posY - 5}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight="bold"
                    fill="#d97706"
                  >
                    +{item.positive}
                  </text>
                )}

                {/* Negative Bar (Blue) */}
                <rect
                  x={negX}
                  y={negY}
                  width={barWidth}
                  height={Math.max(2, negHeight)}
                  fill="#0080FF"
                  rx={3}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0, 128, 255, 0.4))' : 'none',
                  }}
                />
                {item.negative > 0 && (
                  <text
                    x={negX + barWidth / 2}
                    y={negY - 5}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight="bold"
                    fill="#0284c7"
                  >
                    -{item.negative}
                  </text>
                )}

                {/* Employee Name (X-Axis) */}
                <text
                  x={groupCenterX}
                  y={padding.top + plotHeight + 16}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={isHovered ? '700' : '600'}
                  fill={isHovered ? '#0f172a' : '#334155'}
                >
                  {item.name}
                </text>

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={groupCenterX - 60}
                      y={Math.min(posY, negY) - 45}
                      width={120}
                      height={36}
                      rx={6}
                      fill="#1e293b"
                      opacity={0.95}
                    />
                    <text
                      x={groupCenterX}
                      y={Math.min(posY, negY) - 30}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={10.5}
                      fontWeight="bold"
                    >
                      {item.fullName}
                    </text>
                    <text
                      x={groupCenterX}
                      y={Math.min(posY, negY) - 16}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize={9.5}
                    >
                      +{item.positive} Pos / -{item.negative} Neg
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

export default MentionPointsChart;
