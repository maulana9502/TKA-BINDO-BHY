import type { ChapterData, GeneralVideoItem } from '../types/game';

export const PUSMENDIK_OFFICIAL_URL =
  'https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/smp/Bahasa-Indonesia';

export const GENERAL_TKA_VIDEOS: GeneralVideoItem[] = [
  {
    id: 'V1',
    title: 'Part 4 Soal Simulasi TKA Bahasa Indonesia SMP 2026 Pusmendik',
    url: 'https://www.youtube.com/watch?v=7ejBdOgO1Eg',
  },
  {
    id: 'V2',
    title: 'Part 9 Soal Simulasi TKA Bahasa Indonesia SMP 2026 Pusmendik',
    url: 'https://www.youtube.com/watch?v=JZwtx4Ydo48',
  },
  {
    id: 'V3',
    title: 'Part 10 Soal Simulasi TKA Bahasa Indonesia SMP 2026 Pusmendik',
    url: 'https://www.youtube.com/watch?v=1dOdzwPEYfo',
  },
  {
    id: 'V4',
    title: 'Playlist GLADI TKA SMP Bahasa Indonesia Pusmendik 2026',
    url: 'https://www.youtube.com/playlist?list=PLcL1L1kbfvJUg-0LSpZKTVd0XEbDQ1XDi',
  },
  {
    id: 'V5',
    title: 'Kupas Tuntas Latihan Soal TKA Bahasa Indonesia Jenjang SMP',
    url: 'https://www.youtube.com/watch?v=a7QAXI-diME',
  },
  {
    id: 'V6',
    title: 'Prediksi TKA Bahasa Indonesia 2026 Tingkat SMP (Ruang Angsana)',
    url: 'https://www.youtube.com/watch?v=o2MMMHw5UV8',
  },
  {
    id: 'V7',
    title: 'Latihan Soal TKA SMP 2026 Bahasa Indonesia dari Buku Detik-Detik Part 2',
    url: 'https://www.youtube.com/watch?v=BfIz14VqQXI',
  },
  {
    id: 'V8',
    title: 'Siap Hadapi TKA! Bedah Soal TKA Bahasa Indonesia SMP Part 2',
    url: 'https://www.youtube.com/watch?v=ZJjjWJwi_XM',
  },
  {
    id: 'V9',
    title: 'Pembahasan Soal TKA Bahasa Indonesia Tingkat SMP/MTs Modul 4',
    url: 'https://www.youtube.com/watch?v=qWwAYX7xYUo',
  },
  {
    id: 'V10',
    title: 'Komplit 30 Soal Prediksi TKA B. Indonesia SMP 2026 Part 1-10 (prediksi, bukan soal resmi)',
    url: 'https://www.youtube.com/watch?v=CDj-CxVBZ8Q',
  },
];

export const INTERIOR_BUILD_REWARDS = [
  {
    tier: 1,
    requiredCorrect: 2,
    name: 'Karpet Belajar Nusantara',
    description: 'Terbangun saat menjawab minimal 2 soal dengan benar.',
  },
  {
    tier: 2,
    requiredCorrect: 4,
    name: 'Sofa & Meja Baca Nyaman',
    description: 'Terbangun saat menjawab minimal 4 soal dengan benar.',
  },
  {
    tier: 3,
    requiredCorrect: 6,
    name: 'Rak Piala & Tanaman Hias',
    description: 'Terbangun saat menjawab minimal 6 soal dengan benar.',
  },
  {
    tier: 4,
    requiredCorrect: 8,
    name: 'Lampu Kristal & Pigura Prestasi',
    description: 'Terbangun saat menjawab minimal 8 soal dengan benar.',
  },
  {
    tier: 5,
    requiredCorrect: 10,
    name: 'Monumen Kristal Juara TKA',
    description: 'Terbangun saat menjawab seluruh 10 soal dengan benar!',
  },
];

