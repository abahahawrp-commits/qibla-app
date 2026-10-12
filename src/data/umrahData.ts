import {
  UmrahStep,
  UmrahDoa,
  MiqatStation,
  IhramProhibition,
  UmrahChecklistItem,
} from '../types/umrah';

export const UMRAH_STEPS: UmrahStep[] = [
  {
    id: 1,
    stepNumber: 1,
    title: 'Persiapan & Berihram dari Miqat',
    arabicTitle: 'الإِحْرَامُ مِنَ المِيقَاتِ',
    category: 'ihram',
    isRukun: true,
    location: 'Miqat (Bir Ali / Yalamlam / Qarnul Manazil / dll.)',
    summary:
      'Mandi sunnah, memakai pakaian ihram, sholat sunnah ihram, dan berniat ihram umroh sebelum melewati garis batas Miqat.',
    description:
      'Ihram adalah rukun pertama umroh. Ihram adalah niat memasuki ibadah haji atau umroh dengan meninggalkan larangan-larangan tertentu. Jamaah wajib berniat sebelum atau tepat saat melintasi batas Miqat.',
    instructions: [
      'Memotong kuku, mencukur bulu ketiak dan kemaluan, serta merapikan kumis/jenggot sebelum mandi.',
      'Mandi sunnah ihram (seperti mandi junub), berwudhu, serta memakai wewangian di badan (bukan di kain ihram) sebelum niat.',
      'Mengenakan pakaian ihram: bagi pria 2 lembar kain tanpa jahitan (izar & rida\'), bagi wanita pakaian muslimah biasa yang menutup aurat (tidak memakai cadar dan sarung tangan).',
      'Sholat sunnah ihram 2 rakaat (rakaat 1 membaca Al-Kafirun, rakaat 2 membaca Al-Ikhlas) jika memungkinkan.',
      'Mengucapkan lafadz niat ihram umroh di Miqat: "Labbaikallahumma \'umratan".',
      'Memperbanyak membaca bacaan Talbiyah dengan suara lantang bagi pria dan lirih bagi wanita hingga tiba di Masjidil Haram.',
    ],
    doaIds: ['niat_umrah', 'talbiyah', 'shalawat_ihram'],
    tips: [
      'Bagi jamaah penerbangan langsung ke Jeddah (tanpa transit Madinah), kenakan pakaian ihram sejak di bandara keberangkatan atau di pesawat, lalu berniat di atas pesawat saat diumumkan mendekati Miqat Yalamlam/Qarnul Manazil.',
      'Gunakan sabuk ihram berkantong untuk mengunci kain bagian bawah agar tidak melorot dan tempat menyimpan uang/paspor.',
    ],
    mistakesToAvoid: [
      'Melewati batas Miqat tanpa berniat ihram (diharuskan membayar denda/dam menyembelih seekor kambing).',
      'Pria mengenakan celana dalam atau pakaian berjahit setelah niat ihram.',
      'Memakai wewangian pada kain ihram setelah berniat.',
    ],
  },
  {
    id: 2,
    stepNumber: 2,
    title: 'Perjalanan ke Makkah & Menuju Masjidil Haram',
    arabicTitle: 'التَّوَجُّهُ إِلَى المَسْجِدِ الحَرَامِ',
    category: 'persiapan',
    isRukun: false,
    location: 'Perjalanan menuju Makkah Al-Mukarramah',
    summary:
      'Terus melantunkan Talbiyah, berdzikir, menjaga lisan, dan berdoa saat pertama kali memandang Ka\'bah.',
    description:
      'Selama perjalanan darat menuju Makkah, jamaah disunnahkan terus bertalbiyah dengan penuh kerinduan dan kekhusyukan. Saat tiba di penginapan, letakkan barang bawaan, perbaharui wudhu, dan segera menuju Masjidil Haram dengan tenang.',
    instructions: [
      'Terus membaca Talbiyah dan takbir di sepanjang perjalanan.',
      'Masuk ke kota suci Makkah dan memperbanyak doa memohon perlindungan serta ampunan Allah.',
      'Masuk ke Masjidil Haram dengan mendahulukan kaki kanan seraya membaca doa masuk masjid.',
      'Saat pertama kali melihat Ka\'bah Musyarrafah, hentikan bacaan Talbiyah, angkat tangan, dan panjatkan doa melihat Ka\'bah.',
    ],
    doaIds: ['masuk_makkah', 'masuk_masjidil_haram', 'melihat_kabah'],
    tips: [
      'Masuklah dengan tenang tanpa berdesak-desakan atau mendorong jamaah lain.',
      'Doa saat pertama kali melihat Ka\'bah adalah salah satu waktu mustajab untuk memanjatkan hajat dunia dan akhirat.',
    ],
    mistakesToAvoid: [
      'Menyibukkan diri berswafoto (selfie) berlebihan saat pertama kali melihat Ka\'bah hingga kehilangan kekhusyukan.',
      'Membaca Talbiyah secara berteriak serentak dengan nada komando yang mengganggu kekhusyukan jamaah lain.',
    ],
  },
  {
    id: 3,
    stepNumber: 3,
    title: 'Thawaf 7 Putaran Mengelilingi Ka\'bah',
    arabicTitle: 'طَوَافُ العُمْرَةِ',
    category: 'tawaf',
    isRukun: true,
    location: 'Mataf (Area Thawaf sekeliling Ka\'bah)',
    summary:
      'Mengelilingi Ka\'bah sebanyak 7 putaran berlawanan arah jarum jam, dimulai dan diakhiri sejajar Hajar Aswad.',
    description:
      'Thawaf adalah rukun kedua umroh. Thawaf dilakukan sebanyak 7 putaran penuh dalam keadaan suci dari hadas kecil maupun besar. Ka\'bah selalu berada di sebelah kiri bahu jamaah.',
    instructions: [
      'Bagi pria, disunnahkan melakukan Idhthiba\' (membuka bahu kanan dan menutup bahu kiri dengan kain rida\') sejak awal hingga akhir thawaf.',
      'Menuju garis awal Thawaf yang sejajar Hajar Aswad (ditandai lampu hijau di dinding Masjidil Haram).',
      'Menghadap Hajar Aswad, melambaikan tangan kanan seraya berucap: "Bismillahi Allahu Akbar" (Istilam), lalu mulai melangkah memutari Ka\'bah.',
      'Bagi pria, disunnahkan Ramal (berjalan cepat dengan langkah pendek) pada 3 putaran pertama, dan berjalan biasa pada 4 putaran terakhir.',
      'Membaca doa, dzikir, atau ayat Al-Qur\'an secara bebas selama thawaf. Di antara Rukun Yamani dan Hajar Aswad disunnahkan membaca doa Sapu Jagat.',
      'Setiap kali sejajar Rukun Yamani, disunnahkan mengusapnya jika terjangkau (tanpa mencium atau melambaikan tangan). Jika sejajar Hajar Aswad, lakukan Istilam kembali hingga genap 7 putaran.',
    ],
    doaIds: ['istilam', 'doa_tawaf_umum', 'doa_yamani_hajar_aswad'],
    tips: [
      'Gunakan fitur "Counter Thawaf" pada aplikasi Nurul Islam untuk menghitung putaran agar tidak ragu atau lupa jumlah putaran.',
      'Jika wudhu batal di tengah putaran thawaf, segera keluar untuk berwudhu kembali, lalu lanjutkan dari putaran yang sedang berjalan.',
    ],
    mistakesToAvoid: [
      'Menyentuh atau masuk ke dalam Hijr Ismail saat thawaf (jika masuk ke Hijr Ismail, putaran tersebut tidak sah karena Hijr Ismail adalah bagian dari Ka\'bah).',
      'Mendorong orang lain demi mencium Hajar Aswad. Mencium Hajar Aswad hanyalah sunnah, sementara menyakiti sesama muslim adalah haram.',
    ],
  },
  {
    id: 4,
    stepNumber: 4,
    title: 'Sholat Thawaf & Minum Air Zam-Zam',
    arabicTitle: 'صَلاَةُ الطَّوَافِ وَشُرْبُ زَمْزَم',
    category: 'tawaf',
    isRukun: false,
    location: 'Belakang Maqam Ibrahim & Dispenser Zam-Zam',
    summary:
      'Menutup kembali kedua bahu, sholat sunnah thawaf 2 rakaat di belakang Maqam Ibrahim, dan minum air Zam-Zam hingga kenyang.',
    description:
      'Setelah menyelesaikan putaran ke-7 thawaf, tutuplah bahu kanan kembali (mengakhiri idhthiba\'). Menuju belakang Maqam Ibrahim untuk mendirikan sholat sunnah thawaf 2 rakaat, lalu minum air Zam-Zam.',
    instructions: [
      'Menutup kembali bahu kanan dengan kain ihram.',
      'Mendatangi area belakang Maqam Ibrahim (jika padat, boleh di bagian mana saja di Masjidil Haram) seraya membaca firman Allah: "Wattakhidzuu mim maqaami Ibraahiima mushallaa".',
      'Mendirikan sholat sunnah 2 rakaat: rakaat pertama setelah Al-Fatihah membaca surat Al-Kafirun, rakaat kedua membaca surat Al-Ikhlas.',
      'Berdoa dengan khusyuk setelah sholat di area yang mustajab ini.',
      'Menuju tempat minum air Zam-Zam, membaca doa minum air Zam-Zam, dan meminumnya sambil berdiri atau duduk hingga puas.',
    ],
    doaIds: ['maqam_ibrahim', 'minum_zamzam'],
    tips: [
      'Usapkan sebagian air Zam-Zam ke wajah, kepala, dan dada Anda seraya berdoa memohon kesembuhan dan ilmu yang bermanfaat.',
      'Jika area sekitar Maqam Ibrahim sangat padat oleh kerumunan, sholatlah di area belakang masjid agar tidak terinjak dan tidak menghalangi jamaah thawaf.',
    ],
    mistakesToAvoid: [
      'Memaksakan diri sholat tepat di belakang Maqam Ibrahim di tengah padatnya arus thawaf sehingga membahayakan diri sendiri dan orang lain.',
      'Mengusap atau mencium kaca pembungkus Maqam Ibrahim (hal ini tidak dicontohkan Rasulullah SAW).',
    ],
  },
  {
    id: 5,
    stepNumber: 5,
    title: 'Sa\'i 7 Kali Perjalanan Shafa - Marwah',
    arabicTitle: 'السَّعْيُ بَيْنَ الصَّفَا وَالمَرْوَةِ',
    category: 'sai',
    isRukun: true,
    location: 'Mas\'a (Jalur Sa\'i antara Bukit Shafa dan Marwah)',
    summary:
      'Berjalan 7 kali perjalanan antara bukit Shafa dan Marwah, dimulai dari Shafa dan berakhir di Marwah.',
    description:
      'Sa\'i adalah rukun ketiga umroh. Sa\'i dihitung per perjalanan: Shafa ke Marwah dihitung 1, Marwah ke Shafa dihitung 2, sehingga putaran ke-7 pasti berakhir di bukit Marwah.',
    instructions: [
      'Menuju Bukit Shafa melalui jalur Mas\'a. Saat mendekati Shafa, bacalah firman Allah: "Innash-shafaa wal-marwata min sya\'aa-irillah...".',
      'Naik ke Bukit Shafa, menghadap ke arah Ka\'bah, mengangkat kedua tangan, bertakbir 3 kali, dan membaca doa tauhid tiga kali diselingi doa pribadi.',
      'Mulai berjalan menuju Marwah. Ketika sampai di antara dua pilar/lampu hijau (Milain Akhdharain), bagi pria disunnahkan berlari-lari kecil seraya membaca doa.',
      'Setibanya di Bukit Marwah (selesai perjalanan 1), naik ke bukit, menghadap Ka\'bah, dan berdoa seperti di Bukit Shafa.',
      'Lanjutkan perjalanan kembali ke Shafa (perjalanan 2). Ulangi tata cara hingga genap 7 perjalanan, yang berakhir di Bukit Marwah.',
    ],
    doaIds: ['mendaki_shafa', 'doa_pilar_hijau', 'doa_marwah'],
    tips: [
      'Suci dari hadas (wudhu) saat Sa\'i adalah sunnah muakkad, bukan syarat sah. Jika wudhu batal saat Sa\'i, Sa\'i tetap sah dan boleh dilanjutkan tanpa harus berwudhu kembali.',
      'Bagi lansia atau yang kelelahan, tersedia jalur kursi roda khusus di lantai atas atau skuter listrik otomatis.',
    ],
    mistakesToAvoid: [
      'Menghitung bolak-balik Shafa-Marwah-Shafa sebagai 1 putaran (yang benar: Shafa ke Marwah = 1, Marwah ke Shafa = 2, total 7 perjalanan).',
      'Bagi wanita berlari-lari kencang di antara pilar hijau (sunnah berlari kecil hanya bagi pria).',
    ],
  },
  {
    id: 6,
    stepNumber: 6,
    title: 'Tahallul (Bercukur / Potong Rambut) & Selesai',
    arabicTitle: 'التَّحَلُّلُ (الحَلْقُ أَوِ التَّقْصِيرُ)',
    category: 'tahallul',
    isRukun: true,
    location: 'Bukit Marwah atau Barbershop Makkah',
    summary:
      'Mencukur gundul atau memendekkan rambut bagi pria, dan memotong sepanjang satu ruas jari bagi wanita. Selesailah ibadah umroh!',
    description:
      'Tahallul adalah rukun penutup umroh yang menandai berakhirnya seluruh larangan ihram. Begitu rambut dipotong, jamaah telah halal melakukan seluruh hal yang sebelumnya dilarang saat berihram.',
    instructions: [
      'Bagi pria, disunnahkan Halq (mencukur gundul seluruh kepala) karena Rasulullah SAW mendoakan ampunan 3 kali bagi yang menggundul, atau Taqshir (memotong pendek merata minimal 3 helai rambut).',
      'Bagi wanita, hanya disyariatkan Taqshir (memotong ujung rambut sepanjang satu ruas jari / ±2-3 cm) secara tertutup.',
      'Membaca doa tahallul saat atau setelah mencukur rambut.',
      'Dengan selesainya tahallul, seluruh larangan ihram gugur dan jamaah boleh berganti memakai pakaian biasa serta memakai wewangian.',
    ],
    doaIds: ['doa_tahallul'],
    tips: [
      'Banyak barbershop resmi dan higienis dengan pisau cukur steril sekali pakai di lantai bawah Tower Zamzam dan sekitar pelataran Marwah.',
      'Bagi wanita, potonglah rambut di tempat tertutup atau di dalam kamar hotel agar aurat tidak terlihat oleh yang bukan mahram.',
    ],
    mistakesToAvoid: [
      'Hanya mencukur satu atau dua helai rambut secara sembarangan.',
      'Membuka jilbab wanita di pelataran Marwah yang terbuka untuk memotong rambut sehingga aurat terlihat orang banyak.',
    ],
  },
];

