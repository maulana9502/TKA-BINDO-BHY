import type { ChapterData, ChapterProgress, PlayerProfile } from '../types/game';
import { TEACHER_ARCHIVE_EMAIL } from './firebase';

interface DriveFileResult {
  id: string;
  name: string;
  webViewLink?: string;
}

function escapeCsvCell(value: string | number): string {
  const s = String(value ?? '');
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function findOrCreateFolder(
  accessToken: string,
  folderName: string,
  parentId?: string
): Promise<string> {
  const safeName = folderName.replace(/'/g, "\\'").trim() || 'Tanpa Nama';
  const parentQuery = parentId ? ` and '${parentId}' in parents` : '';
  const q = encodeURIComponent(
    `mimeType='application/vnd.google-apps.folder' and name='${safeName}' and trashed=false${parentQuery}`
  );

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&spaces=drive`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id as string;
    }
  }

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: safeName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : undefined,
    }),
  });
  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Gagal membuat folder Google Drive (${safeName}): ${errText}`);
  }
  const created = (await createRes.json()) as DriveFileResult;
  return created.id;
}

async function createGoogleSheetFromCsv(
  accessToken: string,
  sheetName: string,
  csvText: string,
  parentId: string
): Promise<DriveFileResult> {
  const metadata = {
    name: sheetName,
    mimeType: 'application/vnd.google-apps.spreadsheet',
    parents: [parentId],
  };

  const csvBlob = new Blob(['\uFEFF' + csvText], { type: 'text/csv;charset=utf-8' });
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', csvBlob);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gagal membuat Google Sheet di Drive: ${errText}`);
  }
  return (await res.json()) as DriveFileResult;
}

async function shareResourceWithTeacher(accessToken: string, fileId: string): Promise<void> {
  try {
    await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?sendNotificationEmail=false`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'user',
          emailAddress: TEACHER_ARCHIVE_EMAIL,
        }),
      }
    );
  } catch (err) {
    console.warn('Tidak dapat membagikan otomatis ke email guru:', err);
  }
}

export function buildChapterReflectionCsv(params: {
  profile: PlayerProfile;
  chapter: ChapterData;
  chapterProgress: ChapterProgress;
}): string {
  const { profile, chapter, chapterProgress } = params;
  const rows: (string | number)[][] = [
    ['LAPORAN REFLEKSI & HASIL BELAJAR TKA BAHASA INDONESIA SMP'],
    ['Arsip Tujuan Guru/Admin', TEACHER_ARCHIVE_EMAIL],
    ['Tanggal Kirim', new Date().toLocaleString('id-ID')],
    ['Nama Siswa', profile.name],
    ['Sekolah', profile.school],
    ['Kelas', profile.className],
    ['Bab', `Bab ${chapter.id} - ${chapter.title}`],
    ['Kompetensi', chapter.competency],
    ['Skor Pilihan Ganda', `${chapterProgress.mcqScore} / ${chapter.questions.length}`],
    [],
    ['REFLEKSI / JAWABAN URAIAN SISWA'],
    ['Pertanyaan Refleksi', chapter.essayPrompt],
    ['Refleksi Siswa', chapterProgress.essayAnswer?.trim() || '(Belum diisi)'],
    [],
    ['RINCIAN JAWABAN PILIHAN GANDA'],
    ['No', 'Pertanyaan', 'Jawaban Siswa', 'Kunci Jawaban', 'Status'],
    ...chapter.questions.map((q) => {
      const chosen = chapterProgress.mcqAnswers[q.id] || '-';
      const status = chosen === q.answer ? 'BENAR' : 'BELUM TEPAT';
      return [q.id, q.question, chosen, q.answer, status];
    }),
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}

export async function archiveChapterSheetToGoogleDrive(params: {
  accessToken: string;
  profile: PlayerProfile;
  chapter: ChapterData;
  chapterProgress: ChapterProgress;
}): Promise<{ folderUrl: string; sheetUrl: string }> {
  const { accessToken, profile, chapter, chapterProgress } = params;

  // Structured Folder Hierarchy: Arsip TKA Bahasa Indonesia -> Sekolah -> Kelas -> Siswa -> Bab X
  const rootId = await findOrCreateFolder(accessToken, 'Arsip TKA Bahasa Indonesia');
  const schoolId = await findOrCreateFolder(accessToken, profile.school, rootId);
  const classId = await findOrCreateFolder(accessToken, profile.className, schoolId);
  const studentId = await findOrCreateFolder(accessToken, profile.name, classId);
  const chapterFolderId = await findOrCreateFolder(
    accessToken,
    `Bab ${chapter.id} - ${chapter.shortTitle}`,
    studentId
  );

  await shareResourceWithTeacher(accessToken, studentId);

  const csvContent = buildChapterReflectionCsv({ profile, chapter, chapterProgress });
  const sheetTitle = `Sheet_Refleksi_Bab_${chapter.id}_${profile.name.replace(/\s+/g, '_')}`;
  const uploadedSheet = await createGoogleSheetFromCsv(
    accessToken,
    sheetTitle,
    csvContent,
    chapterFolderId
  );

  await shareResourceWithTeacher(accessToken, uploadedSheet.id);

  return {
    folderUrl: `https://drive.google.com/drive/folders/${chapterFolderId}`,
    sheetUrl:
      uploadedSheet.webViewLink || `https://docs.google.com/spreadsheets/d/${uploadedSheet.id}/edit`,
  };
}