export const CHAPTERS: ChapterData[] = [
  {
    id: 1,
    shortTitle: 'Istilah Bidang',
    title: 'Mengidentifikasi penggunaan istilah dalam berbagai bidang',
    competency: 'Pemahaman Tekstual',
    isOfficialPacket: true,
    videoTitle: 'Ruangbelajar, Kebahasaan Teks Deskripsi (membahas makna kata)',
    videoUrl:
      'https://app.ruangguru.com/ruangbelajar/v/kebahasaan-teks-deskripsi-subtopi-yhp4wn9u-hr-smp-kelas-9-kurikulum-merdeka',
    usesGeneralVideoList: true,
    videoConfidence: 'Rendah-Sedang (didukung daftar video umum V1–V10)',
    passageTitle: 'Belanja Daring dan Istilahnya',
    passageText:
      'Belanja daring kini menjadi kebiasaan banyak orang. Sebelum membayar, pembeli memasukkan barang ke keranjang digital, yaitu tempat penampung sementara barang yang akan dibeli. Penjual sering menawarkan diskon atau potongan harga pada waktu tertentu. Saat barang tiba, pembeli dapat memberi ulasan, yaitu penilaian tertulis tentang kualitas barang. Jika barang rusak, pembeli berhak mengajukan retur, yakni pengembalian barang kepada penjual. Beberapa toko menyediakan sistem COD atau bayar di tempat. Dengan sistem ini, pembayaran dilakukan saat kurir menyerahkan paket. Pembeli juga perlu berhati-hati terhadap phishing, yaitu penipuan yang menyamar sebagai pihak tepercaya untuk mencuri data pribadi.',
    questions: [
      {
        id: 1,
        question: 'Istilah retur dalam teks berarti ....',
        options: [
          { key: 'A', text: 'potongan harga' },
          { key: 'B', text: 'pengembalian barang kepada penjual' },
          { key: 'C', text: 'pembayaran di muka' },
          { key: 'D', text: 'pengiriman barang' },
        ],
        answer: 'B',
      },
      {
        id: 2,
        question: 'Ulasan dalam teks bermakna ....',
        options: [
          { key: 'A', text: 'daftar belanja' },
          { key: 'B', text: 'potongan harga' },
          { key: 'C', text: 'pengiriman barang' },
          { key: 'D', text: 'penilaian tertulis tentang kualitas barang' },
        ],
        answer: 'D',
      },
      {
        id: 3,
        question: 'COD dalam teks adalah sistem pembayaran ....',
        options: [
          { key: 'A', text: 'saat kurir menyerahkan paket' },
          { key: 'B', text: 'sebelum barang dikirim' },
          { key: 'C', text: 'melalui kartu undian' },
          { key: 'D', text: 'dengan menukar barang' },
        ],
        answer: 'A',
      },
      {
        id: 4,
        question: 'Phishing dalam teks berarti ....',
        options: [
          { key: 'A', text: 'promosi barang' },
          { key: 'B', text: 'penilaian pembeli' },
          { key: 'C', text: 'penipuan yang menyamar sebagai pihak tepercaya untuk mencuri data pribadi' },
          { key: 'D', text: 'pengembalian uang' },
        ],
        answer: 'C',
      },
      {
        id: 5,
        question: 'Keranjang digital dalam teks adalah ....',
        options: [
          { key: 'A', text: 'tas belanja dari anyaman' },
          { key: 'B', text: 'tempat penampung sementara barang yang akan dibeli secara daring' },
          { key: 'C', text: 'alamat toko' },
          { key: 'D', text: 'layanan antar barang' },
        ],
        answer: 'B',
      },
      {
        id: 6,
        question: 'Diskon dalam teks berarti ....',
        options: [
          { key: 'A', text: 'potongan harga' },
          { key: 'B', text: 'tambahan biaya' },
          { key: 'C', text: 'biaya kirim' },
          { key: 'D', text: 'pajak barang' },
        ],
        answer: 'A',
      },
      {
        id: 7,
        question: 'Istilah yang termasuk dalam bidang jual beli daring menurut teks adalah ....',
        options: [
          { key: 'A', text: 'fotosintesis' },
          { key: 'B', text: 'sedimentasi' },
          { key: 'C', text: 'algoritma' },
          { key: 'D', text: 'retur' },
        ],
        answer: 'D',
      },
      {
        id: 8,
        question: 'Pembeli berhak mengajukan retur jika ....',
        options: [
          { key: 'A', text: 'barang terlalu murah' },
          { key: 'B', text: 'kurir datang terlambat' },
          { key: 'C', text: 'barang yang diterima rusak' },
          { key: 'D', text: 'toko memberi diskon' },
        ],
        answer: 'C',
      },
      {
        id: 9,
        question: 'Kurir dalam teks adalah ....',
        options: [
          { key: 'A', text: 'petugas pengantar paket' },
          { key: 'B', text: 'penjual barang' },
          { key: 'C', text: 'pembeli barang' },
          { key: 'D', text: 'pembuat aplikasi' },
        ],
        answer: 'A',
      },
      {
        id: 10,
        question: 'Pasangan istilah dan makna yang tepat adalah ....',
        options: [
          { key: 'A', text: 'retur - penilaian tertulis' },
          { key: 'B', text: 'COD - bayar di tempat' },
          { key: 'C', text: 'diskon - pengiriman barang' },
          { key: 'D', text: 'phishing - promosi barang' },
        ],
        answer: 'B',
      },
    ],
    essayPrompt:
      'Jelaskan dengan bahasamu sendiri makna istilah retur, COD, dan phishing berdasarkan teks "Belanja Daring dan Istilahnya", serta cara menghindari penipuan belanja daring!',
    accentColor: '#10b981',
    buildingPos: { x: -46, z: -60, rotY: Math.PI / 2 },
  },
  {
    id: 2,
    shortTitle: 'Objek & Latar',
    title: 'Mengidentifikasi objek dan/atau latar berdasarkan kosakata dalam teks fiksi atau nonfiksi',
    competency: 'Pemahaman Tekstual',
    isOfficialPacket: true,
    videoTitle: 'V1. Part 4 Soal Simulasi TKA Bahasa Indonesia SMP 2026 Pusmendik',
    videoUrl: 'https://www.youtube.com/watch?v=7ejBdOgO1Eg',
    usesGeneralVideoList: true,
    videoConfidence: 'Rendah (memakai daftar video umum V1–V10 Pusmendik)',
    passageTitle: 'Pasar Pagi',
    passageText:
      'Fajar baru merekah ketika Bu Lastri tiba di pasar. Bau terasi dan ikan asin menyambutnya. Para pedagang menata tumpukan cabai dan tomat di atas meja kayu yang lapuk. Suara tawar-menawar bersahutan dari balik terpal biru. Embun masih menempel di daun bayam. Bu Lastri menyelipkan bungkusan plastik ke dalam keranjang rotan, lalu menyibak kerumunan menuju lapak langganannya.',
    questions: [
      {
        id: 1,
        question: 'Latar waktu dalam teks adalah ....',
        options: [
          { key: 'A', text: 'tengah malam' },
          { key: 'B', text: 'siang terik' },
          { key: 'C', text: 'pagi hari' },
          { key: 'D', text: 'sore hari' },
        ],
        answer: 'C',
      },
      {
        id: 2,
        question: 'Latar tempat dalam teks adalah ....',
        options: [
          { key: 'A', text: 'pasar' },
          { key: 'B', text: 'sekolah' },
          { key: 'C', text: 'dapur' },
          { key: 'D', text: 'terminal' },
        ],
        answer: 'A',
      },
      {
        id: 3,
        question: 'Kata yang menunjukkan latar waktu adalah ....',
        options: [
          { key: 'A', text: 'keranjang rotan' },
          { key: 'B', text: 'terpal biru' },
          { key: 'C', text: 'meja kayu' },
          { key: 'D', text: 'fajar baru merekah' },
        ],
        answer: 'D',
      },
      {
        id: 4,
        question: 'Kata yang menunjukkan latar tempat adalah ....',
        options: [
          { key: 'A', text: 'embun' },
          { key: 'B', text: 'tawar-menawar' },
          { key: 'C', text: 'merekah' },
          { key: 'D', text: 'menyelipkan' },
        ],
        answer: 'B',
      },
      {
        id: 5,
        question: 'Para pedagang menata cabai dan tomat di atas ....',
        options: [
          { key: 'A', text: 'meja besi' },
          { key: 'B', text: 'rak kaca' },
          { key: 'C', text: 'meja kayu yang lapuk' },
          { key: 'D', text: 'lantai keramik' },
        ],
        answer: 'C',
      },
      {
        id: 6,
        question: 'Benda yang dibawa Bu Lastri adalah ....',
        options: [
          { key: 'A', text: 'keranjang rotan' },
          { key: 'B', text: 'tas kain' },
          { key: 'C', text: 'kantong kertas' },
          { key: 'D', text: 'ember' },
        ],
        answer: 'A',
      },
      {
        id: 7,
        question: 'Suasana latar tempat dalam teks adalah ....',
        options: [
          { key: 'A', text: 'sepi' },
          { key: 'B', text: 'mencekam' },
          { key: 'C', text: 'sunyi' },
          { key: 'D', text: 'ramai dan sibuk' },
        ],
        answer: 'D',
      },
      {
        id: 8,
        question: 'Kosakata yang menunjukkan latar melalui indra penciuman adalah ....',
        options: [
          { key: 'A', text: 'suara tawar-menawar' },
          { key: 'B', text: 'bau terasi dan ikan asin' },
          { key: 'C', text: 'daun bayam' },
          { key: 'D', text: 'terpal biru' },
        ],
        answer: 'B',
      },
      {
        id: 9,
        question: 'Objek yang masih basah oleh embun adalah ....',
        options: [
          { key: 'A', text: 'cabai' },
          { key: 'B', text: 'tomat' },
          { key: 'C', text: 'daun bayam' },
          { key: 'D', text: 'terpal' },
        ],
        answer: 'C',
      },
      {
        id: 10,
        question: 'Kata lapak dalam teks bermakna ....',
        options: [
          { key: 'A', text: 'tempat berjualan' },
          { key: 'B', text: 'tempat parkir' },
          { key: 'C', text: 'gudang' },
          { key: 'D', text: 'kantor' },
        ],
        answer: 'A',
      },
    ],
    essayPrompt:
      'Tuliskan kembali bukti kosakata yang menggambarkan latar waktu, tempat, dan suasana dalam teks "Pasar Pagi" beserta alasannya!',
    accentColor: '#06b6d4',
    buildingPos: { x: 46, z: -60, rotY: -Math.PI / 2 },
  },
  {
    id: 3,
    shortTitle: 'Informasi Tersurat',
    title: 'Mengidentifikasi informasi penting yang tersurat dalam teks',
    competency: 'Pemahaman Tekstual',
    isOfficialPacket: true,
    videoTitle: 'V2. Part 9 Soal Simulasi TKA Bahasa Indonesia SMP 2026 Pusmendik',
    videoUrl: 'https://www.youtube.com/watch?v=JZwtx4Ydo48',
    usesGeneralVideoList: true,
    videoConfidence: 'Rendah (memakai daftar video umum V1–V10 Pusmendik)',
    passageTitle: 'Hutan Mangrove Pelindung Pantai',
    passageText:
      'Hutan mangrove tumbuh di daerah pantai yang tergenang air pasang surut. Akar napas atau pneumatofor mencuat dari lumpur untuk menyerap oksigen, sedangkan akar tunjang menahan pohon agar tidak tumbang diterjang ombak. Hutan ini menjadi tempat pemijahan ikan, udang, dan kepiting. Selain itu, mangrove meredam abrasi, yaitu pengikisan garis pantai oleh ombak. Di Desa Sidomulyo, warga menanam 500 bibit setiap Oktober sejak 2018. Penanaman dilakukan saat air surut agar bibit mudah ditancapkan ke lumpur. Kini garis pantai di desa itu mulai stabil.',
    questions: [
      {
        id: 1,
        question: 'Hutan mangrove tumbuh di ....',
        options: [
          { key: 'A', text: 'pegunungan' },
          { key: 'B', text: 'gurun' },
          { key: 'C', text: 'daerah pantai yang tergenang air pasang surut' },
          { key: 'D', text: 'danau air tawar' },
        ],
        answer: 'C',
      },
      {
        id: 2,
        question: 'Bibit mangrove ditanam pada saat ....',
        options: [
          { key: 'A', text: 'air pasang' },
          { key: 'B', text: 'air surut' },
          { key: 'C', text: 'siang hari' },
          { key: 'D', text: 'tengah malam' },
        ],
        answer: 'B',
      },
      {
        id: 3,
        question: 'Jumlah bibit yang ditanam warga setiap Oktober adalah ....',
        options: [
          { key: 'A', text: '50' },
          { key: 'B', text: '5.000' },
          { key: 'C', text: '2018' },
          { key: 'D', text: '500' },
        ],
        answer: 'D',
      },
      {
        id: 4,
        question: 'Warga Desa Sidomulyo mulai menanam bibit mangrove sejak tahun ....',
        options: [
          { key: 'A', text: '2018' },
          { key: 'B', text: '2008' },
          { key: 'C', text: '2020' },
          { key: 'D', text: '2015' },
        ],
        answer: 'A',
      },
      {
        id: 5,
        question: 'Penanaman bibit dilakukan setiap bulan ....',
        options: [
          { key: 'A', text: 'Maret' },
          { key: 'B', text: 'Agustus' },
          { key: 'C', text: 'Oktober' },
          { key: 'D', text: 'Desember' },
        ],
        answer: 'C',
      },
      {
        id: 6,
        question: 'Penanaman dilakukan saat air surut karena ....',
        options: [
          { key: 'A', text: 'ikan mudah ditangkap' },
          { key: 'B', text: 'bibit mudah ditancapkan ke lumpur' },
          { key: 'C', text: 'ombak menjadi tenang' },
          { key: 'D', text: 'akar napas cepat tumbuh' },
        ],
        answer: 'B',
      },
      {
        id: 7,
        question: 'Kondisi garis pantai di desa itu sekarang adalah ....',
        options: [
          { key: 'A', text: 'mulai stabil' },
          { key: 'B', text: 'makin terkikis' },
          { key: 'C', text: 'hilang' },
          { key: 'D', text: 'bergeser jauh' },
        ],
        answer: 'A',
      },
      {
        id: 8,
        question: 'Hewan yang disebut hidup dan berkembang biak di hutan mangrove adalah ....',
        options: [
          { key: 'A', text: 'ikan, cumi-cumi, dan kerang' },
          { key: 'B', text: 'ikan, kepiting, dan lobster' },
          { key: 'C', text: 'ikan, udang, dan kerang' },
          { key: 'D', text: 'ikan, udang, dan kepiting' },
        ],
        answer: 'D',
      },
      {
        id: 9,
        question: 'Selain sebagai tempat pemijahan, mangrove berfungsi ....',
        options: [
          { key: 'A', text: 'menambah arus laut' },
          { key: 'B', text: 'meredam abrasi' },
          { key: 'C', text: 'menghasilkan garam' },
          { key: 'D', text: 'memperbesar gelombang' },
        ],
        answer: 'B',
      },
      {
        id: 10,
        question: 'Pernyataan yang sesuai dengan teks adalah ....',
        options: [
          { key: 'A', text: 'Akar napas menahan pohon agar tidak tumbang.' },
          { key: 'B', text: 'Penanaman dilakukan setiap bulan Maret.' },
          { key: 'C', text: 'Warga Desa Sidomulyo menanam bibit mangrove sejak 2018.' },
          { key: 'D', text: 'Mangrove hanya menjadi tempat tinggal ikan.' },
        ],
        answer: 'C',
      },
    ],
    essayPrompt:
      'Jelaskan dengan bahasamu sendiri dua manfaat utama hutan mangrove bagi ekosistem pantai dan warga Desa Sidomulyo berdasarkan informasi tersurat dalam teks!',
    accentColor: '#f59e0b',
    buildingPos: { x: -46, z: -20, rotY: Math.PI / 2 },
  },
  {
    id: 4,
    shortTitle: 'Kerangka & Bagan',
    title: 'Menyusun kerangka atau bagan berdasarkan bagian-bagian penting dalam teks',
    competency: 'Pemahaman Tekstual',
    isOfficialPacket: true,
    videoTitle: 'V3. Part 10 Soal Simulasi TKA Bahasa Indonesia SMP 2026 Pusmendik',
    videoUrl: 'https://www.youtube.com/watch?v=1dOdzwPEYfo',
    usesGeneralVideoList: true,
    videoConfidence: 'Rendah (memakai daftar video umum V1–V10 Pusmendik)',
    passageTitle: 'Sampah Plastik di Sungai',
    passageText:
      '(1) Sampah plastik di sungai berasal dari kegiatan sehari-hari, seperti kantong belanja, botol minuman, dan sedotan yang dibuang sembarangan.\n(2) Sampah itu mengganggu ekosistem. Ikan menelan serpihan plastik, dan aliran air tersumbat sehingga kualitas air menurun.\n(3) Dampaknya sampai ke manusia. Sumbatan sampah memicu banjir saat hujan deras, sedangkan mikroplastik masuk ke rantai makanan melalui ikan yang kita konsumsi.\n(4) Upaya mengatasinya dapat dimulai dari kebiasaan membawa tas belanja sendiri, memilah sampah, dan mendukung bank sampah di lingkungan sekitar.',
    questions: [
      {
        id: 1,
        question: 'Kerangka yang paling tepat untuk teks tersebut adalah ....',
        options: [
          { key: 'A', text: '1) jenis pabrik plastik 2) harga plastik 3) lomba kebersihan 4) bank sampah' },
          { key: 'B', text: '1) asal sampah plastik 2) dampak bagi ekosistem 3) dampak bagi manusia 4) upaya mengatasi' },
          { key: 'C', text: '1) dampak bagi manusia 2) asal sampah 3) upaya mengatasi 4) dampak bagi ekosistem' },
          { key: 'D', text: '1) bank sampah 2) banjir 3) ikan 4) botol' },
        ],
        answer: 'B',
      },
      {
        id: 2,
        question: 'Subjudul yang paling tepat untuk paragraf (2) adalah ....',
        options: [
          { key: 'A', text: 'Asal usul sampah plastik' },
          { key: 'B', text: 'Dampak sampah bagi manusia' },
          { key: 'C', text: 'Gangguan terhadap ekosistem sungai' },
          { key: 'D', text: 'Upaya mengatasi sampah' },
        ],
        answer: 'C',
      },
      {
        id: 3,
        question: 'Bagan sebab-akibat yang sesuai dengan paragraf (3) adalah ....',
        options: [
          { key: 'A', text: 'Sampah menyumbat aliran -> banjir saat hujan deras' },
          { key: 'B', text: 'Hujan deras -> sampah plastik bertambah' },
          { key: 'C', text: 'Banjir -> mikroplastik terbentuk' },
          { key: 'D', text: 'Bank sampah -> banjir' },
        ],
        answer: 'A',
      },
      {
        id: 4,
        question: 'Poin yang TIDAK termasuk dalam kerangka paragraf (1) adalah ....',
        options: [
          { key: 'A', text: 'kantong belanja' },
          { key: 'B', text: 'botol minuman' },
          { key: 'C', text: 'sedotan' },
          { key: 'D', text: 'cara membuat bank sampah' },
        ],
        answer: 'D',
      },
      {
        id: 5,
        question: 'Ikhtisar paragraf (3) yang paling tepat adalah ....',
        options: [
          { key: 'A', text: 'Plastik dibuat dari minyak bumi.' },
          { key: 'B', text: 'Sampah plastik di sungai dapat menyebabkan banjir dan masuk ke makanan manusia.' },
          { key: 'C', text: 'Ikan sulit hidup di sungai.' },
          { key: 'D', text: 'Banjir hanya terjadi di perkotaan.' },
        ],
        answer: 'B',
      },
      {
        id: 6,
        question: 'Pada bagan "Upaya individu", isian yang sesuai dengan paragraf (4) adalah ....',
        options: [
          { key: 'A', text: 'membangun pabrik daur ulang' },
          { key: 'B', text: 'membuat undang-undang' },
          { key: 'C', text: 'membawa tas belanja sendiri dan memilah sampah' },
          { key: 'D', text: 'memasang jaring di laut' },
        ],
        answer: 'C',
      },
      {
        id: 7,
        question: 'Pasangan paragraf dan gagasannya yang benar adalah ....',
        options: [
          { key: 'A', text: 'paragraf (1) asal sampah, paragraf (4) upaya mengatasi' },
          { key: 'B', text: 'paragraf (1) dampak ekosistem, paragraf (2) asal sampah' },
          { key: 'C', text: 'paragraf (2) upaya mengatasi, paragraf (3) asal sampah' },
          { key: 'D', text: 'paragraf (3) upaya mengatasi, paragraf (4) dampak' },
        ],
        answer: 'A',
      },
      {
        id: 8,
        question:
          'Ayu membuat kerangka: 1. Asal sampah 2. Dampak ekosistem 3. Upaya mengatasi 4. Dampak bagi manusia. Perbaikan yang tepat adalah ....',
        options: [
          { key: 'A', text: 'menghapus poin 1' },
          { key: 'B', text: 'menggabungkan poin 1 dan 2' },
          { key: 'C', text: 'menukar poin 2 dan 3' },
          { key: 'D', text: 'menukar poin 3 dan 4' },
        ],
        answer: 'D',
      },
      {
        id: 9,
        question: 'Bagan alur masuknya mikroplastik ke tubuh manusia yang sesuai teks adalah ....',
        options: [
          { key: 'A', text: 'manusia -> ikan -> plastik' },
          { key: 'B', text: 'plastik -> manusia -> ikan' },
          { key: 'C', text: 'serpihan plastik -> ditelan ikan -> ikan dikonsumsi manusia' },
          { key: 'D', text: 'ikan -> banjir -> plastik' },
        ],
        answer: 'C',
      },
      {
        id: 10,
        question: 'Ikhtisar seluruh teks yang paling tepat adalah ....',
        options: [
          {
            key: 'A',
            text: 'Sampah plastik di sungai berasal dari kebiasaan sehari-hari, merusak ekosistem dan merugikan manusia, sehingga perlu diatasi dengan perubahan kebiasaan.',
          },
          { key: 'B', text: 'Sungai harus dibersihkan oleh pemerintah saja.' },
          { key: 'C', text: 'Plastik adalah bahan yang berbahaya bagi ikan.' },
          { key: 'D', text: 'Banjir terjadi karena hujan deras.' },
        ],
        answer: 'A',
      },
    ],
    essayPrompt:
      'Buatlah kerangka ringkas (poin 1 sampai 4) beserta satu tindakan nyata yang bisa kamu lakukan di sekolah untuk mengurangi sampah plastik!',
    accentColor: '#3b82f6',
    buildingPos: { x: 46, z: -20, rotY: -Math.PI / 2 },
  },
  {
    id: 5,
    shortTitle: 'Ide Pokok & Nilai',
    title: 'Menyimpulkan ide pokok, gagasan pendukung, tokoh, peristiwa, latar, dan/atau nilai-nilai dalam dan/atau antarteks',
    competency: 'Pemahaman Inferensial',
    isOfficialPacket: true,
    videoTitle: 'V5. Kupas Tuntas Latihan Soal TKA Bahasa Indonesia Jenjang SMP',
    videoUrl: 'https://www.youtube.com/watch?v=a7QAXI-diME',
    usesGeneralVideoList: true,
    videoConfidence: 'Rendah (memakai daftar video umum V1–V10 Pusmendik)',
    passageTitle: 'Bedeng Sayur Dimas',
    passageText:
      'Setiap pulang sekolah, Dimas tidak langsung pulang. Ia mengambil ember dan menyiram bedeng sayur di belakang kelas. Teman-temannya sering menertawakan. "Memangnya kamu dibayar?" kata Yoga. Dimas hanya tersenyum. Ia ingat pesan Pak Hadi, wali kelasnya, bahwa tanaman yang dirawat akan membalas dengan hasil panen. Musim kemarau tiba dan sumur sekolah hampir kering. Dimas membawa air bekas cucian beras dari rumah agar tanaman tetap hidup. Dua bulan kemudian, kangkung dan bayam di bedeng itu tumbuh subur. Panennya dibagikan ke seluruh kelas. Yoga menerima seikat bayam dan menunduk malu. "Besok aku ikut menyiram," katanya pelan.',
    questions: [
      {
        id: 1,
        question: 'Tokoh utama dalam cerita adalah ....',
        options: [
          { key: 'A', text: 'Yoga' },
          { key: 'B', text: 'Dimas' },
          { key: 'C', text: 'Pak Hadi' },
          { key: 'D', text: 'wali murid' },
        ],
        answer: 'B',
      },
      {
        id: 2,
        question: 'Watak Dimas yang paling tepat adalah ....',
        options: [
          { key: 'A', text: 'pemalu dan penakut' },
          { key: 'B', text: 'sombong dan egois' },
          { key: 'C', text: 'mudah marah' },
          { key: 'D', text: 'tekun dan peduli' },
        ],
        answer: 'D',
      },
      {
        id: 3,
        question: 'Gagasan utama cerita tersebut adalah ....',
        options: [
          { key: 'A', text: 'Ketekunan merawat sesuatu akan berbuah baik dan dapat menyadarkan orang lain.' },
          { key: 'B', text: 'Kemarau membuat sumur sekolah kering.' },
          { key: 'C', text: 'Hasil panen harus dibagikan.' },
          { key: 'D', text: 'Teman sering mengejek.' },
        ],
        answer: 'A',
      },
      {
        id: 4,
        question: 'Gagasan pendukung untuk "Dimas tekun merawat tanaman" adalah ....',
        options: [
          { key: 'A', text: 'Yoga menunduk malu.' },
          { key: 'B', text: 'Pak Hadi adalah wali kelas.' },
          { key: 'C', text: 'Dimas membawa air bekas cucian beras saat kemarau.' },
          { key: 'D', text: 'Panen dibagikan ke seluruh kelas.' },
        ],
        answer: 'C',
      },
      {
        id: 5,
        question: 'Peran Yoga dalam cerita adalah tokoh yang ....',
        options: [
          { key: 'A', text: 'membantu Dimas sejak awal' },
          { key: 'B', text: 'awalnya meremehkan lalu berubah sikap' },
          { key: 'C', text: 'memberi nasihat kepada Dimas' },
          { key: 'D', text: 'menjual hasil panen' },
        ],
        answer: 'B',
      },
      {
        id: 6,
        question: 'Amanat yang tepat dari cerita tersebut adalah ....',
        options: [
          { key: 'A', text: 'Balaslah ejekan dengan ejekan.' },
          { key: 'B', text: 'Kerja keras tidak perlu dibagikan hasilnya.' },
          { key: 'C', text: 'Menanam sayur selalu menguntungkan.' },
          { key: 'D', text: 'Kerjakan hal baik dengan tekun tanpa terpengaruh ejekan.' },
        ],
        answer: 'D',
      },
      {
        id: 7,
        question: 'Pak Hadi berperan sebagai tokoh yang ....',
        options: [
          { key: 'A', text: 'memberi nasihat yang memotivasi Dimas' },
          { key: 'B', text: 'menertawakan Dimas' },
          { key: 'C', text: 'menghentikan kegiatan Dimas' },
          { key: 'D', text: 'menjual sayur' },
        ],
        answer: 'A',
      },
      {
        id: 8,
        question: 'Sikap Yoga di akhir cerita menunjukkan bahwa ia ....',
        options: [
          { key: 'A', text: 'marah kepada Dimas' },
          { key: 'B', text: 'iri terhadap hasil panen' },
          { key: 'C', text: 'menyesal dan ingin ikut berbuat baik' },
          { key: 'D', text: 'bangga karena menang' },
        ],
        answer: 'C',
      },
      {
        id: 9,
        question: 'Kalimat yang menunjukkan perubahan watak Yoga adalah ....',
        options: [
          { key: 'A', text: '"Memangnya kamu dibayar?"' },
          { key: 'B', text: '"Besok aku ikut menyiram."' },
          { key: 'C', text: 'Dimas hanya tersenyum.' },
          { key: 'D', text: 'Ia ingat pesan Pak Hadi.' },
        ],
        answer: 'B',
      },
      {
        id: 10,
        question: 'Pesan Pak Hadi bahwa tanaman yang dirawat akan membalas dengan hasil panen bermakna ....',
        options: [
          { key: 'A', text: 'tanaman bisa berbicara' },
          { key: 'B', text: 'panen tidak bergantung perawatan' },
          { key: 'C', text: 'sayur cepat dijual' },
          { key: 'D', text: 'kesabaran dalam merawat akan memberi manfaat' },
        ],
        answer: 'D',
      },
    ],
    essayPrompt:
      'Tuliskan nilai keteladanan dari tokoh Dimas dan mengapa sikap tersebut penting diterapkan dalam kehidupan pelajar SMP!',
    accentColor: '#ec4899',
    buildingPos: { x: -46, z: 20, rotY: Math.PI / 2 },
  },
  {
    id: 6,
    shortTitle: 'Kelogisan Hubungan',
    title: 'Menjelaskan kelogisan hubungan antarperistiwa, antargagasan, dan/atau antarinformasi dalam dan/atau antarteks',
    competency: 'Pemahaman Inferensial',
    isOfficialPacket: true,
    videoTitle: 'V6. Prediksi TKA Bahasa Indonesia 2026 Tingkat SMP (Ruang Angsana)',
    videoUrl: 'https://www.youtube.com/watch?v=o2MMMHw5UV8',
    usesGeneralVideoList: true,
    videoConfidence: 'Rendah (memakai daftar video umum V1–V10 Pusmendik)',
    passageTitle: 'Banjir di Kampung Rawa',
    passageText:
      'Setiap musim hujan, Kampung Rawa terendam. Penyebab pertama, saluran air tertutup sampah sehingga air hujan tidak mengalir. Kedua, tanah resapan berkurang karena banyak halaman diplester semen. Akibatnya, air menggenang hingga setinggi lutut. Warga lalu bergotong royong membersihkan saluran dan membuat sumur resapan. Setelah tiga bulan, genangan di jalan utama surut dalam dua jam, padahal sebelumnya butuh sehari penuh. Meskipun begitu, kampung di bagian hilir masih terendam karena belum memiliki sumur resapan.',
    questions: [
      {
        id: 1,
        question: 'Penyebab air hujan tidak mengalir adalah ....',
        options: [
          { key: 'A', text: 'saluran tertutup sampah' },
          { key: 'B', text: 'halaman yang luas' },
          { key: 'C', text: 'hujan yang sebentar' },
          { key: 'D', text: 'sumur resapan' },
        ],
        answer: 'A',
      },
      {
        id: 2,
        question: 'Akibat berkurangnya tanah resapan adalah ....',
        options: [
          { key: 'A', text: 'sampah berkurang' },
          { key: 'B', text: 'warga pindah' },
          { key: 'C', text: 'air menggenang hingga setinggi lutut' },
          { key: 'D', text: 'jalan menjadi kering' },
        ],
        answer: 'C',
      },
      {
        id: 3,
        question: 'Hubungan kalimat "Warga lalu bergotong royong ..." dengan kalimat sebelumnya adalah ....',
        options: [
          { key: 'A', text: 'sebab' },
          { key: 'B', text: 'upaya mengatasi masalah' },
          { key: 'C', text: 'pertentangan' },
          { key: 'D', text: 'perbandingan' },
        ],
        answer: 'B',
      },
      {
        id: 4,
        question:
          'Hubungan kalimat "Meskipun begitu, kampung di bagian hilir masih terendam" dengan kalimat sebelumnya adalah ....',
        options: [
          { key: 'A', text: 'sebab' },
          { key: 'B', text: 'urutan waktu' },
          { key: 'C', text: 'penambahan' },
          { key: 'D', text: 'pertentangan' },
        ],
        answer: 'D',
      },
      {
        id: 5,
        question: 'Urutan peristiwa yang benar adalah ....',
        options: [
          { key: 'A', text: 'warga bergotong royong -> saluran tertutup -> genangan surut cepat -> banjir' },
          { key: 'B', text: 'genangan surut cepat -> banjir -> saluran tertutup -> warga bergotong royong' },
          { key: 'C', text: 'saluran tertutup sampah -> air menggenang -> warga bergotong royong -> genangan cepat surut' },
          { key: 'D', text: 'air menggenang -> genangan cepat surut -> saluran tertutup -> warga bergotong royong' },
        ],
        answer: 'C',
      },
      {
        id: 6,
        question: 'Kesimpulan yang logis berdasarkan teks adalah ....',
        options: [
          { key: 'A', text: 'Pembersihan saluran dan sumur resapan mempercepat surutnya genangan.' },
          { key: 'B', text: 'Sumur resapan tidak berguna.' },
          { key: 'C', text: 'Banjir hanya disebabkan hujan.' },
          { key: 'D', text: 'Warga hilir tidak mau bekerja sama.' },
        ],
        answer: 'A',
      },
      {
        id: 7,
        question: 'Pernyataan yang TIDAK logis menurut teks adalah ....',
        options: [
          { key: 'A', text: 'Saluran tertutup sampah membuat air sulit mengalir.' },
          { key: 'B', text: 'Halaman yang diplester mengurangi daerah resapan.' },
          { key: 'C', text: 'Sumur resapan membantu air meresap.' },
          { key: 'D', text: 'Genangan cepat surut karena hujan berhenti selama tiga bulan.' },
        ],
        answer: 'D',
      },
      {
        id: 8,
        question:
          'Konjungsi yang tepat untuk melengkapi "…. saluran tertutup sampah, air hujan tidak dapat mengalir." adalah ....',
        options: [
          { key: 'A', text: 'Meskipun' },
          { key: 'B', text: 'Karena' },
          { key: 'C', text: 'Agar' },
          { key: 'D', text: 'Sedangkan' },
        ],
        answer: 'B',
      },
      {
        id: 9,
        question: 'Kampung di bagian hilir masih terendam karena ....',
        options: [
          { key: 'A', text: 'warganya malas' },
          { key: 'B', text: 'hujan hanya turun di hilir' },
          { key: 'C', text: 'belum memiliki sumur resapan' },
          { key: 'D', text: 'salurannya terlalu bersih' },
        ],
        answer: 'C',
      },
      {
        id: 10,
        question: 'Kelanjutan yang logis dari "Jika semua kampung di hilir membuat sumur resapan, ...." adalah ....',
        options: [
          { key: 'A', text: 'genangan di kawasan itu kemungkinan berkurang' },
          { key: 'B', text: 'saluran akan makin tertutup' },
          { key: 'C', text: 'hujan akan berhenti' },
          { key: 'D', text: 'tanah resapan makin sempit' },
        ],
        answer: 'A',
      },
    ],
    essayPrompt:
      'Jelaskan hubungan sebab-akibat antara halaman yang diplester semen, sumur resapan, dan lamanya genangan surut di Kampung Rawa!',
    accentColor: '#8b5cf6',
    buildingPos: { x: 46, z: 20, rotY: -Math.PI / 2 },
  },
  {
    id: 7,
    shortTitle: 'Prediksi Peristiwa',
    title: 'Memprediksi peristiwa dalam teks',
    competency: 'Pemahaman Inferensial',
    isOfficialPacket: true,
    videoTitle: 'V7. Latihan Soal TKA SMP 2026 Bahasa Indonesia dari Buku Detik-Detik Part 2',
    videoUrl: 'https://www.youtube.com/watch?v=BfIz14VqQXI',
    usesGeneralVideoList: true,
    videoConfidence: 'Rendah (memakai daftar video umum V1–V10 Pusmendik)',
    passageTitle: 'Lomba Melukis',
    passageText:
      'Kila mengayuh sepedanya sekuat tenaga. Lomba melukis dimulai pukul 08.00, sedangkan jam tangannya menunjukkan 07.40. Perjalanan ke gedung kesenian biasanya memakan waktu lima belas menit. Di tikungan terakhir, rantai sepedanya terlepas. Kila turun dan memandangi rantai yang menjuntai di aspal. Ia tidak bisa memasangnya sendiri. Dari seberang jalan, seorang tukang tambal ban melambaikan tangan sambil membawa kain lap. "Sini, Nak. Biar Bapak lihat," serunya. Kila melirik jam tangannya sekali lagi, lalu berlari menyeberang.',
    questions: [
      {
        id: 1,
        question: 'Hal yang paling mungkin dilakukan tukang tambal ban selanjutnya adalah ....',
        options: [
          { key: 'A', text: 'menyuruh Kila pulang' },
          { key: 'B', text: 'memasang kembali rantai sepeda Kila' },
          { key: 'C', text: 'menjual sepeda baru' },
          { key: 'D', text: 'meminjam sepeda Kila' },
        ],
        answer: 'B',
      },
      {
        id: 2,
        question: 'Kila kemungkinan tiba di gedung kesenian ....',
        options: [
          { key: 'A', text: 'jauh sebelum lomba dimulai' },
          { key: 'B', text: 'sebelum pukul 07.45' },
          { key: 'C', text: 'keesokan harinya' },
          { key: 'D', text: 'sangat mepet dengan waktu mulai lomba' },
        ],
        answer: 'D',
      },
      {
        id: 3,
        question: 'Petunjuk dalam teks yang mendukung prediksi bahwa Kila sedang terburu-buru adalah ....',
        options: [
          { key: 'A', text: 'jam menunjukkan 07.40, lomba pukul 08.00, dan perjalanan lima belas menit' },
          { key: 'B', text: 'gedung kesenian' },
          { key: 'C', text: 'tukang tambal ban membawa kain lap' },
          { key: 'D', text: 'aspal di tikungan' },
        ],
        answer: 'A',
      },
      {
        id: 4,
        question: 'Jika Kila memilih berlari ke gedung tanpa memperbaiki sepeda, kemungkinan yang terjadi adalah ....',
        options: [
          { key: 'A', text: 'ia tiba lebih cepat' },
          { key: 'B', text: 'ia tidak mungkin tiba' },
          { key: 'C', text: 'ia terlambat karena berlari lebih lambat daripada bersepeda' },
          { key: 'D', text: 'lomba dimajukan' },
        ],
        answer: 'C',
      },
      {
        id: 5,
        question: 'Kalimat yang paling tepat melanjutkan teks adalah ....',
        options: [
          { key: 'A', text: 'Kila menolak dan pergi meninggalkan sepedanya.' },
          { key: 'B', text: 'Dengan cekatan, tukang tambal ban memasang kembali rantai itu.' },
          { key: 'C', text: 'Kila menangis lalu pulang.' },
          { key: 'D', text: 'Tukang tambal ban menutup bengkelnya.' },
        ],
        answer: 'B',
      },
      {
        id: 6,
        question: 'Sikap Kila setelah rantai terpasang kemungkinan adalah ....',
        options: [
          { key: 'A', text: 'marah kepada tukang tambal ban' },
          { key: 'B', text: 'diam saja' },
          { key: 'C', text: 'menolak membayar' },
          { key: 'D', text: 'berterima kasih lalu segera mengayuh sepedanya' },
        ],
        answer: 'D',
      },
      {
        id: 7,
        question: 'Ungkapan yang mendukung prediksi bahwa tukang tambal ban akan membantu adalah ....',
        options: [
          { key: 'A', text: 'melambaikan tangan sambil membawa kain lap' },
          { key: 'B', text: 'aspal' },
          { key: 'C', text: 'tikungan terakhir' },
          { key: 'D', text: 'jam tangan' },
        ],
        answer: 'A',
      },
      {
        id: 8,
        question: 'Akhir cerita yang paling mungkin adalah ....',
        options: [
          { key: 'A', text: 'Kila gagal mengikuti lomba karena sepedanya hilang.' },
          { key: 'B', text: 'Lomba dibatalkan.' },
          { key: 'C', text: 'Kila sempat mengikuti lomba karena dibantu tukang tambal ban.' },
          { key: 'D', text: 'Kila membatalkan keikutsertaannya.' },
        ],
        answer: 'C',
      },
      {
        id: 9,
        question: 'Jika tukang tambal ban tidak membantu, kemungkinan yang terjadi adalah ....',
        options: [
          { key: 'A', text: 'Kila menang lomba' },
          { key: 'B', text: 'Kila terlambat atau harus mencari cara lain' },
          { key: 'C', text: 'rantai terpasang sendiri' },
          { key: 'D', text: 'lomba diundur' },
        ],
        answer: 'B',
      },
      {
        id: 10,
        question: 'Ucapan Kila yang paling mungkin setelah rantai terpasang adalah ....',
        options: [
          { key: 'A', text: '"Aku tidak butuh bantuan."' },
          { key: 'B', text: '"Ini semua salah Bapak."' },
          { key: 'C', text: '"Lombanya pasti sudah selesai."' },
          { key: 'D', text: '"Terima kasih, Pak. Semoga saya belum terlambat!"' },
        ],
        answer: 'D',
      },
    ],
    essayPrompt:
      'Tuliskan satu paragraf lanjutan cerita "Lomba Melukis" setelah Kila bertemu tukang tambal ban hingga tiba di gedung kesenian!',
    accentColor: '#ef4444',
    buildingPos: { x: -46, z: 60, rotY: Math.PI / 2 },
  },
  {
    id: 8,
    shortTitle: 'Bahasa Kias & Citraan',
    title: 'Menjelaskan bahasa kias dan citraan yang digunakan dalam teks fiksi',
    competency: 'Pemahaman Inferensial',
    isOfficialPacket: true,
    videoTitle: '(a) Soal Makna Puisi TKA 2026 Part 13 (jenjang SMP/SMA belum pasti)',
    videoUrl: 'https://www.youtube.com/watch?v=6668yeVo6m4',
    secondaryVideoTitle: '(b) Ruangbelajar, Kebahasaan Teks Cerita Fantasi (membahas kiasan)',
    secondaryVideoUrl:
      'https://app.ruangguru.com/ruangbelajar/v/kebahasaan-teks-cerita-fantasi-subtopi-t2mxnyuq-hr-smp-kelas-9',
    usesGeneralVideoList: true,
    videoConfidence: 'Sedang',
    passageTitle: 'Puisi: Senja di Dermaga',
    passageText:
      '(1) Matahari tenggelam seperti koin emas jatuh ke laut,\n(2) perahu-perahu mendengkur di pelukan ombak.\n(3) Aroma asin merayap di sela jala yang basah,\n(4) sementara azan melayang lembut bagai selendang.\n(5) Di ujung dermaga, ayah menatap cakrawala,\n(6) hatinya yang batu perlahan melunak.',
    questions: [
      {
        id: 1,
        question: 'Majas pada baris (1) adalah ....',
        options: [
          { key: 'A', text: 'personifikasi' },
          { key: 'B', text: 'simile (perumpamaan)' },
          { key: 'C', text: 'hiperbola' },
          { key: 'D', text: 'ironi' },
        ],
        answer: 'B',
      },
      {
        id: 2,
        question: 'Majas pada ungkapan "perahu-perahu mendengkur" adalah ....',
        options: [
          { key: 'A', text: 'personifikasi' },
          { key: 'B', text: 'metafora' },
          { key: 'C', text: 'simile' },
          { key: 'D', text: 'litotes' },
        ],
        answer: 'A',
      },
      {
        id: 3,
        question: 'Citraan pada ungkapan "aroma asin" adalah ....',
        options: [
          { key: 'A', text: 'penglihatan' },
          { key: 'B', text: 'pendengaran' },
          { key: 'C', text: 'penciuman' },
          { key: 'D', text: 'perabaan' },
        ],
        answer: 'C',
      },
      {
        id: 4,
        question: 'Citraan pada ungkapan "azan melayang" adalah ....',
        options: [
          { key: 'A', text: 'penglihatan' },
          { key: 'B', text: 'penciuman' },
          { key: 'C', text: 'perabaan' },
          { key: 'D', text: 'pendengaran' },
        ],
        answer: 'D',
      },
      {
        id: 5,
        question: 'Makna "hatinya yang batu" adalah ....',
        options: [
          { key: 'A', text: 'hatinya sakit' },
          { key: 'B', text: 'keras dan sulit tersentuh' },
          { key: 'C', text: 'penuh kenangan' },
          { key: 'D', text: 'sangat gembira' },
        ],
        answer: 'B',
      },
      {
        id: 6,
        question: 'Makna "perlahan melunak" pada baris (6) adalah ....',
        options: [
          { key: 'A', text: 'hatinya mulai tersentuh' },
          { key: 'B', text: 'tubuhnya melemah' },
          { key: 'C', text: 'ia mengantuk' },
          { key: 'D', text: 'ia marah' },
        ],
        answer: 'A',
      },
      {
        id: 7,
        question: 'Ungkapan "bagai selendang" menggambarkan suara azan yang ....',
        options: [
          { key: 'A', text: 'keras menggema' },
          { key: 'B', text: 'samar dan hilang' },
          { key: 'C', text: 'cepat dan tergesa' },
          { key: 'D', text: 'lembut dan mengalun' },
        ],
        answer: 'D',
      },
      {
        id: 8,
        question: 'Ungkapan yang membangun citraan penglihatan adalah ....',
        options: [
          { key: 'A', text: 'aroma asin merayap' },
          { key: 'B', text: 'koin emas jatuh ke laut' },
          { key: 'C', text: 'perahu mendengkur' },
          { key: 'D', text: 'azan melayang' },
        ],
        answer: 'B',
      },
      {
        id: 9,
        question: 'Suasana yang dibangun puisi tersebut adalah ....',
        options: [
          { key: 'A', text: 'riang dan meriah' },
          { key: 'B', text: 'tegang dan menakutkan' },
          { key: 'C', text: 'tenang dan haru' },
          { key: 'D', text: 'marah dan kecewa' },
        ],
        answer: 'C',
      },
      {
        id: 10,
        question: 'Gambaran tokoh ayah dalam puisi tersebut adalah ....',
        options: [
          { key: 'A', text: 'seseorang yang tersentuh perasaannya saat memandang senja' },
          { key: 'B', text: 'nelayan yang sedang bertengkar' },
          { key: 'C', text: 'orang yang takut pada laut' },
          { key: 'D', text: 'pedagang yang sedang menjual ikan' },
        ],
        answer: 'A',
      },
    ],
    essayPrompt:
      'Buatlah 2 larik puisi bertema alam atau sekolah yang menggunakan majas personifikasi dan citraan penglihatan/pendengaran, lalu jelaskan maknanya!',
    accentColor: '#14b8a6',
    buildingPos: { x: 46, z: 60, rotY: -Math.PI / 2 },
  },
  {
    id: 9,
    shortTitle: 'Relevansi Peristiwa',
    title: 'Menilai relevansi peristiwa dalam teks dengan kehidupan sehari-hari',
    competency: 'Evaluasi dan Apresiasi',
    isOfficialPacket: true,
    videoTitle: 'V8. Siap Hadapi TKA! Bedah Soal TKA Bahasa Indonesia SMP Part 2',
    videoUrl: 'https://www.youtube.com/watch?v=ZJjjWJwi_XM',
    usesGeneralVideoList: true,
    videoConfidence: 'Rendah (memakai daftar video umum V1–V10 Pusmendik)',
    passageTitle: 'Pesan Hadiah Palsu',
    passageText:
      'Raisa menerima pesan dari nomor tak dikenal: "Selamat! Kamu menang hadiah Rp5 juta. Klik tautan ini dan masukkan kode OTP agar hadiah dikirim." Ia hampir mengklik tautan itu, tetapi teringat pesan gurunya bahwa kode OTP bersifat rahasia. Raisa menghapus pesan tersebut dan melaporkannya kepada ayahnya. Dua hari kemudian, tetangganya, Bu Tuti, kehilangan seluruh tabungannya karena membagikan kode OTP kepada penelepon yang mengaku petugas bank.',
    questions: [
      {
        id: 1,
        question: 'Peristiwa dalam teks relevan dengan kehidupan sekarang karena ....',
        options: [
          { key: 'A', text: 'hadiah undian pasti benar' },
          { key: 'B', text: 'semua orang pernah menang hadiah' },
          { key: 'C', text: 'penipuan lewat pesan dan telepon sering terjadi di masyarakat' },
          { key: 'D', text: 'kode OTP tidak penting' },
        ],
        answer: 'C',
      },
      {
        id: 2,
        question: 'Pelajaran paling relevan dari teks bagi pengguna ponsel adalah ....',
        options: [
          { key: 'A', text: 'jangan membagikan kode OTP kepada siapa pun' },
          { key: 'B', text: 'selalu klik tautan dari nomor baru' },
          { key: 'C', text: 'simpan kode OTP di catatan umum' },
          { key: 'D', text: 'balas semua pesan asing' },
        ],
        answer: 'A',
      },
      {
        id: 3,
        question: 'Jika temanmu hendak mengklik tautan serupa, tanggapan yang tepat adalah ....',
        options: [
          { key: 'A', text: '"Ikuti saja, siapa tahu menang."' },
          { key: 'B', text: '"Ajak aku berbagi hadiahnya."' },
          { key: 'C', text: '"Berikan saja kode OTP-nya."' },
          { key: 'D', text: '"Jangan diklik, hapus pesannya, dan laporkan."' },
        ],
        answer: 'D',
      },
      {
        id: 4,
        question: 'Penulis menambahkan kisah Bu Tuti untuk ....',
        options: [
          { key: 'A', text: 'menghibur pembaca' },
          { key: 'B', text: 'menunjukkan akibat nyata jika kode OTP dibagikan' },
          { key: 'C', text: 'menceritakan kekayaan Bu Tuti' },
          { key: 'D', text: 'mengkritik guru Raisa' },
        ],
        answer: 'B',
      },
      {
        id: 5,
        question: 'Tindakan Raisa melapor kepada ayahnya relevan karena ....',
        options: [
          { key: 'A', text: 'orang dewasa dapat membantu memeriksa dan mencegah penipuan' },
          { key: 'B', text: 'ayah selalu menang hadiah' },
          { key: 'C', text: 'ponsel harus diserahkan kepada ayah' },
          { key: 'D', text: 'pesan harus disebarkan' },
        ],
        answer: 'A',
      },
      {
        id: 6,
        question: 'Situasi berikut yang paling sejalan dengan isi teks adalah ....',
        options: [
          { key: 'A', text: 'Seorang siswa lupa mengerjakan PR.' },
          { key: 'B', text: 'Seorang ibu membeli sayur di pasar.' },
          { key: 'C', text: 'Seorang bapak menolak memberi kode verifikasi kepada penelepon yang mengaku petugas bank.' },
          { key: 'D', text: 'Anak-anak bermain bola di lapangan.' },
        ],
        answer: 'C',
      },
      {
        id: 7,
        question: 'Pernyataan yang kurang relevan dengan isi teks adalah ....',
        options: [
          { key: 'A', text: 'Penipuan daring bisa menimpa siapa saja.' },
          { key: 'B', text: 'Kode OTP harus dirahasiakan.' },
          { key: 'C', text: 'Pesan dari nomor asing perlu diwaspadai.' },
          { key: 'D', text: 'Harga tiket konser naik setiap tahun.' },
        ],
        answer: 'D',
      },
      {
        id: 8,
        question: 'Nilai dalam teks yang dapat diterapkan sehari-hari adalah ....',
        options: [
          { key: 'A', text: 'rajin menabung' },
          { key: 'B', text: 'waspada terhadap informasi yang tidak jelas' },
          { key: 'C', text: 'suka berbagi' },
          { key: 'D', text: 'disiplin waktu' },
        ],
        answer: 'B',
      },
      {
        id: 9,
        question: 'Pesan guru yang diingat Raisa relevan dengan kehidupan karena ....',
        options: [
          { key: 'A', text: 'dapat mencegah kerugian dari penipuan' },
          { key: 'B', text: 'membuat siswa takut ponsel' },
          { key: 'C', text: 'melarang siswa memakai ponsel' },
          { key: 'D', text: 'menambah hadiah undian' },
        ],
        answer: 'A',
      },
      {
        id: 10,
        question: 'Kalimat yang paling tepat menyimpulkan relevansi teks adalah ....',
        options: [
          { key: 'A', text: 'Hadiah undian dari nomor asing selalu benar.' },
          { key: 'B', text: 'Hanya Bu Tuti yang perlu berhati-hati.' },
          { key: 'C', text: 'Peristiwa dalam teks mengingatkan kita agar waspada terhadap pesan dan telepon mencurigakan.' },
          { key: 'D', text: 'Penipuan hanya terjadi di cerita.' },
        ],
        answer: 'C',
      },
    ],
    essayPrompt:
      'Bagaimana cara kamu dan keluargamu memverifikasi kebenaran pesan berhadiah atau tautan mencurigakan di aplikasi pesan? Tuliskan minimal 3 langkah konkret!',
    accentColor: '#eab308',
    buildingPos: { x: -46, z: 98, rotY: Math.PI / 2 },
  },
  {
    id: 10,
    shortTitle: 'Banding Antarteks',
    title: 'Menilai kesesuaian dan/atau keakuratan unsur, kebahasaan, atau isi berdasarkan perbandingan informasi dalam dan/atau antarteks',
    competency: 'Evaluasi dan Apresiasi',
    isOfficialPacket: true,
    videoTitle: 'V9. Pembahasan Soal TKA Bahasa Indonesia Tingkat SMP/MTs Modul 4',
    videoUrl: 'https://www.youtube.com/watch?v=qWwAYX7xYUo',
    usesGeneralVideoList: true,
    videoConfidence: 'Rendah (memakai daftar video umum V1–V10 Pusmendik)',
    passageTitle: 'Teks 1 (Pengumuman Sekolah)',
    passageText:
      'Kantin Sehat SMP Harapan mulai beroperasi pada 5 Agustus. Kantin menyediakan sekitar 120 porsi setiap hari. Sebanyak 70 persen menunya berupa sayur dan buah. Harga rata-rata satu porsi Rp6.000.',
    secondaryPassageTitle: 'Teks 2 (Laporan OSIS)',
    secondaryPassageText:
      'Survei OSIS pada akhir September menunjukkan kantin sehat menjual rata-rata 100 porsi per hari. Menu sayur dan buah mencapai 60 persen dari seluruh menu. Harga rata-rata satu porsi Rp6.000. Sebanyak 80 persen siswa menyatakan puas, tetapi antrean masih panjang.',
    questions: [
      {
        id: 1,
        question: 'Persamaan informasi pada kedua teks adalah ....',
        options: [
          { key: 'A', text: 'jumlah porsi per hari' },
          { key: 'B', text: 'persentase menu sehat' },
          { key: 'C', text: 'tingkat kepuasan siswa' },
          { key: 'D', text: 'harga rata-rata satu porsi' },
        ],
        answer: 'D',
      },
      {
        id: 2,
        question: 'Perbedaan jumlah porsi pada kedua teks adalah ....',
        options: [
          { key: 'A', text: 'Teks 1 menyebut 100 dan Teks 2 menyebut 120' },
          { key: 'B', text: 'Teks 1 menyebut sekitar 120 dan Teks 2 menyebut rata-rata 100' },
          { key: 'C', text: 'keduanya menyebut 100' },
          { key: 'D', text: 'keduanya tidak menyebut jumlah porsi' },
        ],
        answer: 'B',
      },
      {
        id: 3,
        question: 'Pernyataan yang sesuai dengan kedua teks adalah ....',
        options: [
          { key: 'A', text: 'Kantin mulai beroperasi pada Agustus dan surveinya dilakukan akhir September.' },
          { key: 'B', text: 'Kantin mulai beroperasi pada September.' },
          { key: 'C', text: 'Semua siswa puas.' },
          { key: 'D', text: 'Menu sehat sebanyak 70 persen di kedua teks.' },
        ],
        answer: 'A',
      },
      {
        id: 4,
        question: 'Pernyataan yang TIDAK akurat berdasarkan teks adalah ....',
        options: [
          { key: 'A', text: 'Antrean kantin masih panjang.' },
          { key: 'B', text: 'Sebagian besar siswa puas.' },
          { key: 'C', text: 'Seluruh siswa puas dengan kantin.' },
          { key: 'D', text: 'Harga rata-rata satu porsi Rp6.000.' },
        ],
        answer: 'C',
      },
      {
        id: 5,
        question: 'Penyebab paling masuk akal dari perbedaan angka kedua teks adalah ....',
        options: [
          { key: 'A', text: 'salah satu teks pasti bohong' },
          { key: 'B', text: 'kantin ditutup' },
          { key: 'C', text: 'porsi dikurangi menjadi nol' },
          { key: 'D', text: 'Teks 1 memuat perkiraan penyediaan, Teks 2 memuat hasil survei rata-rata' },
        ],
        answer: 'D',
      },
      {
        id: 6,
        question: 'Kata "sekitar" pada Teks 1 menunjukkan bahwa angka tersebut ....',
        options: [
          { key: 'A', text: 'perkiraan' },
          { key: 'B', text: 'pasti' },
          { key: 'C', text: 'rahasia' },
          { key: 'D', text: 'menurun' },
        ],
        answer: 'A',
      },
      {
        id: 7,
        question: 'Teks yang lebih tepat untuk menilai kepuasan siswa adalah ....',
        options: [
          { key: 'A', text: 'Teks 1' },
          { key: 'B', text: 'keduanya sama' },
          { key: 'C', text: 'Teks 2 karena memuat hasil survei' },
          { key: 'D', text: 'tidak ada' },
        ],
        answer: 'C',
      },
      {
        id: 8,
        question: 'Selisih persentase menu sayur dan buah antara kedua teks adalah ....',
        options: [
          { key: 'A', text: '5 poin persen' },
          { key: 'B', text: '10 poin persen' },
          { key: 'C', text: '20 poin persen' },
          { key: 'D', text: '70 poin persen' },
        ],
        answer: 'B',
      },
      {
        id: 9,
        question:
          'Kalimat "Sebanyak 80 persen siswa menyatakan puas, tetapi antrean masih panjang" memuat hubungan ....',
        options: [
          { key: 'A', text: 'sebab' },
          { key: 'B', text: 'waktu' },
          { key: 'C', text: 'tujuan' },
          { key: 'D', text: 'pertentangan' },
        ],
        answer: 'D',
      },
      {
        id: 10,
        question: 'Jika ditambahkan ke Teks 2, kalimat yang berupa opini adalah ....',
        options: [
          { key: 'A', text: '"Menurut saya, kantin sehat adalah program terbaik di sekolah ini."' },
          { key: 'B', text: '"Kantin menjual rata-rata 100 porsi per hari."' },
          { key: 'C', text: '"Survei dilakukan pada akhir September."' },
          { key: 'D', text: '"Harga rata-rata satu porsi Rp6.000."' },
        ],
        answer: 'A',
      },
    ],
    essayPrompt:
      'Bandingkan informasi antara Teks 1 dan Teks 2 dalam bentuk 3 kalimat ringkas yang menyebutkan persamaan, perbedaan, dan saran perbaikan antrean kantin!',
    accentColor: '#f97316',
    buildingPos: { x: 46, z: 98, rotY: -Math.PI / 2 },
  },
  {
    id: 11,
    shortTitle: 'Respons Emosional',
    title: 'Menyimpulkan respons emosional terhadap unsur teks fiksi',
    competency: 'Evaluasi dan Apresiasi',
    isOfficialPacket: true,
    videoTitle: 'V10. Komplit 30 Soal Prediksi TKA B. Indonesia SMP 2026 Part 1-10',
    videoUrl: 'https://www.youtube.com/watch?v=CDj-CxVBZ8Q',
    usesGeneralVideoList: true,
    videoConfidence: 'Rendah (memakai daftar video umum V1–V10 Pusmendik)',
    passageTitle: 'Surat dari Kakek',
    passageText:
      'Hujan baru reda ketika Naya menemukan kotak kayu di bawah tempat tidur. Di dalamnya ada sebuah kompas tua dan secarik surat dari Kakek yang telah meninggal setahun lalu. "Naya, kalau kamu tersesat, ingatlah bahwa arah pulang ada di hatimu," tulis Kakek. Naya menggenggam kompas itu erat-erat. Matanya memanas, tetapi bibirnya tersenyum. Ia teringat Kakek yang sering mengajaknya berjalan di kebun sambil bercerita. Malam itu, Naya menaruh kompas di dekat bantalnya, seolah Kakek masih menjaganya.',
    questions: [
      {
        id: 1,
        question: 'Perasaan Naya saat menemukan surat Kakek adalah ....',
        options: [
          { key: 'A', text: 'haru dan rindu' },
          { key: 'B', text: 'marah' },
          { key: 'C', text: 'takut' },
          { key: 'D', text: 'bosan' },
        ],
        answer: 'A',
      },
      {
        id: 2,
        question: 'Kalimat yang menunjukkan perasaan sedih dan senang bercampur adalah ....',
        options: [
          { key: 'A', text: 'Hujan baru reda.' },
          { key: 'B', text: 'Naya menemukan kotak kayu.' },
          { key: 'C', text: 'Di dalamnya ada sebuah kompas tua.' },
          { key: 'D', text: 'Matanya memanas, tetapi bibirnya tersenyum.' },
        ],
        answer: 'D',
      },
      {
        id: 3,
        question: 'Respons emosional pembaca yang paling sesuai dengan cerita adalah ....',
        options: [
          { key: 'A', text: 'geli' },
          { key: 'B', text: 'ikut terharu' },
          { key: 'C', text: 'kesal' },
          { key: 'D', text: 'cemas' },
        ],
        answer: 'B',
      },
      {
        id: 4,
        question: 'Naya menggenggam kompas erat-erat menunjukkan bahwa ia ....',
        options: [
          { key: 'A', text: 'ingin membuangnya' },
          { key: 'B', text: 'merasa bosan' },
          { key: 'C', text: 'tidak ingin kehilangan kenangan tentang Kakek' },
          { key: 'D', text: 'marah kepada Kakek' },
        ],
        answer: 'C',
      },
      {
        id: 5,
        question: 'Pembaca dapat ikut merasa haru karena ....',
        options: [
          { key: 'A', text: 'surat Kakek berisi pesan hangat dan Naya merindukannya' },
          { key: 'B', text: 'hujan baru saja reda' },
          { key: 'C', text: 'kotak itu terbuat dari kayu' },
          { key: 'D', text: 'kompas itu sudah tua' },
        ],
        answer: 'A',
      },
      {
        id: 6,
        question: 'Perasaan Naya di akhir cerita adalah ....',
        options: [
          { key: 'A', text: 'cemas dan gelisah' },
          { key: 'B', text: 'marah dan kecewa' },
          { key: 'C', text: 'bosan dan lelah' },
          { key: 'D', text: 'tenang karena merasa dijaga Kakek' },
        ],
        answer: 'D',
      },
      {
        id: 7,
        question: 'Ungkapan "seolah Kakek masih menjaganya" menggambarkan perasaan Naya yang ....',
        options: [
          { key: 'A', text: 'takut' },
          { key: 'B', text: 'merasa ditemani dan aman' },
          { key: 'C', text: 'benci' },
          { key: 'D', text: 'malu' },
        ],
        answer: 'B',
      },
      {
        id: 8,
        question: 'Jika berada di posisi Naya, respons yang paling sejalan dengan suasana cerita adalah ....',
        options: [
          { key: 'A', text: 'menyimpan surat itu tanpa membacanya' },
          { key: 'B', text: 'membuang kompas itu' },
          { key: 'C', text: 'menyimpan kompas sebagai pengingat Kakek' },
          { key: 'D', text: 'menceritakannya sambil bercanda' },
        ],
        answer: 'C',
      },
      {
        id: 9,
        question: 'Unsur cerita yang paling kuat membangkitkan rasa haru adalah ....',
        options: [
          { key: 'A', text: 'surat dan kompas peninggalan Kakek' },
          { key: 'B', text: 'hujan yang baru reda' },
          { key: 'C', text: 'kebun di belakang rumah' },
          { key: 'D', text: 'malam hari' },
        ],
        answer: 'A',
      },
      {
        id: 10,
        question: 'Kesimpulan respons emosional terhadap cerita tersebut adalah ....',
        options: [
          { key: 'A', text: 'Cerita membuat pembaca merasa takut.' },
          { key: 'B', text: 'Cerita membuat pembaca merasa marah.' },
          { key: 'C', text: 'Cerita membuat pembaca merasa geli.' },
          { key: 'D', text: 'Cerita mengundang rasa haru dan rindu karena menggambarkan kenangan pada orang tersayang.' },
        ],
        answer: 'D',
      },
    ],
    essayPrompt:
      'Tuliskan respons emosionalmu setelah membaca cerita "Surat dari Kakek" dan bagian mana dari cerita tersebut yang paling menyentuh hatimu!',
    accentColor: '#6366f1',
    buildingPos: { x: 0, z: -102, rotY: 0 },
  },
];

export function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?rel=0`;
      const list = parsed.searchParams.get('list');
      if (list) return `https://www.youtube.com/embed/videoseries?list=${list}&rel=0`;
    }
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    }
    return null;
  } catch {
    return null;
  }
}