export const UMRAH_DOAS: UmrahDoa[] = [
  {
    id: 'niat_umrah',
    title: 'Niat Ihram Umroh',
    occasion: 'Diucapkan saat di Miqat sebelum melewati batas',
    arabic: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً',
    latin: "Labbaikallaahumma 'umratan.",
    translation:
      'Aku penuhi panggilan-Mu ya Allah untuk menunaikan ibadah umroh.',
    source: 'HR. Muslim no. 1251',
    category: 'ihram',
    tips: 'Niat bertempat di dalam hati, dan melafadzkannya dengan lisan adalah sunnah yang dianjurkan saat berihram.',
  },
  {
    id: 'talbiyah',
    title: 'Bacaan Talbiyah Lengkap',
    occasion: 'Dibaca terus-menerus sejak berihram hingga hendak memulai Thawaf',
    arabic:
      'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الحَمْدَ وَالنِّعْمَةَ لَكَ وَالمُلْكَ، لاَ شَرِيكَ لَكَ',
    latin:
      "Labbaik Allaahumma labbaaik, labbaika laa syariika laka labbaaik, innal hamda wan ni'mata laka wal mulk, laa syariika lak.",
    translation:
      'Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Aku penuhi panggilan-Mu, tiada sekutu bagi-Mu, aku penuhi panggilan-Mu. Sesungguhnya segala puji, kenikmatan, dan kerajaan hanyalah milik-Mu, tiada sekutu bagi-Mu.',
    source: 'HR. Bukhari no. 1549 & Muslim no. 1184',
    category: 'talbiyah',
    tips: 'Disunnahkan mengeraskan suara bagi pria, dan merendahkan suara bagi wanita.',
  },
  {
    id: 'shalawat_ihram',
    title: 'Shalawat & Doa Pasca Talbiyah',
    occasion: 'Dibaca setelah melantunkan bait-bait Talbiyah',
    arabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، اللَّهُمَّ إِنَّا نَسْأَلُكَ رِضَاكَ وَالجَنَّةَ، وَنَعُوذُ بِكَ مِنْ سَخَطِكَ وَالنَّارِ',
    latin:
      "Allaahumma shalli 'alaa Muhammadin wa 'alaa aali Muhammad. Allaahumma innaa nas-aluka ridhaaka wal jannah, wa na'uudzu bika min sakhatika wan-naar.",
    translation:
      'Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad dan keluarga Nabi Muhammad. Ya Allah, sesungguhnya kami memohon ridha-Mu dan surga, dan kami berlindung kepada-Mu dari murka-Mu dan siksa neraka.',
    source: 'Sunan Asy-Syafi\'i & Fiqih Sunnah',
    category: 'talbiyah',
  },
  {
    id: 'masuk_makkah',
    title: 'Doa Memasuki Kota Suci Makkah',
    occasion: 'Dibaca saat memasuki gerbang batas tanah haram Makkah',
    arabic:
      'اللَّهُمَّ هَذَا حَرَمُكَ وَأَمْنُكَ، فَحَرِّمْ لَحْمِي وَدَمِي وَشَعْرِي وَبَشَرِي عَلَى النَّارِ، وَآمِنِّي مِنْ عَذَابِكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    latin:
      "Allaahumma haadzaa haramuka wa amnuka, fa-harrim lahmii wa damii wa sya'rii wa basyarii 'alan-naar, wa aamin-nii min 'adzaabika yawma tab'atsu 'ibaadak.",
    translation:
      'Ya Allah, kota ini adalah tanah haram-Mu dan tempat aman-Mu, maka haramkanlah dagingku, darahku, rambutku, dan kulitku dari jilatan api neraka, serta amankanlah aku dari siksa-Mu pada hari Engkau membangkitkan hamba-hamba-Mu.',
    source: 'Doa Matsur Ulama Salaf',
    category: 'masjidil_haram',
  },
  {
    id: 'masuk_masjidil_haram',
    title: 'Doa Masuk Masjidil Haram',
    occasion: 'Mendahulukan kaki kanan saat melangkah masuk pintu masjid',
    arabic:
      'بِسْمِ اللَّهِ وَالصَّلاَةُ وَالسَّلاَمُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي وَافْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin:
      "Bismillaahi wash-shalaatu was-salaamu 'alaa Rasuulillaah. Allaahummagh-fir lii dzunuubii waftah lii abwaaba rahmatik.",
    translation:
      'Dengan nama Allah, serta shalawat dan salam atas Rasulullah. Ya Allah, ampunilah dosa-dosaku dan bukakanlah untukku pintu-pintu rahmat-Mu.',
    source: 'HR. Muslim no. 713 & Abu Dawud no. 465',
    category: 'masjidil_haram',
  },
  {
    id: 'melihat_kabah',
    title: 'Doa Saat Pertama Kali Melihat Ka\'bah',
    occasion: 'Dibaca seraya mengangkat kedua tangan saat Ka\'bah tampak di hadapan',
    arabic:
      'اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، فَحَيِّنَا رَبَّنَا بِالسَّلاَمِ. اللَّهُمَّ زِدْ هَذَا البَيْتَ تَشْرِيفاً وَتَعْظِيماً وَتَكْرِيماً وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَعَظَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفاً وَتَكْرِيماً وَتَعْظِيماً وَبِرّاً',
    latin:
      "Allaahumma Antas-Salaam wa minkas-salaam, fa-hayyinaa Rabbanaa bis-salaam. Allaahumma zid haadzal bayta tasyriifan wa ta'zhiiman wa takriiman wa mahaabah, wa zid man syarrafahu wa 'azhzhamahu mimman hajjahu awi'-tamarahu tasyriifan wa takriiman wa ta'zhiiman wa birraa.",
    translation:
      'Ya Allah, Engkaulah As-Salam (Maha Sejahtera) dan dari-Mu lah segala kesejahteraan, maka hidupkanlah kami wahai Rabb kami dengan kesejahteraan. Ya Allah, tambahkanlah kemuliaan, keagungan, kehormatan, dan wibawa pada Rumah (Baitullah) ini. Serta tambahkanlah kemuliaan, kehormatan, keagungan, dan kebaikan bagi siapa pun yang memuliakan dan mengagungkannya dari kalangan orang-orang yang berhaji maupun berumroh.',
    source: 'HR. Al-Baihaqi & Ibnu Abi Syaibah',
    category: 'kabah',
  },
  {
    id: 'istilam',
    title: 'Bacaan Istilam (Sejajar Hajar Aswad)',
    occasion: 'Dibaca di awal setiap putaran Thawaf menghadap Hajar Aswad',
    arabic: 'بِسْمِ اللَّهِ، وَاللَّهُ أَكْبَرُ',
    latin: 'Bismillaahi, wallaahu Akbar.',
    translation: 'Dengan nama Allah, dan Allah Maha Besar.',
    source: 'HR. Bukhari no. 1613',
    category: 'tawaf',
    tips: 'Cukup lambaikan telapak tangan kanan ke arah Hajar Aswad tanpa perlu mencium tangan atau berteriak.',
  },
  {
    id: 'doa_tawaf_umum',
    title: 'Doa Bebas Selama Putaran Thawaf',
    occasion: 'Dibaca selama berkeliling Ka\'bah sesuai hajat dan zikir',
    arabic:
      'سُبْحَانَ اللَّهِ، وَالحَمْدُ لِلَّهِ، وَلاَ إِلَهَ إِلاَّ اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ العَلِيِّ العَظِيمِ',
    latin:
      "Subhaanallaahi, wal-hamdulillaahi, wa laa ilaaha illallaahu, wallaahu Akbar, wa laa hawla wa laa quwwata illaa billaahil 'Aliyyil 'Azhiim.",
    translation:
      'Maha Suci Allah, segala puji bagi Allah, tiada sesembahan yang berhak disembah selain Allah, Allah Maha Besar, dan tiada daya serta upaya kecuali dengan pertolongan Allah Yang Maha Tinggi lagi Maha Agung.',
    source: 'HR. Ibnu Majah & At-Tirmidzi',
    category: 'tawaf',
  },
  {
    id: 'doa_yamani_hajar_aswad',
    title: 'Doa Antara Rukun Yamani & Hajar Aswad',
    occasion: 'Dibaca di setiap putaran antara Rukun Yamani hingga garis Hajar Aswad',
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin:
      "Rabbanaa aatinaa fid-dunyaa hasanah, wa fil aakhirati hasanah, wa qinaa 'adzaaban-naar.",
    translation:
      'Wahai Tuhan kami, berikanlah kepada kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa api neraka.',
    source: 'HR. Abu Dawud no. 1892 (Shahih)',
    category: 'tawaf',
  },
  {
    id: 'maqam_ibrahim',
    title: 'Doa Mendatangi Maqam Ibrahim',
    occasion: 'Dibaca saat melangkah menuju belakang Maqam Ibrahim setelah Thawaf',
    arabic: 'وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى',
    latin: "Wattakhidzuu mim maqaami Ibraahiima mushallaa.",
    translation:
      'Dan jadikanlah sebagian Maqam Ibrahim sebagai tempat sholat. (QS. Al-Baqarah: 125)',
    source: 'HR. Muslim no. 1218',
    category: 'maqam_ibrahim',
  },
  {
    id: 'minum_zamzam',
    title: 'Doa Minum Air Zam-Zam',
    occasion: 'Dibaca sebelum meminum air Zam-Zam',
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَرِزْقاً وَاسِعاً، وَشِفَاءً مِنْ كُلِّ دَاءٍ',
    latin:
      "Allaahumma innii as-aluka 'ilman naafi'aa, wa rizqan waasi'aa, wa syifaa-an min kulli daa'.",
    translation:
      'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang luas, dan kesembuhan dari segala macam penyakit.',
    source: 'HR. Ad-Daruquthni & Al-Hakim',
    category: 'zamzam',
  },
  {
    id: 'mendaki_shafa',
    title: 'Doa Mendekati & Mendaki Bukit Shafa',
    occasion: 'Dibaca saat hendak memulai Sa\'i menaiki Bukit Shafa',
    arabic:
      'إِنَّ الصَّفَا وَالمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ... أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ. اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ. لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الأَحْزَابَ وَحْدَهُ',
    latin:
      "Innash-shafaa wal marwata min sya'aa-irillaah... Abda-u bimaa bada-Allaahu bih. Allaahu Akbar, Allaahu Akbar, Allaahu Akbar. Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiitu wa Huwa 'alaa kulli syay-in qadiir. Laa ilaaha illallaahu wahdah, anjaza wa'dah, wa nashara 'abdah, wa hazamal ahzaaba wahdah.",
    translation:
      'Sesungguhnya Shafa dan Marwah adalah sebagian dari syiar-syiar Allah (QS. Al-Baqarah: 158)... Aku memulai dengan apa yang dimulai oleh Allah. Allah Maha Besar, Allah Maha Besar, Allah Maha Besar. Tiada sesembahan yang berhak disembah selain Allah semata, tiada sekutu bagi-Nya. Bagi-Nya segala kerajaan dan bagi-Nya segala puji, Dia Yang menghidupkan dan mematikan, dan Dia Maha Kuasa atas segala sesuatu. Tiada sesembahan selain Allah semata, Dia telah menepati janji-Nya, menolong hamba-Nya, dan mengalahkan musuh-musuh sendirian.',
    source: 'HR. Muslim no. 1218 (Hadits Jabir)',
    category: 'sai',
  },
  {
    id: 'doa_pilar_hijau',
    title: 'Doa di Antara Dua Pilar Hijau (Milain Akhdharain)',
    occasion: 'Dibaca saat berlari-lari kecil di antara lampu hijau di Mas\'a',
    arabic:
      'رَبِّ اغْفِرْ وَارْحَمْ، وَاعْفُ وَتَكَرَّمْ، وَتَجَاوَزْ عَمَّا تَعْلَمْ، إِنَّكَ تَعْلَمُ مَا لاَ نَعْلَمُ، إِنَّكَ أَنْتَ اللَّهُ الأَعَزُّ الأَكْرَمُ',
    latin:
      "Rabbighfir warham, wa'fu wa takarram, wa tajaawaz 'ammaa ta'lam, innaka ta'lamu maa laa na'lam, innaka Antallaahul A'azzul Akram.",
    translation:
      'Wahai Rabbku, ampunilah, sayangilah, maafkanlah, muliakanlah, dan hapuskanlah dosa-dosa yang Engkau ketahui. Sesungguhnya Engkau mengetahui apa yang tidak kami ketahui. Sesungguhnya Engkaulah Allah Yang Maha Perkasa lagi Maha Mulia.',
    source: 'Atsar Abdullah bin Umar & Abdullah bin Mas\'ud',
    category: 'sai',
  },
  {
    id: 'doa_marwah',
    title: 'Doa di Bukit Marwah',
    occasion: 'Dibaca saat tiba di puncak Bukit Marwah menghadap Ka\'bah',
    arabic:
      'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الحَمْدُ. لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الأَحْزَابَ وَحْدَهُ',
    latin:
      "Allaahu Akbar, Allaahu Akbar, Allaahu Akbar, wa lillaahil hamd. Laa ilaaha illallaahu wahdahu anjaza wa'dah wa nashara 'abdah wa hazamal ahzaaba wahdah.",
    translation:
      'Allah Maha Besar, Allah Maha Besar, Allah Maha Besar, dan segala puji hanya bagi Allah. Tiada sesembahan yang berhak disembah selain Allah semata, Yang menepati janji-Nya, menolong hamba-Nya, dan memenangkan atas musuh-musuh sendirian.',
    source: 'HR. Muslim no. 1218',
    category: 'sai',
  },
  {
    id: 'doa_tahallul',
    title: 'Doa Saat Tahallul (Potong Rambut)',
    occasion: 'Dibaca saat mencukur atau memotong rambut',
    arabic:
      'اللَّهُمَّ اجْعَلْ لِكُلِّ شَعْرَةٍ نُوراً يَوْمَ القِيَامَةِ، وَاغْفِرْ لِي ذُنُوبِي كُلَّهَا، وَتَقَبَّلْ مِنِّي عُمْرَتِي',
    latin:
      "Allaahummaj-'al likulli sya'ratin nuuran yawmal qiyaamah, wagh-fir lii dzunuubii kullahaa, wa taqabbal minnii 'umratii.",
    translation:
      'Ya Allah, jadikanlah untuk setiap helai rambut ini cahaya pada hari kiamat, ampunilah dosa-dosaku seluruhnya, dan terimalah ibadah umrohku.',
    source: 'Doa Matsur Sahabat & Fiqih Sunnah',
    category: 'tahallul',
  },
  {
    id: 'doa_raudhah',
    title: 'Salam & Doa Ziarah Rasulullah SAW di Raudhah',
    occasion: 'Dibaca saat berziarah ke Makam Rasulullah SAW di Masjid Nabawi Madinah',
    arabic:
      'السَّلاَمُ عَلَيْكَ يَا رَسُولَ اللَّهِ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، أَشْهَدُ أَنَّكَ بَلَّغْتَ الرِّسَالَةَ، وَأَدَّيْتَ الأَمَانَةَ، وَنَصَحْتَ الأُمَّةَ، وَجَاهَدْتَ فِي اللَّهِ حَقَّ جِهَادِهِ',
    latin:
      "As-salaamu 'alayka yaa Rasuulallaahi wa rahmatullaahi wa barakaatuh. Asyhadu annaka ballaghtar-risaalah, wa addaytal amaanah, wa nashahtal ummah, wa jaahadta fillaahi haqqa jihaadih.",
    translation:
      'Salam sejahtera atasmu wahai Rasulullah, serta rahmat Allah dan berkah-Nya. Aku bersaksi bahwa engkau telah menyampaikan risalah, menunaikan amanah, memberi nasehat kepada umat, dan telah berjuang di jalan Allah dengan sebenar-benarnya perjuangan.',
    source: 'Kitab Al-Adzkar An-Nawawi',
    category: 'ziarah',
  },
];

