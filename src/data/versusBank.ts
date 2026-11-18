import type { VersusQuestion } from '../types/game';

interface PassageEntry {
  category: string;
  passageTitle: string;
  passageText: string;
  items: {
    question: string;
    options: [string, string, string, string];
    answer: 'A' | 'B' | 'C' | 'D';
  }[];
}

const VERSUS_PASSAGES: PassageEntry[] = [
  {
    category: 'Teks Laporan Observasi',
    passageTitle: 'Terumbu Karang Raja Ampat',
    passageText:
      'Perairan Raja Ampat di Papua Barat dikenal memiliki keanekaragaman hayati laut tertinggi di dunia. Di kawasan ini hidup lebih dari 500 jenis karang keras yang membentuk ekosistem terumbu karang sehat. Terumbu karang berfungsi sebagai tempat berlindung dan mencari makan bagi ribuan spesies ikan karang. Namun, peningkatan suhu permukaan laut serta jangkar perahu yang tidak ramah lingkungan dapat memicu pemutihan karang (coral bleaching). Oleh karena itu, pengelola kawasan menerapkan zona larang tangkap dan pelampung tambat agar perahu wisata tidak merusak karang.',
    items: [
      {
        question: 'Berdasarkan teks, fungsi utama pelampung tambat di Raja Ampat adalah ....',
        options: [
          'menarik wisatawan mancanegara agar berenang lebih jauh',
          'mencegah kerusakan karang akibat jatuhnya jangkar perahu',
          'menurunkan suhu permukaan air laut secara alami',
          'menambah jumlah ikan karang di zona tangkap',
        ],
        answer: 'B',
      },
      {
        question: 'Istilah coral bleaching dalam bacaan tersebut merujuk pada peristiwa ....',
        options: [
          'pemutihan karang akibat kenaikan suhu laut dan gangguan lingkungan',
          'pertumbuhan karang keras yang melebihi 500 jenis',
          'perpindahan ikan karang ke perairan laut dalam',
          'pembentukan pulau-pulau kecil di Papua Barat',
        ],
        answer: 'A',
      },
      {
        question: 'Gagasan utama paragraf tersebut adalah ....',
        options: [
          'cara wisatawan memancing ikan di Papua Barat',
          'jenis-jenis jangkar perahu tradisional Nusantara',
          'kekayaan terumbu karang Raja Ampat beserta upaya pelestariannya',
          'dampak pariwisata terhadap pendapatan masyarakat pesisir',
        ],
        answer: 'C',
      },
      {
        question: 'Kalimat yang menyatakan hubungan sebab-akibat dalam teks ditandai dengan konjungsi ....',
        options: ['namun', 'serta', 'oleh karena itu', 'sedangkan'],
        answer: 'C',
      },
      {
        question: 'Simpulan yang paling tepat sesuai isi teks adalah ....',
        options: [
          'seluruh perairan Papua Barat tertutup bagi kapal wisata',
          'kelestarian terumbu karang membutuhkan pengaturan aktivitas manusia',
          'karang keras tidak dapat hidup di daerah beriklim tropis',
          'zona larang tangkap hanya berlaku bagi nelayan asing',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Eksplanasi',
    passageTitle: 'Proses Terjadinya Embun Pagi',
    passageText:
      'Embun sering terlihat menempel pada daun dan rumput di pagi hari yang cerah dan tenang. Fenomena ini terjadi karena pada malam hari permukaan bumi melepaskan panas radiasi ke atmosfer sehingga suhu daun turun drastis. Ketika udara lembap di sekitar daun bersentuhan dengan permukaan yang dingin tersebut, uap air mengalami kondensasi. Uap air berubah wujud menjadi titik-titik air kecil tanpa melalui fase awan. Apabila suhu udara turun di bawah nol derajat Celsius, embun tersebut dapat membeku menjadi embun beku atau frost.',
    items: [
      {
        question: 'Penyebab utama turunnya suhu daun pada malam hari menurut teks adalah ....',
        options: [
          'tiupan angin kencang dari pegunungan',
          'pelepasan panas radiasi oleh permukaan bumi ke atmosfer',
          'penguapan air hujan yang tertampung di daun',
          'pembentukan awan mendung di lapisan stratosfer',
        ],
        answer: 'B',
      },
      {
        question: 'Makna kata kondensasi pada bacaan di atas adalah ....',
        options: [
          'perubahan wujud uap air menjadi titik-titik air karena pendinginan',
          'proses penyerapan air tanah oleh akar tumbuhan',
          'pembekuan air sungai menjadi bongkahan es',
          'penguapan air laut akibat sinar matahari',
        ],
        answer: 'A',
      },
      {
        question: 'Kondisi yang memicu terbentuknya frost adalah ....',
        options: [
          'udara sangat kering dan berangin kencang',
          'daun terkena sinar matahari langsung pada siang hari',
          'suhu udara turun hingga di bawah nol derajat Celsius',
          'uap air berkumpul membentuk awan hujan lebat',
        ],
        answer: 'C',
      },
      {
        question: 'Pola pengembangan yang dominan dalam teks tersebut adalah ....',
        options: [
          'pertentangan dan perbandingan',
          'kausalitas (sebab-akibat) dan kronologis proses',
          'definisi dan klasifikasi benda',
          'persuasi dan ajakan langsung',
        ],
        answer: 'B',
      },
      {
        question: 'Pernyataan yang tidak sesuai dengan teks adalah ....',
        options: [
          'embun terbentuk langsung di permukaan yang dingin tanpa menjadi awan',
          'embun sering muncul pada pagi hari setelah malam yang tenang',
          'udara lembap berperan penting dalam pembentukan embun',
          'embun hanya dapat terbentuk di daerah bersalju',
        ],
        answer: 'D',
      },
    ],
  },
  {
    category: 'Cerpen Inspiratif',
    passageTitle: 'Sepeda Ontel Kakek',
    passageText:
      'Setiap pukul lima pagi, Raka selalu mendengar bunyi bel sepeda ontel tua milik Kakek Wiryo di halaman. Sepeda hitam berkarat itu sudah menemani kakek mengantar sayuran ke pasar selama tiga puluh tahun. Suatu hari Raka menawarkan sepeda lipat barunya yang ringan, tetapi Kakek menolak sambil tersenyum. "Ontel ini bukan sekadar besi, Ka. Di setiap kayuhannya ada kesabaran yang mengajarkan kakek tidak menyerah," ujar Kakek. Mendengar ucapan itu, Raka terdiam dan segera mengambil kain lap untuk membersihkan setang sepeda tua tersebut.',
    items: [
      {
        question: 'Watak tokoh Kakek Wiryo dalam kutipan cerpen tersebut adalah ....',
        options: [
          'keras kepala dan mudah tersinggung',
          'tekun, bersahaja, dan menghargai perjuangan',
          'pemalu dan tidak suka dibantu cucunya',
          'boros dan gemar mengganti kendaraan',
        ],
        answer: 'B',
      },
      {
        question: 'Latar waktu yang tampak jelas pada awal kutipan cerita adalah ....',
        options: ['tengah malam', 'sore menjelang magrib', 'dini hari pukul lima pagi', 'siang terik'],
        answer: 'C',
      },
      {
        question: 'Alasan Kakek Wiryo menolak tawaran sepeda lipat dari Raka adalah ....',
        options: [
          'sepeda lipat tidak muat membawa sayuran',
          'sepeda ontel menyimpan nilai kesabaran dan kenangan perjuangan',
          'kakek belum bisa mengendarai sepeda modern',
          'harga sepeda lipat terlalu mahal bagi Raka',
        ],
        answer: 'B',
      },
      {
        question: 'Tindakan Raka di akhir cerita menunjukkan perubahan sikap berupa ....',
        options: [
          'kekecewaan karena hadiahnya ditolak',
          'rasa hormat dan kepedulian terhadap nilai yang dipegang kakek',
          'keinginan untuk menjual sepeda tua ke pasar',
          'keengganan membantu kakek membersihkan halaman',
        ],
        answer: 'B',
      },
      {
        question: 'Amanat yang paling tepat dipetik dari kutipan cerpen di atas adalah ....',
        options: [
          'barang lama harus segera diganti dengan yang baru',
          'kesabaran dan ketekunan dalam bekerja patut dihargai dan diteladani',
          'anak muda sebaiknya tidak bersepeda ke pasar',
          'sepeda lipat hanya cocok untuk olahraga kota',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Berita',
    passageTitle: 'Pasar Apung Ramah Lingkungan',
    passageText:
      'Pemerintah Kabupaten Banjar meresmikan program Pasar Apung Bebas Plastik di Sungai Martapura pada Minggu pagi (12/10). Dalam program ini, para pedagang perahu menggunakan daun pisang, anyaman purun, dan besek bambu sebagai pengganti kantong plastik sekali pakai. Kepala Dinas Lingkungan Hidup setempat menjelaskan bahwa kebijakan tersebut mampu menekan timbulan sampah sungai hingga 40 persen dalam dua bulan uji coba. Pengunjung juga disediakan stasiun isi ulang air minum gratis di dermaga utama.',
    items: [
      {
        question: 'Unsur berita "kapan" dalam teks tersebut dijawab oleh informasi ....',
        options: [
          'di Sungai Martapura',
          'Minggu pagi (12/10)',
          'Kepala Dinas Lingkungan Hidup',
          'dalam dua bulan uji coba',
        ],
        answer: 'B',
      },
      {
        question: 'Bahan pengganti plastik yang digunakan pedagang di Pasar Apung antara lain ....',
        options: [
          'kertas minyak dan stirofoam',
          'daun pisang, anyaman purun, dan besek bambu',
          'kaleng aluminium dan botol kaca',
          'kain sintetis dan jaring nilon',
        ],
        answer: 'B',
      },
      {
        question: 'Dampak positif uji coba program tersebut menurut teks adalah ....',
        options: [
          'jumlah perahu pedagang meningkat dua kali lipat',
          'sampah plastik di sungai berkurang hingga 40 persen',
          'harga sayuran di dermaga menjadi jauh lebih murah',
          'pengunjung dilarang membawa makanan dari rumah',
        ],
        answer: 'B',
      },
      {
        question: 'Fasilitas tambahan yang disiapkan bagi pengunjung di dermaga utama adalah ....',
        options: [
          'tempat parkir perahu listrik',
          'stasiun isi ulang air minum gratis',
          'penjualan kantong plastik daur ulang',
          'pusat pelatihan anyaman rotan',
        ],
        answer: 'B',
      },
      {
        question: 'Kata "menekan" pada kalimat ketiga bermakna ....',
        options: [
          'mendorong dengan kuat menggunakan tangan',
          'mengurangi atau menurunkan jumlah',
          'memaksa pedagang menutup perahu',
          'menimbun sampah di dasar sungai',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Persuasi',
    passageTitle: 'Kurangi Gawai Sebelum Tidur',
    passageText:
      'Banyak pelajar terbiasa menatap layar ponsel hingga larut malam sebelum terlelap. Padahal, cahaya biru dari layar gawai menghambat produksi hormon melatonin yang mengatur rasa kantuk. Akibatnya, kualitas tidur menurun dan konsentrasi belajar di sekolah keesokan harinya ikut terganggu. Mulai malam ini, mari terapkan aturan bebas gawai minimal tiga puluh menit sebelum tidur. Gantilah waktu tersebut dengan membaca buku cetak atau menyiapkan perlengkapan sekolah esok hari.',
    items: [
      {
        question: 'Tujuan utama penulis menulis paragraf persuasi tersebut adalah ....',
        options: [
          'mengajak pelajar menghentikan penggunaan gawai sebelum tidur',
          'mempromosikan aplikasi pengatur cahaya layar ponsel',
          'melarang siswa membawa ponsel ke lingkungan sekolah',
          'menjelaskan sejarah penemuan hormon melatonin',
        ],
        answer: 'A',
      },
      {
        question: 'Dampak biologis cahaya biru layar gawai menurut teks adalah ....',
        options: [
          'mempercepat pertumbuhan tulang pelajar',
          'menghambat produksi hormon melatonin pengatur rasa kantuk',
          'meningkatkan daya ingat saat membaca buku cetak',
          'membuat baterai ponsel cepat habis pada malam hari',
        ],
        answer: 'B',
      },
      {
        question: 'Kalimat ajakan dalam teks tersebut tampak pada kalimat ....',
        options: [
          'Banyak pelajar terbiasa menatap layar ponsel hingga larut malam.',
          'Cahaya biru dari layar gawai menghambat hormon melatonin.',
          'Mulai malam ini, mari terapkan aturan bebas gawai minimal tiga puluh menit sebelum tidur.',
          'Kualitas tidur menurun dan konsentrasi belajar terganggu.',
        ],
        answer: 'C',
      },
      {
        question: 'Alternatif kegiatan yang disarankan penulis menjelang tidur adalah ....',
        options: [
          'menonton siaran televisi hingga mengantuk',
          'membaca buku cetak atau menyiapkan perlengkapan sekolah',
          'bermain gim daring bersama teman sekelas',
          'minum kopi hangat agar tetap terjaga',
        ],
        answer: 'B',
      },
      {
        question: 'Hubungan antara kualitas tidur yang buruk dan kegiatan di sekolah menurut teks adalah ....',
        options: [
          'kualitas tidur menurun menyebabkan konsentrasi belajar terganggu',
          'konsentrasi belajar meningkat setelah begadang',
          'tidur larut malam membuat siswa lebih bersemangat olahraga',
          'tidak ada kaitan antara tidur dan prestasi belajar',
        ],
        answer: 'A',
      },
    ],
  },
  {
    category: 'Teks Prosedur',
    passageTitle: 'Membuat Kompos Takakura di Rumah',
    passageText:
      'Keranjang kompos Takakura memudahkan keluarga mengolah sampah dapur menjadi pupuk organik tanpa bau menyengat. Pertama, lapisi bagian dalam keranjang berventilasi dengan kardus tebal agar kelembapan terjaga. Kedua, masukkan bantalan sekam padi di dasar keranjang sebagai penyerap air lindi. Ketiga, tuangkan starter kompos matang setinggi seperempat keranjang. Keempat, cacah sisa sayur dan kulit buah menjadi potongan kecil lalu aduk rata ke dalam starter. Terakhir, tutup bagian atas dengan bantal sekam kedua dan kain berpori agar lalat tidak masuk.',
    items: [
      {
        question: 'Fungsi bantalan sekam padi di dasar keranjang Takakura adalah ....',
        options: [
          'menghias keranjang agar tampak rapi',
          'menyerap kelebihan air lindi dari sampah organik',
          'mempercepat pembusukan plastik dan kaca',
          'mengundang serangga masuk ke dalam dapur',
        ],
        answer: 'B',
      },
      {
        question: 'Mengapa sisa sayur dan kulit buah perlu dicacah kecil sebelum dimasukkan?',
        options: [
          'supaya lebih mudah terurai dan tercampur rata dengan starter',
          'agar berat keranjang menjadi lebih ringan saat diangkat',
          'supaya kardus pelapis tidak perlu digunakan lagi',
          'agar suhu di dalam keranjang turun di bawah nol derajat',
        ],
        answer: 'A',
      },
      {
        question: 'Bahan yang diletakkan paling akhir di atas campuran kompos adalah ....',
        options: [
          'kardus tebal',
          'potongan daging mentah',
          'bantal sekam kedua dan kain berpori',
          'pasir pantai dan kerikil',
        ],
        answer: 'C',
      },
      {
        question: 'Kata kerja imperatif (perintah) yang terdapat dalam teks prosedur di atas adalah ....',
        options: [
          'memudahkan, mengolah, menjadi',
          'lapisi, masukkan, tuangkan, cacah, aduk, tutup',
          'menyengat, terjaga, matang',
          'pertama, kedua, ketiga, keempat',
        ],
        answer: 'B',
      },
      {
        question: 'Jenis sampah yang sesuai diolah menggunakan langkah pada teks adalah ....',
        options: [
          'kemasan mi instan dan kaleng susu',
          'sisa sayuran dan kulit buah',
          'pecahan kaca dan baterai bekas',
          'kain perca berbahan sintetis',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Tanggapan',
    passageTitle: 'Program Kantin Kejujuran Sekolah',
    passageText:
      'Keberadaan Kantin Kejujuran di SMP Harapan patut diapresiasi karena melatih kemandirian dan integritas siswa sejak dini. Dalam praktiknya, siswa mengambil sendiri makanan yang tersedia lalu memasukkan uang pas ke kotak pembayaran tanpa penjaga. Meskipun demikian, evaluasi bulan pertama menunjukkan adanya selisih kas sebesar delapan persen. Kondisi ini bukanlah alasan untuk menutup kantin, melainkan pengingat agar pengelola menambahkan papan panduan harga yang lebih jelas serta pembiasaan refleksi pagi tentang nilai kejujuran.',
    items: [
      {
        question: 'Sikap penulis terhadap program Kantin Kejujuran adalah ....',
        options: [
          'menolak program karena menimbulkan kerugian kas',
          'mendukung sekaligus memberi saran perbaikan atas kendala yang muncul',
          'mengusulkan agar penjaga kantin diganti dengan kamera pengawas',
          'mengabaikan selisih kas karena nilainya kecil',
        ],
        answer: 'B',
      },
      {
        question: 'Kalimat pujian dalam teks tanggapan di atas terdapat pada kalimat ....',
        options: ['pertama', 'kedua', 'ketiga', 'keempat'],
        answer: 'A',
      },
      {
        question: 'Masalah yang ditemukan pada bulan pertama pelaksanaan kantin adalah ....',
        options: [
          'makanan yang dijual cepat basi',
          'tidak ada siswa yang mau jajan',
          'terdapat selisih kas sebesar delapan persen',
          'kotak pembayaran rusak akibat hujan',
        ],
        answer: 'C',
      },
      {
        question: 'Solusi yang ditawarkan penulis untuk mengatasi kendala tersebut adalah ....',
        options: [
          'menutup sementara Kantin Kejujuran hingga akhir semester',
          'menambahkan papan panduan harga yang jelas dan pembiasaan refleksi pagi',
          'menaikkan harga seluruh makanan sebesar delapan persen',
          'mewajibkan guru berjaga di depan kotak pembayaran',
        ],
        answer: 'B',
      },
      {
        question: 'Makna kata integritas pada teks tersebut adalah ....',
        options: [
          'kecepatan dalam menghitung uang kembalian',
          'mutu atau sifat yang menunjukkan kesatuan utuh sehingga memancarkan kewibawaan dan kejujuran',
          'kemampuan berdagang untuk memperoleh keuntungan besar',
          'ketaatan membawa bekal makanan dari rumah',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Fabel',
    passageTitle: 'Tupai dan Pohon Beringin',
    passageText:
      'Musim kemarau panjang membuat sungai di tepi hutan mengering. Si Tupai panik karena persediaan kacang di lubangnya hampir habis, sedangkan ia belum pernah menyimpan air. Ia melihat Pohon Beringin tetap berdiri kokoh dengan daun hijau lebat. "Mengapa engkau tidak layu, Beringin?" tanya Tupai heran. Beringin menjawab tenang, "Jauh sebelum kemarau tiba, aku menumbuhkan akar dalam-dalam untuk mencari mata air tersembunyi." Tupai pun tersadar bahwa persiapan yang tekun sebelum kesulitan datang jauh lebih berharga daripada penyesalan.',
    items: [
      {
        question: 'Konflik yang dialami tokoh Tupai dalam fabel di atas adalah ....',
        options: [
          'lubang tempat tinggalnya kebanjiran saat hujan deras',
          'kekurangan persediaan makanan dan air saat kemarau panjang',
          'dimarahi Pohon Beringin karena mematahkan ranting',
          'tersesat di tepi sungai saat mencari buah',
        ],
        answer: 'B',
      },
      {
        question: 'Mengapa Pohon Beringin tetap hijau di tengah musim kemarau?',
        options: [
          'karena disiram setiap hari oleh penghuni hutan',
          'karena memiliki akar yang dalam untuk menjangkau mata air',
          'karena daunnya tidak membutuhkan air sama sekali',
          'karena tumbuh di atas batu karang yang lembap',
        ],
        answer: 'B',
      },
      {
        question: 'Sifat tokoh Pohon Beringin yang patut diteladani adalah ....',
        options: [
          'sombong atas kekuatannya',
          'tenang, bijaksana, dan visioner dalam mempersiapkan diri',
          'acuh tak acuh terhadap penderitaan teman',
          'terburu-buru mengambil keputusan',
        ],
        answer: 'B',
      },
      {
        question: 'Pesan moral yang sesuai dengan isi fabel tersebut adalah ....',
        options: [
          'persiapan matang sejak awal sangat penting untuk menghadapi masa sulit',
          'jangan pernah bertanya kepada makhluk yang lebih tua',
          'musim kemarau selalu membawa bencana bagi seluruh pohon',
          'simpanlah kacang di atas dahan agar tidak diambil hewan lain',
        ],
        answer: 'A',
      },
      {
        question: 'Bagian teks yang menunjukkan resolusi (penyelesaian kesadaran tokoh) adalah ....',
        options: [
          'kalimat pertama',
          'kalimat kedua',
          'kalimat ketiga',
          'kalimat terakhir',
        ],
        answer: 'D',
      },
    ],
  },
  {
    category: 'Teks Biografi',
    passageTitle: 'Mohammad Hatta dan Budaya Membaca',
    passageText:
      'Sejak remaja di Bukittinggi, Mohammad Hatta telah memiliki kecintaan luar biasa terhadap buku. Ketika melanjutkan pendidikan di Belanda, separuh uang sakunya ia sisihkan khusus untuk membeli buku ilmu ekonomi, sejarah, dan filsafat. Bahkan saat diasingkan ke Boven Digoel, Bung Hatta membawa enam belas peti berisi buku-buku pribadinya. Baginya, penjara fisik tidak dapat membelenggu pikiran manusia selama buku masih dibaca. Di tempat pengasingan itu pula ia mengajar sesama tahanan dan menulis berbagai artikel pemikiran.',
    items: [
      {
        question: 'Keteladanan utama tokoh Mohammad Hatta dalam bacaan tersebut adalah ....',
        options: [
          'gemar berpetualang ke berbagai benua',
          'semangat belajar dan membaca yang tak pernah padam meski dalam pengasingan',
          'keberhasilannya mengumpulkan peti kayu di Belanda',
          'kemampuannya berdagang buku di Bukittinggi',
        ],
        answer: 'B',
      },
      {
        question: 'Informasi tersurat tentang kebiasaan Bung Hatta saat kuliah di Belanda adalah ....',
        options: [
          'ia bekerja paruh waktu di perpustakaan kota',
          'separuh uang sakunya disisihkan untuk membeli buku',
          'ia meminjam enam belas peti buku dari kampusnya',
          'ia hanya membaca buku bertema sastra fiksi',
        ],
        answer: 'B',
      },
      {
        question: 'Makna ungkapan "penjara fisik tidak dapat membelenggu pikiran manusia" adalah ....',
        options: [
          'kebebasan berpikir dan berkarya tetap hidup walau raga dibatasi ruang gerak',
          'semua penjara di masa lalu tidak memiliki pintu yang kuat',
          'buku dapat digunakan untuk membuka kunci ruang tahanan',
          'orang yang suka membaca tidak pernah dihukum',
        ],
        answer: 'A',
      },
      {
        question: 'Kegiatan positif yang dilakukan Bung Hatta di Boven Digoel selain membaca adalah ....',
        options: [
          'berkebun sayur dan berlayar',
          'mengajar sesama tahanan dan menulis artikel pemikiran',
          'mendirikan toko buku di pelabuhan',
          'menerjemahkan kamus bahasa daerah',
        ],
        answer: 'B',
      },
      {
        question: 'Kata rujukan "-nya" pada frasa "uang sakunya" merujuk kepada ....',
        options: ['Bukittinggi', 'Belanda', 'Mohammad Hatta', 'Boven Digoel'],
        answer: 'C',
      },
    ],
  },
  {
    category: 'Artikel Ilmiah Populer',
    passageTitle: 'Mengapa Daun Berubah Warna?',
    passageText:
      'Sebagian besar daun tampak hijau karena mengandung pigmen klorofil yang menyerap cahaya matahari untuk fotosintesis. Sebenarnya, di dalam daun juga tersimpan pigmen karotenoid berwarna kuning-oranye dan antosianin berwarna merah. Selama musim tumbuh yang hangat, jumlah klorofil jauh lebih dominan sehingga warna lain tertutup. Ketika hari mulai pendek dan suhu menurun di daerah beriklim sedang, tumbuhan menghentikan produksi klorofil. Klorofil yang tersisa terurai perlahan, sehingga warna kuning, jingga, dan merah yang semula tersembunyi akhirnya tampak memukau.',
    items: [
      {
        question: 'Pigmen yang memberi warna kuning-oranye pada daun menurut teks adalah ....',
        options: ['klorofil', 'karotenoid', 'antosianin', 'melatonin'],
        answer: 'B',
      },
      {
        question: 'Mengapa warna merah dan kuning pada daun tidak terlihat saat musim hangat?',
        options: [
          'karena pigmen tersebut belum diproduksi oleh akar',
          'karena tertutup oleh jumlah klorofil yang jauh lebih dominan',
          'karena terurai oleh sinar matahari yang terlalu terik',
          'karena daun menyerap warna hijau dari tanah',
        ],
        answer: 'B',
      },
      {
        question: 'Pemicu berhentinya produksi klorofil di daerah beriklim sedang adalah ....',
        options: [
          'durasi siang yang lebih pendek dan penurunan suhu',
          'kekurangan air hujan sepanjang tahun',
          'serangan hama pemakan daun pada musim panas',
          'bertambahnya jumlah karotenoid di udara',
        ],
        answer: 'A',
      },
      {
        question: 'Makna kata "dominan" dalam bacaan tersebut adalah ....',
        options: [
          'sangat lemah atau hampir hilang',
          'berpengaruh paling kuat atau paling banyak jumlahnya',
          'berubah bentuk secara cepat',
          'berada di bagian ujung batang',
        ],
        answer: 'B',
      },
      {
        question: 'Judul lain yang paling sesuai mewakili keseluruhan isi artikel adalah ....',
        options: [
          'Cara Menanam Pohon di Iklim Tropis',
          'Rahasia Pigmen di Balik Perubahan Warna Daun',
          'Manfaat Fotosintesis bagi Hewan Ternak',
          'Bahaya Suhu Dingin bagi Tanaman Hias',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Deskripsi',
    passageTitle: 'Pesona Kampung Batik Laweyan',
    passageText:
      'Memasuki lorong-lorong Kampung Batik Laweyan di Surakarta, pengunjung langsung disambut deretan rumah berpagar tembok tinggi khas saudagar masa lampau. Dinding-dinding gang dicat putih bersih dengan mural motif parang dan kawung yang memikat mata. Di balik pintu kayu berukir, aroma khas malam atau lilin batik yang dipanaskan di atas wajan kecil terasa semerbak. Suara lirih canting yang digoreskan para perajin di atas kain mori berpadu dengan gemericik air bilasan pewarna alami, menciptakan suasana tenang yang sarat warisan budaya.',
    items: [
      {
        question: 'Indra penciuman pembaca digugah oleh penulis melalui kalimat ....',
        options: [
          'dinding-dinding gang dicat putih bersih dengan mural motif parang',
          'aroma khas malam atau lilin batik yang dipanaskan terasa semerbak',
          'pengunjung disambut deretan rumah berpagar tembok tinggi',
          'suara lirih canting yang digoreskan di atas kain mori',
        ],
        answer: 'B',
      },
      {
        question: 'Motif mural yang menghiasi dinding gang Kampung Laweyan adalah ....',
        options: [
          'mega mendung dan truntum',
          'parang dan kawung',
          'sido mukti dan sekar jagad',
          'tumpal dan pucuk rebung',
        ],
        answer: 'B',
      },
      {
        question: 'Arti kata "malam" dalam konteks teks deskripsi tersebut adalah ....',
        options: [
          'waktu setelah matahari terbenam',
          'lilin khusus yang digunakan dalam membatik',
          'nama pewarna alami dari kulit kayu',
          'pintu kayu berukir khas Jawa',
        ],
        answer: 'B',
      },
      {
        question: 'Kesan suasana yang tergambar saat mengunjungi Kampung Batik Laweyan adalah ....',
        options: [
          'bising dan penuh kemacetan kendaraan',
          'tenang, artistik, dan kaya warisan budaya',
          'sepi dan terbengkalai tanpa aktivitas',
          'serba modern dengan gedung kaca tinggi',
        ],
        answer: 'B',
      },
      {
        question: 'Objek utama yang dideskripsikan dalam paragraf tersebut adalah ....',
        options: [
          'cara menjual batik secara daring',
          'suasana dan ciri khas lingkungan Kampung Batik Laweyan',
          'sejarah keraton di Jawa Tengah',
          'perbandingan batik tulis dan batik cetak',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Puisi Modern',
    passageTitle: 'Senja di Dermaga Kecil',
    passageText:
      'Layar perahu pulang membawa jingga\nAngin asin mengusap peluh nelayan tua\nDi papan kayu dermaga yang lapuk\nLangkah-langkah kecil berlari menjemput asa\n\nTak ada emas di dalam palka\nHanya perak sisik ikan dan doa yang tak putus\nSebab bagi laut yang ramah\nKerja keras tak pernah pulang dengan tangan hampa.',
    items: [
      {
        question: 'Suasana yang tergambar dalam puisi "Senja di Dermaga Kecil" adalah ....',
        options: [
          'cekaman ketakutan di tengah badai besar',
          'kehangatan harapan dan syukur atas kerja keras',
          'kemarahan nelayan karena hasil tangkapan sedikit',
          'kesepian di kota besar yang padat',
        ],
        answer: 'B',
      },
      {
        question: 'Majas yang terdapat pada larik "Angin asin mengusap peluh nelayan tua" adalah ....',
        options: ['hiperbola', 'personifikasi', 'ironi', 'litotes'],
        answer: 'B',
      },
      {
        question: 'Frasa "perak sisik ikan" dalam bait kedua melambangkan ....',
        options: [
          'harta karun logam mulia di dasar laut',
          'hasil tangkapan ikan yang berharga bagi kehidupan keluarga nelayan',
          'warna cat perahu yang baru diperbaiki',
          'pantulan cahaya lampu mercusuar',
        ],
        answer: 'B',
      },
      {
        question: 'Makna larik "Langkah-langkah kecil berlari menjemput asa" adalah ....',
        options: [
          'anak-anak yang menyambut kepulangan ayah mereka dengan penuh harapan',
          'pedagang yang tergesa-gesa meninggalkan dermaga',
          'hewan pantai yang mencari makan di pasir',
          'nelayan yang berlari menjauhi ombak tinggi',
        ],
        answer: 'A',
      },
      {
        question: 'Amanat utama puisi tersebut adalah ....',
        options: [
          'setiap usaha yang dilakukan dengan tekun dan doa akan membuahkan hasil',
          'sebaiknya nelayan bekerja hanya pada pagi hari',
          'dermaga kayu harus segera diganti dermaga beton',
          'laut hanya ramah kepada perahu bermesin besar',
        ],
        answer: 'A',
      },
    ],
  },
  {
    category: 'Teks Diskusi',
    passageTitle: 'Seragam Sekolah: Perlukah Aturan Ketat?',
    passageText:
      'Penggunaan seragam sekolah kerap memicu perdebatan di kalangan pelajar dan orang tua. Pihak yang mendukung berpendapat bahwa seragam menyamarkan perbedaan latar belakang ekonomi sehingga siswa lebih fokus belajar dan merasa setara. Selain itu, seragam menumbuhkan identitas serta rasa bangga terhadap almamater. Sebaliknya, sebagian pihak menilai aturan seragam yang terlalu kaku membatasi ekspresi diri siswa dan menambah beban biaya ketika jenis seragam terlalu banyak. Jalan tengahnya, sekolah dapat mempertahankan seragam utama yang sederhana sambil memberi ruang ekspresi pada hari kegiatan khusus.',
    items: [
      {
        question: 'Argumen pendukung (pro) terhadap penggunaan seragam dalam teks adalah ....',
        options: [
          'menambah biaya pembelian perlengkapan setiap semester',
          'menyamarkan perbedaan ekonomi dan menumbuhkan identitas sekolah',
          'membatasi kebebasan berkreasi dalam berpakaian',
          'memudahkan guru menghafal nama seluruh siswa',
        ],
        answer: 'B',
      },
      {
        question: 'Keberatan pihak kontra terhadap aturan seragam yang terlalu ketat adalah ....',
        options: [
          'membatasi ekspresi diri dan menambah biaya jika jenisnya terlalu banyak',
          'membuat siswa tidak mengenali teman satu kelas',
          'menyulitkan kegiatan upacara bendera setiap Senin',
          'menurunkan kualitas bahan kain di pasaran',
        ],
        answer: 'A',
      },
      {
        question: 'Konjungsi pertentangan yang menghubungkan argumen pro dan kontra pada teks adalah ....',
        options: ['selain itu', 'sebaliknya', 'sehingga', 'serta'],
        answer: 'B',
      },
      {
        question: 'Simpulan atau jalan tengah yang ditawarkan penulis pada akhir teks adalah ....',
        options: [
          'menghapus seluruh aturan seragam di tingkat SMP',
          'mewajibkan lima jenis seragam berbeda setiap minggu',
          'mempertahankan seragam utama yang sederhana dengan hari ekspresi khusus',
          'menyerahkan desain seragam kepada siswa setiap pagi',
        ],
        answer: 'C',
      },
      {
        question: 'Struktur yang lengkap tergambar dalam kutipan teks diskusi tersebut adalah ....',
        options: [
          'orientasi - komplikasi - resolusi',
          'isu - argumen mendukung - argumen menentang - simpulan',
          'tujuan - alat dan bahan - langkah-langkah',
          'identifikasi - deskripsi bagian - kesan umum',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Kebahasaan & Ejaan',
    passageTitle: 'Buletin Sekolah: Festival Literasi Nusantara',
    passageText:
      '(1) Minggu depan, OSIS SMP Cendekia akan menyelenggarakan Festival Literasi Nusantara di aula sekolah. (2) Kegiatan tersebut diikuti oleh para siswa-siswa dari kelas VII hingga kelas IX. (3) Berbagai lomba menarik, seperti membaca puisi, menulis cerpen, dan resensi buku, telah disiapkan oleh panitia. (4) Ketua panitia berharap agar supaya acara ini mampu menumbuhkan minat baca pelajar. (5) Selain lomba, tersedia pula pojok tukar buku bekas layak baca.',
    items: [
      {
        question: 'Kalimat tidak efektif akibat pemborosan kata (pleonasme) terdapat pada nomor ....',
        options: ['(1) dan (3)', '(2) dan (4)', '(1) dan (5)', '(3) dan (5)'],
        answer: 'B',
      },
      {
        question: 'Perbaikan yang tepat untuk kalimat (2) agar menjadi kalimat efektif adalah ....',
        options: [
          'Kegiatan tersebut diikuti oleh banyak para siswa.',
          'Kegiatan tersebut diikuti oleh siswa dari kelas VII hingga kelas IX.',
          'Kegiatan tersebut diikuti oleh seluruh siswa-siswa sekalian.',
          'Kegiatan tersebut diikuti oleh para murid-murid kelas.',
        ],
        answer: 'B',
      },
      {
        question: 'Penggunaan frasa "agar supaya" pada kalimat (4) sebaiknya diubah menjadi ....',
        options: ['demi untuk', 'agar', 'karena sebab', 'jika seandainya'],
        answer: 'B',
      },
      {
        question: 'Penulisan huruf kapital dan angka Romawi pada teks di atas sudah benar pada ....',
        options: [
          'OSIS SMP Cendekia, Festival Literasi Nusantara, kelas VII, kelas IX',
          'aula sekolah harus ditulis Aula Sekolah',
          'lomba puisi harus ditulis Lomba Puisi',
          'ketua panitia harus ditulis Ketua Panitia',
        ],
        answer: 'A',
      },
      {
        question: 'Informasi mengenai kegiatan non-lomba dalam festival tersebut terdapat pada kalimat ....',
        options: ['(1)', '(2)', '(3)', '(5)'],
        answer: 'D',
      },
    ],
  },
  {
    category: 'Teks Eksposisi',
    passageTitle: 'Transportasi Umum dan Udara Bersih',
    passageText:
      'Kemacetan di kota-kota besar Indonesia bukan hanya membuang waktu produktif warga, melainkan juga menyumbang emisi gas buang tertinggi dari kendaraan pribadi. Satu unit bus perkotaan berkapasitas empat puluh penumpang dapat menggantikan sekitar dua puluh lima mobil pribadi di jalan raya. Dengan beralih ke angkutan umum yang terintegrasi, konsumsi bahan bakar fosil menurun drastis dan kualitas udara membaik. Agar minat masyarakat meningkat, pemerintah daerah perlu memastikan jadwal bus tepat waktu, tarif terjangkau, dan halte aman bagi pejalan kaki.',
    items: [
      {
        question: 'Tesis (pendapat utama) yang dikemukakan penulis pada awal teks adalah ....',
        options: [
          'kendaraan pribadi lebih nyaman daripada bus perkotaan',
          'kemacetan membuang waktu warga dan menyumbang emisi gas buang tinggi',
          'halte bus harus dibangun di setiap sekolah',
          'tarif angkutan umum harus digratiskan seluruhnya',
        ],
        answer: 'B',
      },
      {
        question: 'Fakta kuantitatif yang digunakan penulis untuk menguatkan argumennya adalah ....',
        options: [
          'satu bus berkapasitas 40 penumpang menggantikan sekitar 25 mobil pribadi',
          'jadwal bus selalu terlambat saat jam pulang kantor',
          'seluruh warga kota memiliki kendaraan pribadi',
          'bahan bakar fosil sudah habis di Indonesia',
        ],
        answer: 'A',
      },
      {
        question: 'Tiga syarat peningkatan minat masyarakat terhadap angkutan umum menurut teks adalah ....',
        options: [
          'kursi empuk, pendingin udara dingin, dan musik kencang',
          'jadwal tepat waktu, tarif terjangkau, dan halte aman',
          'bus berwarna cerah, jalur khusus sepeda, dan Wi-Fi gratis',
          'bebas pajak kendaraan, jalan tol gratis, dan parkir luas',
        ],
        answer: 'B',
      },
      {
        question: 'Makna kata "terintegrasi" dalam teks tersebut adalah ....',
        options: [
          'berjalan terpisah tanpa jadwal tetap',
          'terpadu atau saling terhubung antarjalur dan moda transportasi',
          'dikelola oleh perusahaan swasta luar negeri',
          'menggunakan bahan bakar bensin murni',
        ],
        answer: 'B',
      },
      {
        question: 'Penegasan ulang pendapat pada paragraf tersebut berupa ....',
        options: [
          'rekomendasi perbaikan layanan agar warga mau beralih ke angkutan umum',
          'larangan total menjual mobil pribadi di Indonesia',
          'perbandingan biaya pembangunan kereta dan jalan raya',
          'data jumlah kendaraan bermotor tahun lalu',
        ],
        answer: 'A',
      },
    ],
  },
  {
    category: 'Drama Pendek',
    passageTitle: 'Di Balik Panggung Pentas Seni',
    passageText:
      'Nadia: (Mondar-mandir sambil memegang naskah) "Bagas, lampu sorot utama tiba-tiba mati! Sepuluh menit lagi giliran kelompok kita tampil."\nBagas: (Tenang memeriksa kotak kabel) "Jangan panik dulu, Nad. Mari kita cek sekringnya bersama Pak Rudi. Kalau masih padam, kita pakai lampu latar panggung dan atur posisi pemain agak ke tengah."\nNadia: (Menghela napas lega) "Benar juga, yang penting suara dialog kita tetap jelas terdengar sampai barisan belakang."',
    items: [
      {
        question: 'Masalah mendadak yang dihadapi tokoh Nadia dan Bagas dalam kutipan drama adalah ....',
        options: [
          'naskah drama tertinggal di ruang kelas',
          'lampu sorot utama panggung mati menjelang giliran tampil',
          'Pak Rudi tidak hadir pada acara pentas seni',
          'barisan penonton belakang pulang lebih awal',
        ],
        answer: 'B',
      },
      {
        question: 'Watak tokoh Bagas berdasarkan dialog dan petunjuk laku (kramagung) adalah ....',
        options: [
          'gugup dan suka menyalahkan orang lain',
          'tenang, sigap, dan solutif mencari jalan keluar',
          'acuh tak acuh terhadap kesuksesan kelompok',
          'pemarah saat melihat kesalahan teknis',
        ],
        answer: 'B',
      },
      {
        question: 'Kalimat dalam tanda kurung pada naskah drama tersebut berfungsi sebagai ....',
        options: [
          'prolog pembuka cerita',
          'kramagung (petunjuk laku atau ekspresi tokoh)',
          'epilog penutup pentas',
          'catatan kaki pengarang',
        ],
        answer: 'B',
      },
      {
        question: 'Solusi cadangan yang direncanakan Bagas jika lampu sorot tetap padam adalah ....',
        options: [
          'membatalkan penampilan kelompok mereka',
          'memakai lampu latar panggung dan menggeser posisi pemain ke tengah',
          'meminta penonton menyalakan senter ponsel',
          'mengganti pertunjukan drama dengan membaca puisi',
        ],
        answer: 'B',
      },
      {
        question: 'Latar tempat terjadinya percakapan dalam kutipan drama tersebut adalah ....',
        options: [
          'ruang perpustakaan sekolah',
          'belakang panggung (backstage) pentas seni',
          'halaman parkir sekolah',
          'studio rekaman radio',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Laporan Percobaan',
    passageTitle: 'Uji Vitamin C pada Sari Buah Lokal',
    passageText:
      'Percobaan dilakukan untuk membandingkan kadar vitamin C pada jeruk nipis, jambu biji merah, dan belimbing menggunakan larutan iodin (betadine). Sebanyak 5 ml larutan iodin dicampur dengan air lalu ditetesi sari buah satu per satu sambil diaduk hingga warna cokelat iodin berubah jernih. Hasil pengamatan menunjukkan bahwa jambu biji merah hanya membutuhkan 14 tetes untuk menjernihkan iodin, jeruk nipis 22 tetes, sedangkan belimbing membutuhkan 31 tetes. Semakin sedikit tetesan yang diperlukan, semakin tinggi kandungan vitamin C dalam buah tersebut.',
    items: [
      {
        question: 'Buah yang memiliki kandungan vitamin C tertinggi berdasarkan hasil percobaan adalah ....',
        options: [
          'belimbing karena butuh 31 tetes',
          'jeruk nipis karena butuh 22 tetes',
          'jambu biji merah karena hanya butuh 14 tetes',
          'ketiganya memiliki kadar yang sama persis',
        ],
        answer: 'C',
      },
      {
        question: 'Indikator terjadinya reaksi vitamin C dalam percobaan ini ditandai oleh ....',
        options: [
          'larutan berubah menjadi berwarna hitam pekat',
          'warna cokelat larutan iodin berubah menjadi jernih',
          'timbulnya gelembung gas panas di gelas ukur',
          'sari buah mengendap di dasar tabung',
        ],
        answer: 'B',
      },
      {
        question: 'Simpulan hubungan jumlah tetesan dengan kadar vitamin C adalah ....',
        options: [
          'berbanding lurus: makin banyak tetes, makin tinggi vitamin C',
          'berbanding terbalik: makin sedikit tetes, makin tinggi kadar vitamin C',
          'tidak memiliki hubungan sama sekali',
          'bergantung pada ukuran besar kecilnya buah',
        ],
        answer: 'B',
      },
      {
        question: 'Alat atau bahan yang berfungsi sebagai penguji dalam percobaan tersebut adalah ....',
        options: ['air mineral 5 ml', 'larutan iodin (betadine)', 'gula pasir', 'kertas lakmus biru'],
        answer: 'B',
      },
      {
        question: 'Urutan buah dari kadar vitamin C tertinggi ke terendah adalah ....',
        options: [
          'belimbing - jeruk nipis - jambu biji merah',
          'jambu biji merah - jeruk nipis - belimbing',
          'jeruk nipis - belimbing - jambu biji merah',
          'jambu biji merah - belimbing - jeruk nipis',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Sejarah Lokal',
    passageTitle: 'Sistem Irigasi Subak di Bali',
    passageText:
      'Subak merupakan sistem pengairan sawah tradisional masyarakat Bali yang telah diwariskan sejak abad ke-11. Tidak sekadar saluran teknis pembagi air, Subak berlandaskan filosofi Tri Hita Karana, yaitu keselarasan hubungan manusia dengan Tuhan, sesama manusia, dan alam. Setiap anggota Subak bermusyawarah menentukan jadwal tanam serentak untuk memutus siklus hama wereng dan membagi debit air sungai secara adil antara sawah di hulu dan di hilir. Pada tahun 2012, UNESCO menetapkan Subak sebagai Warisan Budaya Dunia.',
    items: [
      {
        question: 'Filosofi utama yang menjadi landasan sistem Subak adalah ....',
        options: ['Bhinneka Tunggal Ika', 'Tri Hita Karana', 'Gotong Royong Raya', 'Sumpah Palapa'],
        answer: 'B',
      },
      {
        question: 'Manfaat jadwal tanam serentak yang diputuskan melalui musyawarah Subak adalah ....',
        options: [
          'meningkatkan harga jual beras di luar negeri',
          'memutus siklus hama wereng dan menjaga keadilan pembagian air',
          'mengganti seluruh saluran air tanah dengan pompa listrik',
          'mengurangi jumlah petani di daerah hilir',
        ],
        answer: 'B',
      },
      {
        question: 'Pengakuan internasional terhadap Subak tercatat pada peristiwa ....',
        options: [
          'pembangunan bendungan besar pada abad ke-11',
          'penetapan Subak sebagai Warisan Budaya Dunia oleh UNESCO tahun 2012',
          'penghapusan hama wereng di seluruh Indonesia',
          'penerapan sistem irigasi modern pada tahun 2002',
        ],
        answer: 'B',
      },
      {
        question: 'Lawan kata (antonim) dari kata "hulu" dalam bacaan tersebut adalah ....',
        options: ['muara', 'hilir', 'sungai', 'bendung'],
        answer: 'B',
      },
      {
        question: 'Nilai sosial yang menonjol dalam praktik pengelolaan Subak adalah ....',
        options: [
          'persaingan bebas antarpetani',
          'musyawarah, keadilan, dan kelestarian lingkungan',
          'penguasaan air oleh pemilik lahan terluas',
          'ketergantungan pada teknologi impor',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Pidato Persuasif',
    passageTitle: 'Menjaga Etika Berkomentar di Dunia Maya',
    passageText:
      'Hadirin yang saya hormati, kemajuan media sosial memungkinkan siapa saja menyampaikan pendapat dalam hitungan detik. Namun, kebebasan tersebut sering disalahartikan sebagai keleluasaan melontarkan ujaran kebencian dan perundungan siber. Ingatlah bahwa jejak digital tidak mudah terhapus dan setiap kata yang kita ketik dapat melukai perasaan orang lain di dunia nyata. Marilah kita biasakan prinsip saring sebelum berbagi: periksa kebenaran informasi, gunakan bahasa santun, dan hargai perbedaan pendapat demi ruang digital yang sehat.',
    items: [
      {
        question: 'Tema utama kutipan pidato persuasif tersebut adalah ....',
        options: [
          'cara menambah pengikut di media sosial',
          'pentingnya menjaga etika dan kesantunan dalam berinteraksi di dunia maya',
          'larangan membuat akun media sosial bagi pelajar',
          'dampak radiasi gawai terhadap kesehatan mata',
        ],
        answer: 'B',
      },
      {
        question: 'Sapaan pembuka yang digunakan orator dalam kutipan pidato adalah ....',
        options: [
          'Teman-teman seperjuangan',
          'Hadirin yang saya hormati',
          'Bapak dan Ibu Guru tersayang',
          'Para pengguna internet sekalian',
        ],
        answer: 'B',
      },
      {
        question: 'Arti frasa "jejak digital" berdasarkan konteks pidato adalah ....',
        options: [
          'rekam aktivitas, komentar, atau unggahan yang tersimpan di internet',
          'sidik jari pada layar ponsel pintar',
          'kecepatan jaringan internet di rumah',
          'alamat email milik sekolah',
        ],
        answer: 'A',
      },
      {
        question: 'Langkah nyata dari prinsip "saring sebelum berbagi" menurut pembicara adalah ....',
        options: [
          'menggunakan nama samaran saat berkomentar',
          'memeriksa kebenaran informasi, berbahasa santun, dan menghargai perbedaan',
          'menghapus seluruh komentar setiap malam',
          'membagikan berita secepat mungkin agar viral',
        ],
        answer: 'B',
      },
      {
        question: 'Kalimat persuasif dalam kutipan pidato tersebut ditandai dengan kata ....',
        options: ['hadirin', 'namun', 'marilah', 'sebab'],
        answer: 'C',
      },
    ],
  },
  {
    category: 'Teks Cerita Fantasi',
    passageTitle: 'Kompas Kayu Penjaga Hutan',
    passageText:
      'Saat tersesat di kabut Lembah Meranti, Arga menemukan sebuah kompas kayu berukir daun pakis di pangkal pohon tua. Anehnya, jarum kompas itu tidak menunjuk ke arah utara, melainkan berputar pelan menuju mata air jernih dan jalan setapak keluar lembah. Setiap kali Arga memetik ranting sembarangan, jarum kompas bergetar dan cahaya hijaunya meredup. Baru setelah Arga meminta maaf dan menanam kembali tunas yang terinjak, cahaya hijau itu menyala terang menuntunnya pulang dengan selamat.',
    items: [
      {
        question: 'Keajaiban yang dimiliki kompas kayu dalam cerita fantasi tersebut adalah ....',
        options: [
          'dapat mengubah ranting kering menjadi emas',
          'jarumnya menunjuk arah keselamatan dan bereaksi terhadap sikap tokoh pada alam',
          'bisa memanggil hujan deras saat kemarau',
          'mampu menerbangkan Arga melewati gunung tinggi',
        ],
        answer: 'B',
      },
      {
        question: 'Mengapa cahaya hijau pada kompas sempat meredup?',
        options: [
          'baterai kompas mulai habis di tengah kabut',
          'Arga memetik ranting sembarangan dan menginjak tunas',
          'Lembah Meranti sedang dilanda gerhana matahari',
          'Arga membuang kompas ke dalam mata air',
        ],
        answer: 'B',
      },
      {
        question: 'Nilai moral yang tersirat melalui syarat menyalanya cahaya kompas adalah ....',
        options: [
          'keharusan menghormati dan menjaga kelestarian alam',
          'larangan berjalan sendirian di waktu malam',
          'pentingnya membawa kompas magnet modern',
          'kewajiban mencari harta karun di hutan tua',
        ],
        answer: 'A',
      },
      {
        question: 'Sudut pandang yang digunakan pengarang dalam kutipan cerita adalah ....',
        options: [
          'orang pertama pelaku utama',
          'orang pertama pelaku sampingan',
          'orang ketiga serba tahu',
          'orang kedua jamak',
        ],
        answer: 'C',
      },
      {
        question: 'Latar suasana pada awal cerita adalah ....',
        options: [
          'meriah dan penuh tawa',
          'bingung dan penuh kabut karena tersesat',
          'ramai oleh suara pasar tradisional',
          'sangat panas dan gersang',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Berita Lingkungan',
    passageTitle: 'Sekolah Adiwiyata Panen Air Hujan',
    passageText:
      'SMP Negeri 4 Lestari berhasil menghemat tagihan air bersih hingga 35 persen berkat instalasi pemanen air hujan (rainwater harvesting). Air hujan yang jatuh di atap gedung kelas dialirkan melalui talang bersaringan kerikil dan arang aktif menuju tiga tangki berkapasitas total 6.000 liter. Air tampungan tersebut dimanfaatkan untuk menyiram kebun sekolah, mencuci peralatan berkebun, serta membilas toilet. Kepala sekolah berharap inovasi sederhana ini dapat direplikasi oleh keluarga siswa di rumah masing-masing.',
    items: [
      {
        question: 'Persentase penghematan tagihan air yang dicapai SMP Negeri 4 Lestari adalah ....',
        options: ['15 persen', '25 persen', '35 persen', '60 persen'],
        answer: 'C',
      },
      {
        question: 'Media penyaring yang digunakan sebelum air hujan masuk ke tangki adalah ....',
        options: [
          'kain sutra dan kaporit',
          'kerikil dan arang aktif',
          'pasir pantai dan kapur barus',
          'jaring kawat dan daun kering',
        ],
        answer: 'B',
      },
      {
        question: 'Pemanfaatan air hujan tampungan di sekolah tersebut meliputi kegiatan berikut, KECUALI ....',
        options: [
          'menyiram kebun sekolah',
          'mencuci peralatan berkebun',
          'membilas toilet',
          'diminum langsung tanpa dimasak',
        ],
        answer: 'D',
      },
      {
        question: 'Arti kata "direplikasi" pada kalimat terakhir bacaan adalah ....',
        options: [
          'ditolak mentah-mentah',
          'ditiru atau diterapkan ulang di tempat lain',
          'dijual kepada sekolah swasta',
          'dihapus dari program sekolah',
        ],
        answer: 'B',
      },
      {
        question: 'Total kapasitas seluruh tangki penampungan air hujan di sekolah tersebut adalah ....',
        options: ['2.000 liter', '3.000 liter', '6.000 liter', '18.000 liter'],
        answer: 'C',
      },
    ],
  },
  {
    category: 'Teks Ulasan Buku',
    passageTitle: 'Mengenal Antologi Cerpen "Jejak Pelajar"',
    passageText:
      'Buku antologi cerpen "Jejak Pelajar" karya komunitas penulis muda memuat dua belas kisah tentang persahabatan, kejujuran, dan cita-cita di bangku SMP. Kelebihan buku ini terletak pada pilihan diksi yang segar, alur cerita yang dekat dengan keseharian remaja, serta ilustrasi hitam-putih yang memperkaya imajinasi pembaca. Meski demikian, beberapa cerpen di bagian akhir terasa tergesa-gesa dalam menyelesaikan konflik sehingga akhir ceritanya mudah ditebak. Secara keseluruhan, buku setebal 164 halaman ini sangat layak menjadi bacaan pendamping literasi sekolah.',
    items: [
      {
        question: 'Keunggulan buku "Jejak Pelajar" yang disebutkan pengulas adalah ....',
        options: [
          'sampul buku berlapis emas dan sangat tebal',
          'diksi segar, cerita dekat dengan remaja, dan ada ilustrasi menarik',
          'seluruh ceritanya ditulis oleh satu penulis terkenal',
          'harganya paling murah di toko buku kota',
        ],
        answer: 'B',
      },
      {
        question: 'Kekurangan yang dicatat pengulas mengenai buku tersebut adalah ....',
        options: [
          'terlalu banyak istilah asing tanpa penjelasan',
          'beberapa cerpen di bagian akhir tergesa-gesa menyelesaikan konflik',
          'ukuran huruf terlalu kecil sehingga sulit dibaca',
          'tidak memiliki daftar isi dan nomor halaman',
        ],
        answer: 'B',
      },
      {
        question: 'Jumlah karya cerpen yang terkumpul dalam buku antologi tersebut adalah ....',
        options: ['10 cerpen', '12 cerpen', '16 cerpen', '164 cerpen'],
        answer: 'B',
      },
      {
        question: 'Arti kata "antologi" dalam teks ulasan di atas adalah ....',
        options: [
          'buku kamus istilah sastra',
          'kumpulan karya tulis pilihan (seperti cerpen atau puisi)',
          'catatan harian pribadi penulis terkenal',
          'ringkasan isi buku pelajaran',
        ],
        answer: 'B',
      },
      {
        question: 'Rekomendasi akhir pengulas terhadap buku "Jejak Pelajar" adalah ....',
        options: [
          'kurang cocok dibaca oleh siswa SMP',
          'layak dijadikan bacaan pendamping kegiatan literasi sekolah',
          'sebaiknya dicetak ulang tanpa ilustrasi',
          'hanya ditujukan bagi guru bahasa Indonesia',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Sains & Teknologi',
    passageTitle: 'Baterai Natrium sebagai Alternatif Ramah Biaya',
    passageText:
      'Selama ini sebagian besar ponsel dan kendaraan listrik mengandalkan baterai litium-ion yang berharga mahal karena cadangan mineral litium terbatas di beberapa negara saja. Kini para peneliti mengembangkan baterai natrium-ion yang memanfaatkan garam sebagai sumber bahan baku utama. Natrium sangat melimpah di alam dan mudah diekstraksi dari air laut dengan biaya lebih rendah. Meski kepadatan energinya masih sedikit di bawah baterai litium, baterai natrium dinilai sangat menjanjikan untuk penyimpanan energi pembangkit listrik tenaga surya dan angin.',
    items: [
      {
        question: 'Alasan utama baterai litium-ion relatif mahal menurut bacaan adalah ....',
        options: [
          'proses pengisian dayanya sangat lambat',
          'cadangan mineral litium terbatas di beberapa negara',
          'tidak bisa digunakan pada ponsel pintar',
          'ukurannya jauh lebih berat daripada aki mobil',
        ],
        answer: 'B',
      },
      {
        question: 'Keunggulan bahan baku natrium dibandingkan litium adalah ....',
        options: [
          'sangat melimpah di alam dan mudah diekstraksi dari air laut',
          'memiliki kepadatan energi dua kali lipat lebih tinggi',
          'hanya ditemukan di kawasan pegunungan es',
          'tidak memerlukan wadah pelindung baterai',
        ],
        answer: 'A',
      },
      {
        question: 'Bidang penggunaan yang paling potensial bagi baterai natrium saat ini menurut teks adalah ....',
        options: [
          'mesin pesawat supersonik',
          'penyimpanan energi pembangkit listrik tenaga surya dan angin',
          'jam tangan mekanik tanpa baterai',
          'peralatan memasak di dapur',
        ],
        answer: 'B',
      },
      {
        question: 'Kata "ekstraksi" dalam bacaan tersebut bermakna ....',
        options: [
          'proses pemisahan atau pengambilan suatu zat dari bahan campurannya',
          'pembuangan limbah cair ke samudra',
          'penghancuran logam menjadi serbuk halus',
          'pengiriman barang antarpulau',
        ],
        answer: 'A',
      },
      {
        question: 'Sikap ilmuwan yang tercermin dalam paragraf tersebut adalah ....',
        options: [
          'puas dengan teknologi yang sudah ada',
          'inovatif mencari alternatif bahan baku yang lebih terjangkau dan melimpah',
          'menolak penggunaan energi surya dan angin',
          'menghentikan produksi seluruh kendaraan listrik',
        ],
        answer: 'B',
      },
    ],
  },
  {
    category: 'Teks Inspirasi Sosial',
    passageTitle: 'Bank Sampah Pelajar di Kampung Damai',
    passageText:
      'Berawal dari keprihatinan melihat selokan tersumbat botol plastik, lima siswa SMP di Kampung Damai mendirikan Bank Sampah Pelajar setiap Sabtu sore. Warga dapat menyetorkan botol, kardus, dan kaleng bekas yang telah dipilah untuk ditimbang dan dicatat dalam buku tabungan sampah. Setelah terkumpul, barang daur ulang dijual ke pengepul resmi, sedangkan hasilnya dapat ditarik warga untuk membeli perlengkapan sekolah anak. Dalam setahun, gerakan kecil ini mampu mengelola dua ton sampah anorganik.',
    items: [
      {
        question: 'Latar belakang berdirinya Bank Sampah Pelajar adalah ....',
        options: [
          'tugas lomba kebersihan tingkat provinsi',
          'keprihatinan lima siswa melihat selokan tersumbat botol plastik',
          'permintaan pengepul barang bekas di pasar induk',
          'rencana pembangunan taman bermain baru',
        ],
        answer: 'B',
      },
      {
        question: 'Syarat barang yang disetorkan warga ke Bank Sampah Pelajar adalah ....',
        options: [
          'sudah dicuci dengan sabun wangi',
          'sudah dipilah berdasarkan jenis seperti botol, kardus, dan kaleng',
          'berupa sisa makanan rumah tangga yang masih segar',
          'dikirim menggunakan truk dinas kebersihan',
        ],
        answer: 'B',
      },
      {
        question: 'Manfaat ekonomi langsung yang dirasakan warga dari tabungan sampah adalah ....',
        options: [
          'mendapatkan modal membeli sepeda motor',
          'hasilnya dapat ditarik untuk membeli perlengkapan sekolah anak',
          'dibebaskan dari pembayaran listrik bulanan',
          'memperoleh pinjaman modal tanpa bunga',
        ],
        answer: 'B',
      },
      {
        question: 'Capaian terukur gerakan tersebut dalam waktu satu tahun adalah ....',
        options: [
          'membangun lima gedung sekolah baru',
          'mengelola dua ton sampah anorganik',
          'mengurangi jumlah penduduk Kampung Damai',
          'menutup seluruh tempat pembuangan akhir',
        ],
        answer: 'B',
      },
      {
        question: 'Nilai karakter yang menonjol dari kelima siswa SMP tersebut adalah ....',
        options: [
          'kepedulian lingkungan dan jiwa kepemimpinan sosial',
          'persaingan antarteman demi hadiah pribadi',
          'kegemaran mengumpulkan barang antik',
          'kepatuhan pada aturan tanpa inisiatif',
        ],
        answer: 'A',
      },
    ],
  },
  {
    category: 'Kebahasaan & Kalimat Rumpang',
    passageTitle: 'Gotong Royong Memulihkan Jalur Pendakian',
    passageText:
      'Hujan deras selama tiga hari berturut-turut menyebabkan beberapa titik jalur pendakian Gunung Lawu tertutup longsoran tanah dan ranting tumbang. [ ... ] Para relawan, petugas kehutanan, serta warga desa setempat segera bahu-membahu membersihkan material longsor menggunakan cangkul dan gergaji mesin. Berkat kerja sama yang solid, jalur tersebut kembali aman dilalui wisatawan pada akhir pekan. Pengelola mengimbau pendaki agar selalu memantau prakiraan cuaca sebelum memulai perjalanan.',
    items: [
      {
        question: 'Kalimat yang paling tepat untuk melengkapi bagian rumpang [ ... ] adalah ....',
        options: [
          'Oleh karena itu, jalur pendakian ditutup sementara demi keselamatan.',
          'Akibatnya, banyak pendaki mendirikan tenda di jalan raya.',
          'Namun, wisatawan tetap diizinkan mendaki pada malam hari.',
          'Padahal, Gunung Lawu memiliki pemandangan kawah yang indah.',
        ],
        answer: 'A',
      },
      {
        question: 'Arti ungkapan "bahu-membahu" pada kalimat ketiga adalah ....',
        options: [
          'berdiri berjajar di tepi jurang',
          'bekerja sama dan saling tolong-menolong',
          'membawa barang berat di atas pundak',
          'beristirahat secara bergantian',
        ],
        answer: 'B',
      },
      {
        question: 'Peralatan yang digunakan relawan untuk membuka kembali jalur adalah ....',
        options: [
          'tali tambang dan senter kepala',
          'cangkul dan gergaji mesin',
          'sekop salju dan kompresor udara',
          'parang bambu dan gerobak pasir',
        ],
        answer: 'B',
      },
      {
        question: 'Imbauan pengelola wisata kepada calon pendaki adalah ....',
        options: [
          'membawa cangkul sendiri saat mendaki',
          'memantau prakiraan cuaca sebelum memulai perjalanan',
          'mendaki hanya secara berkelompok sepuluh orang',
          'membeli asuransi perjalanan di pintu masuk desa',
        ],
        answer: 'B',
      },
      {
        question: 'Sinonim kata "solid" pada kalimat keempat adalah ....',
        options: ['rapuh', 'kompak dan kuat', 'terburu-buru', 'terpisah'],
        answer: 'B',
      },
    ],
  },
];

export const VERSUS_QUESTION_BANK: VersusQuestion[] = (() => {
  const out: VersusQuestion[] = [];
  let nextId = 1;
  for (const p of VERSUS_PASSAGES) {
    for (const item of p.items) {
      out.push({
        id: nextId++,
        category: p.category,
        passageTitle: p.passageTitle,
        passageText: p.passageText,
        question: item.question,
        options: [
          { key: 'A', text: item.options[0] },
          { key: 'B', text: item.options[1] },
          { key: 'C', text: item.options[2] },
          { key: 'D', text: item.options[3] },
        ],
        answer: item.answer,
      });
    }
  }
  return out;
})();

export function pickRandomVersusQuestions(count = 5, excludeIds: number[] = []): VersusQuestion[] {
  const excluded = new Set(excludeIds);
  const pool = VERSUS_QUESTION_BANK.filter((q) => !excluded.has(q.id));
  const source = pool.length >= count ? [...pool] : [...VERSUS_QUESTION_BANK];

  // Fisher-Yates shuffle
  for (let i = source.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [source[i], source[j]] = [source[j], source[i]];
  }

  // Prefer distinct reading passages in a single duel match so every round feels fresh!
  const chosen: VersusQuestion[] = [];
  const usedPassages = new Set<string>();

  for (const q of source) {
    if (chosen.length >= count) break;
    if (!usedPassages.has(q.passageTitle)) {
      chosen.push(q);
      usedPassages.add(q.passageTitle);
    }
  }
  for (const q of source) {
    if (chosen.length >= count) break;
    if (!chosen.some((c) => c.id === q.id)) {
      chosen.push(q);
    }
  }
  return chosen;
}

export function getVersusQuestionsByIds(ids: number[]): VersusQuestion[] {
  const byId = new Map(VERSUS_QUESTION_BANK.map((q) => [q.id, q]));
  return ids.map((id) => byId.get(id)).filter((q): q is VersusQuestion => Boolean(q));
}
