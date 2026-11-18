import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FolderTree,
  RefreshCw,
  Table,
  X,
} from 'lucide-react';
import { listArchivesFromFirestore, TEACHER_ARCHIVE_EMAIL } from '../services/firebase';
import type { ArchiveSubmission } from '../types/game';

interface TeacherArchiveModalProps {
  open: boolean;
  onClose: () => void;
}

function csvCell(v: string | number): string {
  const s = String(v ?? '');
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export const TeacherArchiveModal: React.FC<TeacherArchiveModalProps> = ({ open, onClose }) => {
  const [items, setItems] = useState<ArchiveSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'sheet' | 'folders'>('sheet');
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const loadArchives = async () => {
    setLoading(true);
    try {
      const [serverRes, firestoreItems] = await Promise.all([
        fetch('/api/archive').then((r) => (r.ok ? r.json() : { items: [] })),
        listArchivesFromFirestore().catch(() => [] as ArchiveSubmission[]),
      ]);

      const mergedMap = new Map<string, ArchiveSubmission>();
      for (const it of [...(serverRes.items || []), ...firestoreItems]) {
        mergedMap.set(it.archiveId, it);
      }
      const list = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadArchives();
    }
  }, [open]);

  if (!open) return null;

  const handleDownloadCsv = () => {
    const rows = [
      ['Tanggal', 'Sekolah', 'Kelas', 'Nama Siswa', 'Bab', 'Materi', 'Skor PG', 'Total Soal', 'Refleksi Siswa', 'Tautan Google Sheet'],
      ...items.map((it) => [
        new Date(it.createdAt).toLocaleString('id-ID'),
        it.school,
        it.className,
        it.studentName,
        `Bab ${it.chapterId}`,
        it.chapterTitle,
        it.mcqScore,
        it.mcqTotal,
        it.essayAnswer || '',
        it.driveLink || '',
      ]),
    ];
    const csv = '\uFEFF' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Arsip_Refleksi_TKA_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const schools = Array.from(new Set(items.map((i) => i.school))).sort();
  const classes = selectedSchool
    ? Array.from(new Set(items.filter((i) => i.school === selectedSchool).map((i) => i.className))).sort()
    : [];
  const students =
    selectedSchool && selectedClass
      ? Array.from(
          new Set(
            items
              .filter((i) => i.school === selectedSchool && i.className === selectedClass)
              .map((i) => i.studentName)
          )
        ).sort()
      : [];
  const chapterRecords =
    selectedSchool && selectedClass && selectedStudent
      ? items
          .filter(
            (i) =>
              i.school === selectedSchool &&
              i.className === selectedClass &&
              i.studentName === selectedStudent
          )
          .sort((a, b) => a.chapterId - b.chapterId)
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75">
      <div className="w-full max-w-5xl h-[90dvh] rounded-2xl bg-slate-900 border border-white/15 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
              <h2 className="text-base font-bold text-white truncate">
                Sheet Arsip Guru & Admin ({TEACHER_ARCHIVE_EMAIL})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rekap otomatis refleksi siswa & skor bab tersusun rapi sebagai spreadsheet
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {items.length > 0 && (
              <button
                onClick={handleDownloadCsv}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Sheet (.CSV)
              </button>
            )}
            <button
              onClick={loadArchives}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              aria-label="Muat ulang arsip"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Tutup arsip guru"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="px-5 py-2.5 border-b border-white/10 bg-slate-900 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('sheet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                viewMode === 'sheet'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Tampilan Sheet ({items.length})
            </button>
            <button
              onClick={() => setViewMode('folders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                viewMode === 'folders'
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              Folder Sekolah & Kelas
            </button>
          </div>
        </div>

        {/* Folder Breadcrumb */}
        {viewMode === 'folders' && (
          <div className="px-5 py-2 border-b border-white/10 bg-slate-950/40 flex items-center gap-1.5 text-xs overflow-x-auto">
            <button
              onClick={() => {
                setSelectedSchool(null);
                setSelectedClass(null);
                setSelectedStudent(null);
              }}
              className="text-sky-300 hover:underline font-semibold shrink-0"
            >
              Semua Sekolah ({schools.length})
            </button>
            {selectedSchool && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <button
                  onClick={() => {
                    setSelectedClass(null);
                    setSelectedStudent(null);
                  }}
                  className="text-sky-300 hover:underline font-semibold shrink-0"
                >
                  {selectedSchool}
                </button>
              </>
            )}
            {selectedClass && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-sky-300 hover:underline font-semibold shrink-0"
                >
                  {selectedClass}
                </button>
              </>
            )}
            {selectedStudent && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-white font-bold shrink-0">{selectedStudent}</span>
              </>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-5">
          {items.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-slate-800/50 border border-white/10">
              <p className="text-sm font-semibold text-slate-200">
                Belum ada kiriman refleksi siswa yang masuk.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Setiap refleksi dan skor bab yang dikirim siswa otomatis masuk ke spreadsheet arsip {TEACHER_ARCHIVE_EMAIL}.
              </p>
            </div>
          ) : viewMode === 'sheet' ? (
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-slate-200 border-b border-white/10">
                    <th className="py-2.5 px-3 font-bold">Siswa</th>
                    <th className="py-2.5 px-3 font-bold">Sekolah / Kelas</th>
                    <th className="py-2.5 px-3 font-bold">Bab</th>
                    <th className="py-2.5 px-3 font-bold">Skor PG</th>
                    <th className="py-2.5 px-3 font-bold min-w-[220px]">Refleksi Siswa</th>
                    <th className="py-2.5 px-3 font-bold">Google Sheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {items.map((rec) => (
                    <tr key={rec.archiveId} className="hover:bg-slate-800/40 align-top">
                      <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                        {rec.studentName}
                        <div className="font-mono-tabular text-[10px] text-slate-400">
                          {new Date(rec.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        <div>{rec.school}</div>
                        <div className="text-[11px] text-sky-300">{rec.className}</div>
                      </td>
                      <td className="py-2.5 px-3 text-amber-300 font-semibold whitespace-nowrap">
                        Bab {rec.chapterId}
                      </td>
                      <td className="py-2.5 px-3 font-mono-tabular font-bold text-emerald-300 whitespace-nowrap">
                        {rec.mcqScore}/{rec.mcqTotal}
                      </td>
                      <td className="py-2.5 px-3 text-slate-200 whitespace-pre-line max-w-xs">
                        {rec.essayAnswer || <span className="text-slate-500">(Kosong)</span>}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {rec.driveLink ? (
                          <a
                            href={rec.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-300 hover:underline font-semibold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Buka Sheet
                          </a>
                        ) : (
                          <span className="text-slate-500">Arsip Server</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : !selectedSchool ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {schools.map((sch) => {
                const count = items.filter((i) => i.school === sch).length;
                return (
                  <button
                    key={sch}
                    onClick={() => setSelectedSchool(sch)}
                    className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-left transition-colors"
                  >
                    <p className="text-sm font-bold text-white truncate">{sch}</p>
                    <p className="font-mono-tabular text-xs text-slate-400 mt-1">{count} kiriman sheet</p>
                  </button>
                );
              })}
            </div>
          ) : !selectedClass ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {classes.map((cls) => {
                const count = items.filter(
                  (i) => i.school === selectedSchool && i.className === cls
                ).length;
                return (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-left transition-colors"
                  >
                    <p className="text-sm font-bold text-white truncate">Kelas {cls}</p>
                    <p className="font-mono-tabular text-xs text-slate-400 mt-1">{count} kiriman sheet</p>
                  </button>
                );
              })}
            </div>
          ) : !selectedStudent ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {students.map((stu) => {
                const count = items.filter(
                  (i) =>
                    i.school === selectedSchool &&
                    i.className === selectedClass &&
                    i.studentName === stu
                ).length;
                return (
                  <button
                    key={stu}
                    onClick={() => setSelectedStudent(stu)}
                    className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-left transition-colors"
                  >
                    <p className="text-sm font-bold text-white truncate">{stu}</p>
                    <p className="font-mono-tabular text-xs text-emerald-300 mt-1">{count} bab dikumpulkan</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {chapterRecords.map((rec) => (
                <div
                  key={rec.archiveId}
                  className="p-4 rounded-xl bg-slate-800/80 border border-white/10 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-amber-300">
                        Bab {rec.chapterId} — {rec.chapterTitle}
                      </p>
                      <p className="font-mono-tabular text-xs text-slate-400">
                        {new Date(rec.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <span className="font-mono-tabular text-sm font-bold text-emerald-300">
                      Skor PG: {rec.mcqScore} / {rec.mcqTotal}
                    </span>
                  </div>

                  {rec.essayAnswer && (
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 text-xs text-slate-200 whitespace-pre-line">
                      <span className="font-semibold text-slate-400 block mb-1">Refleksi Siswa:</span>
                      {rec.essayAnswer}
                    </div>
                  )}

                  {rec.driveLink && (
                    <a
                      href={rec.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Buka Google Sheet Siswa
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