export const MIQAT_STATIONS: MiqatStation[] = [
  {
    id: 'bir_ali',
    name: 'Dzulhulaifah (Bir Ali)',
    arabicName: 'ذُو الحُلَيْفَةِ (بِئْرُ عَلِي)',
    distanceKm: 450,
    direction: 'Utara (Arah Madinah)',
    usedBy:
      'Jamaah yang datang dari arah Madinah Munawwarah (termasuk jamaah Indonesia Gelombang 1 yang mendarat di Madinah lebih dulu).',
    description:
      'Miqat terjauh dari Makkah. Memiliki masjid megah berdinding batu dengan taman luas dan ribuan fasilitas kamar mandi serta wudhu.',
    isIndonesiaCommon: true,
  },
  {
    id: 'yalamlam',
    name: 'Yalamlam (As-Sa\'diyah)',
    arabicName: 'يَلَمْلَم',
    distanceKm: 120,
    direction: 'Selatan',
    usedBy:
      'Jamaah dari Yaman, wilayah selatan, dan penerbangan laut/udara dari Indonesia (jalur selatan Samudera Hindia).',
    description:
      'Miqat bagi jamaah yang datang dari arah selatan. Sering dilewati oleh penerbangan langsung dari Indonesia menuju Bandara Internasional King Abdulaziz Jeddah.',
    isIndonesiaCommon: true,
  },
  {
    id: 'qarnul_manazil',
    name: 'Qarnul Manazil (As-Sailul Kabir)',
    arabicName: 'قَرْنُ المَنَازِلِ (السَّيْلُ الكَبِير)',
    distanceKm: 75,
    direction: 'Timur (Arah Thaif & Riyadh)',
    usedBy:
      'Jamaah dari wilayah Najd, Riyadh, Thaif, negara Teluk, serta penerbangan udara internasional yang melintas di atas koordinat miqat ini sebelum mendarat di Jeddah.',
    description:
      'Miqat utama di jalur timur pegunungan Thaif. Pesawat yang melintas biasanya memberi pengumuman 20-30 menit sebelum melewati garis batas miqat ini.',
    isIndonesiaCommon: true,
  },
  {
    id: 'juhfah',
    name: 'Al-Juhfah (Rabigh)',
    arabicName: 'الجُحْفَةُ (رَابِغ)',
    distanceKm: 187,
    direction: 'Barat Laut (Arah Syam & Mesir)',
    usedBy: 'Jamaah dari Syam, Mesir, Turki, Afrika Utara, dan Eropa.',
    description:
      'Dahulu merupakan kota penting. Saat ini jamaah berihram di Rabigh yang berdekatan dengan desa bersejarah Al-Juhfah.',
    isIndonesiaCommon: false,
  },
  {
    id: 'dzatu_irq',
    name: 'Dzatu \'Irq (Adh-Dharibah)',
    arabicName: 'ذَاتُ عِرْق',
    distanceKm: 100,
    direction: 'Timur Laut (Arah Irak)',
    usedBy: 'Jamaah dari Irak, Iran, dan negeri-negeri timur laut.',
    description:
      'Ditetapkan oleh Khalifah Umar bin Khattab r.a. berdasarkan posisi sejajar dengan miqat yang ditetapkan Nabi SAW.',
    isIndonesiaCommon: false,
  },
  {
    id: 'tanim',
    name: 'Tan\'im (Masjid Aisyah)',
    arabicName: 'التَّنْعِيمُ (مَسْجِدُ عَائِشَة)',
    distanceKm: 7.5,
    direction: 'Utara Kota Makkah',
    usedBy:
      'Penduduk Makkah atau jamaah yang sudah berada di Makkah dan ingin mengambil umroh kedua (badal umroh atau umroh sunnah).',
    description:
      'Tempat Ummul Mu\'minin Aisyah r.a. berihram atas petunjuk Rasulullah SAW. Masjid megah yang sangat dekat dan mudah dijangkau dengan taksi atau bus.',
    isIndonesiaCommon: true,
  },
  {
    id: 'jiranah',
    name: 'Ji\'ranah',
    arabicName: 'الجِعْرَانَة',
    distanceKm: 22,
    direction: 'Timur Laut Makkah',
    usedBy: 'Jamaah di Makkah yang ingin miqat di tempat Rasulullah SAW pernah berihram.',
    description:
      'Tempat bersejarah di mana Rasulullah SAW membagikan ghanimah Perang Hunain lalu berihram untuk umroh pada malam hari.',
    isIndonesiaCommon: true,
  },
];

