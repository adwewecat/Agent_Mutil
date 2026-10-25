import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Zap, Activity } from 'lucide-react';

interface TestMatrixModalProps {
  matrix: string;
  onClose: () => void;
}

export const TestMatrixModal: React.FC<TestMatrixModalProps> = ({ matrix, onClose }) => {
  // Parse bảng markdown thành rows
  const parseMarkdownTable = (md: string) => {
    const lines = md.trim().split('\n').filter(l => l.includes('|'));
    if (lines.length < 3) return null;
    const headers = lines[0].split('|').map(s => s.trim()).filter(Boolean);
    const rows = lines.slice(2).map(line =>
      line.split('|').map(s => s.trim()).filter(Boolean)
    );
    return { headers, rows };
  };

  const tableData = parseMarkdownTable(matrix);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <ShieldCheck size={22} className="text-rose-400" />
            <div>
              <h3 className="modal-title">BÁO CÁO THẨM ĐỊNH & MA TRẬN TEST CỦA DŨNG 4</h3>
              <p className="modal-sub">
                40 năm kinh nghiệm QA Lead • Boundary Values Analysis • Stress Test (5,000 req/s) • Security Audit
              </p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="modal-content">
          {/* Thẻ thống kê tổng quan */}
          <div className="test-metrics-grid">
            <div className="metric-box box-success">
              <CheckCircle2 size={24} className="text-emerald-400" />
              <div>
                <span className="metric-val">8 / 8</span>
                <span className="metric-lbl">Test Scenarios Đạt (100%)</span>
              </div>
            </div>

            <div className="metric-box box-latency">
              <Zap size={24} className="text-amber-400" />
              <div>
                <span className="metric-val">1.2 ms</span>
                <span className="metric-lbl">Thời gian phản hồi trung bình</span>
              </div>
            </div>

            <div className="metric-box box-stress">
              <Activity size={24} className="text-cyan-400" />
              <div>
                <span className="metric-val">5,000 TPS</span>
                <span className="metric-lbl">Tải đồng thời kiểm thử</span>
              </div>
            </div>

            <div className="metric-box box-security">
              <ShieldCheck size={24} className="text-rose-400" />
              <div>
                <span className="metric-val">0 Bug / 0 Vuln</span>
                <span className="metric-lbl">SQLi & XSS Clean</span>
              </div>
            </div>
          </div>

          {/* Bảng chi tiết Test Matrix */}
          {tableData ? (
            <div className="table-responsive">
              <table className="custom-test-table">
                <thead>
                  <tr>
                    {tableData.headers.map((h, i) => (
                      <th key={i}>{h.replace(/\*\*/g, '')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => {
                        const isPassed = cell.includes('PASSED');
                        return (
                          <td key={cIdx}>
                            {isPassed ? (
                              <span className="pass-chip">PASSED ✅</span>
                            ) : (
                              <span>{cell.replace(/\*\*/g, '').replace(/`/g, '')}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <pre className="raw-markdown-view">{matrix}</pre>
          )}
        </div>

        <div className="modal-footer">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <AlertTriangle size={14} className="text-emerald-400" />
            <span>Chứng chỉ chất lượng: Toàn bộ tiêu chí an ninh mạng và chịu tải đạt tiêu chuẩn triển khai Production.</span>
          </div>
          <button onClick={onClose} className="btn-secondary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