export const IHRAM_PROHIBITIONS: IhramProhibition[] = [
  {
    id: 'pakaian_jahit',
    title: 'Memakai Pakaian Berjahit yang Membentuk Lekuk Tubuh',
    category: 'pria',
    penalty: 'Dam Fidyah (Pilih: Puasa 3 hari, Beri makan 6 miskin, atau Potong 1 kambing)',
    explanation:
      'Khusus pria: dilarang mengenakan baju kaos, kemeja, celana dalam, celana panjang, jas, atau sepatu bertutup yang menutupi mata kaki. Pria hanya memakai dua lembar kain ihram tanpa jahitan model pakaian.',
  },
  {
    id: 'tutup_kepala',
    title: 'Menutup Kepala dengan Sesuatu yang Menempel',
    category: 'pria',
    penalty: 'Dam Fidyah',
    explanation:
      'Khusus pria: dilarang memakai peci, topi, sorban, atau kupluk yang menempel di kepala. Namun diperbolehkan berteduh di bawah payung, atap bus, atau tenda.',
  },
  {
    id: 'cadar_sarung_tangan',
    title: 'Menutup Wajah (Cadar) dan Sarung Tangan',
    category: 'wanita',
    penalty: 'Dam Fidyah',
    explanation:
      'Khusus wanita: dilarang memakai penutup wajah (niqab/cadar) dan sarung tangan yang dijahit khusus untuk tangan. Boleh menutup wajah dengan menjulurkan ujung jilbab jika ada pria bukan mahram yang lewat tanpa menempelkannya.',
  },
  {
    id: 'parfum',
    title: 'Memakai Wewangian / Parfum pada Tubuh atau Kain',
    category: 'semua',
    penalty: 'Dam Fidyah',
    explanation:
      'Dilarang menggunakan parfum, sabun mandi wangi, lotion harum semerbak, atau tisu basah beralkohol wangi setelah niat ihram. Gunakan sabun & lotion khusus tanpa aroma (unscented).',
  },
  {
    id: 'potong_kuku_rambut',
    title: 'Memotong Kuku, Mencukur atau Mencabut Rambut & Bulu',
    category: 'semua',
    penalty: 'Dam Fidyah',
    explanation:
      'Dilarang memotong kuku tangan/kaki, mencukur rambut kepala, kumis, bulu ketiak, atau bulu badan lainnya sebelum tahallul.',
  },
  {
    id: 'minyak_rambut',
    title: 'Meminyaki Rambut atau Jenggot',
    category: 'semua',
    penalty: 'Dam Fidyah',
    explanation:
      'Dilarang mengoleskan minyak rambut atau pomade pada rambut kepala maupun janggut saat sedang berihram.',
  },
  {
    id: 'berburu_hewan',
    title: 'Membunuh atau Berburu Hewan Darat Liar',
    category: 'semua',
    penalty: 'Dam Senilai Hewan yang Dibunuh',
    explanation:
      'Dilarang berburu, membunuh, atau membantu membunuh hewan buruan darat di Tanah Haram, kecuali hewan berbahaya seperti kalajengking, ular, tikus, atau anjing gila.',
  },
  {
    id: 'merusak_tanaman',
    title: 'Menebang Pohon atau Mencabut Tanaman Hijau Tanah Haram',
    category: 'semua',
    penalty: 'Dosa Besar & Ganti Rugi',
    explanation:
      'Tanah Haram Makkah disucikan, tidak boleh dicabut rumputnya dan tidak boleh dipotong ranting atau pepohonannya.',
  },
  {
    id: 'akad_nikah',
    title: 'Menikah, Menikahkan, atau Meminang (Khithbah)',
    category: 'semua',
    penalty: 'Akad Nikah Tidak Sah / Batal',
    explanation:
      'Orang yang sedang berihram dilarang melangsungkan akad nikah, menjadi wali nikah, maupun meminang wanita.',
  },
  {
    id: 'bercumbu',
    title: 'Bercumbu atau Kontak Fisik dengan Syahwat (Rafats)',
    category: 'semua',
    penalty: 'Dam Menyembelih 1 Ekor Kambing',
    explanation:
      'Dilarang berciuman, berpelukan dengan syahwat, atau mengucapkan perkataan cabul/erotis selama masa ihram.',
  },
  {
    id: 'jima',
    title: 'Berhubungan Suami Istri (Jima\')',
    category: 'semua',
    penalty: 'Umroh Batal + Wajib Qadha + Dam 1 Ekor Unta/Sapi/Kambing',
    explanation:
      'Larangan paling berat. Jika dilakukan sebelum tahallul, ibadah umrohnya gugur (batal), wajib diselesaikan secara lahiriah, wajib meng-qadha umroh di lain waktu, dan membayar dam seekor unta atau kambing.',
  },
];

export const UMRAH_CHECKLIST_DEFAULT: UmrahChecklistItem[] = [
  // Dokumen
  {
    id: 'dok_paspor',
    title: 'Paspor Asli (Masa Berlaku Min. 6 Bulan)',
    category: 'dokumen',
    essential: true,
    notes: 'Simpan fotokopi paspor dan softcopy di HP/cloud.',
  },
  {
    id: 'dok_visa',
    title: 'Visa Umroh / Visa Elektronik (e-Visa)',
    category: 'dokumen',
    essential: true,
    notes: 'Cetak fisik 2 rangkap dan simpan PDF di smartphone.',
  },
  {
    id: 'dok_tiket',
    title: 'Tiket Pesawat PP & Bukti Reservasi Hotel',
    category: 'dokumen',
    essential: true,
    notes: 'Pastikan nama sesuai persis dengan paspor.',
  },
  {
    id: 'dok_vaksin',
    title: 'Buku Kuning / Sertifikat Vaksin Meningitis',
    category: 'dokumen',
    essential: true,
    notes: 'Wajib sesuai regulasi Kementerian Kesehatan Saudi & Kemenkes RI.',
  },
  {
    id: 'dok_uang',
    title: 'Uang Tunai SAR (Riyal Saudi) & Kartu ATM/Debit Berlogo Visa/Mastercard',
    category: 'dokumen',
    essential: true,
    notes: 'Bawa riyal pecahan 5, 10, 50, dan 100 untuk kebutuhan infak/jajan.',
  },
  // Pakaian
  {
    id: 'pak_kain_ihram',
    title: 'Kain Ihram Pria (2 Set / 4 Lembar)',
    category: 'pakaian',
    essential: true,
    notes: 'Bahan katun handuk tebal dan menyerap keringat.',
  },
  {
    id: 'pak_sabuk_ihram',
    title: 'Sabuk Ikat Pinggang Ihram Berkantong',
    category: 'pakaian',
    essential: true,
    notes: 'Menjaga kain bawah tidak melorot dan tempat menaruh uang.',
  },
  {
    id: 'pak_mukena',
    title: 'Mukena / Gamis Syar\'i Longgar (Wanita)',
    category: 'pakaian',
    essential: true,
    notes: 'Bahan adem berwarna putih atau hitam/gelap tidak menerawang.',
  },
  {
    id: 'pak_kaos_kaki',
    title: 'Kaos Kaki Thawaf Anti-Slip & Dalaman Adem',
    category: 'pakaian',
    essential: false,
    notes: 'Lantai marmer Masjidil Haram bisa sangat dingin di malam/subuh.',
  },
  {
    id: 'pak_sandal_jepit',
    title: 'Sandal Gunung / Sandal Nyaman + Tas Sandal',
    category: 'pakaian',
    essential: true,
    notes: 'Bawa tas sandal serut masuk ke dalam masjid agar tidak tertukar/hilang.',
  },
  // Kesehatan
  {
    id: 'kes_obat_pribadi',
    title: 'Obat-obatan Pribadi Rutin & Surat Dokter',
    category: 'kesehatan',
    essential: true,
    notes: 'Obat tensi, diabetes, asma, maag, parasetamol, antasida, tolak angin.',
  },
  {
    id: 'kes_pelembab',
    title: 'Lip Balm & Vaseline Petroleum Jelly (Unscented / Tanpa Parfum)',
    category: 'kesehatan',
    essential: true,
    notes: 'Mencegah bibir pecah-pecah dan lecet di paha bagian dalam saat jalan jauh.',
  },
  {
    id: 'kes_masker',
    title: 'Masker Medis & Semprotan Air Wajah (Face Spray)',
    category: 'kesehatan',
    essential: true,
    notes: 'Melindungi dari debu dan menjaga kesegaran di cuaca terik.',
  },
  {
    id: 'kes_tetes_mata',
    title: 'Tetes Mata Steril & Vitamin C / Multivitamin',
    category: 'kesehatan',
    essential: false,
    notes: 'Menjaga daya tahan tubuh dari kelelahan fisik.',
  },
  // Ibadah & Perlengkapan
  {
    id: 'ibd_aplikasi_nurul_islam',
    title: 'Aplikasi Nurul Islam (Al-Quran, Doa, Counter Thawaf)',
    category: 'ibadah',
    essential: true,
    notes: 'Sudah mendukung mode offline penuh saat di Tanah Suci.',
  },
  {
    id: 'ibd_aplikasi_nusuk',
    title: 'Aplikasi Nusuk (Telah Terpasang & Terverifikasi)',
    category: 'ibadah',
    essential: true,
    notes: 'Wajib untuk booking jadwal Tasrih masuk ke Raudhah Masjid Nabawi.',
  },
  {
    id: 'ibd_powerbank',
    title: 'Powerbank (Kapasitas Maksimal 20.000 mAh)',
    category: 'perlengkapan',
    essential: true,
    notes: 'Bawa di bagasi kabin pesawat (dilarang di bagasi terdaftar).',
  },
  {
    id: 'ibd_colokan_arab',
    title: 'Steker Adaptor Colokan Tipe G (Kaki Tiga Inggris/Arab)',
    category: 'perlengkapan',
    essential: true,
    notes: 'Sebagian besar hotel di Makkah & Madinah memakai stopkontak tipe G.',
  },
  {
    id: 'ibd_gunting_tahallul',
    title: 'Gunting Lipat Kecil untuk Tahallul (Simpan di Bagasi Pesawat)',
    category: 'perlengkapan',
    essential: true,
    notes: 'Wajib masuk koper bagasi, dilarang masuk kabin pesawat!',
  },
];
