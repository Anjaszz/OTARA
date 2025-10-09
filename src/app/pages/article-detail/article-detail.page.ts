import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, shareOutline, bookmarkOutline } from 'ionicons/icons';

interface Article {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
  content?: string;
  author?: string;
  category?: string;
}

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.page.html',
  styleUrls: ['./article-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonIcon
  ]
})
export class ArticleDetailPage implements OnInit {
  article: Article | null = null;

  // Dummy full articles data
  articles: Article[] = [
    {
      id: 1,
      title: 'Tips Meningkatkan Penjualan UMKM di Era Digital',
      summary: 'Pelajari strategi pemasaran digital yang efektif untuk mengembangkan bisnis UMKM Anda',
      date: '2 hari yang lalu',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      author: 'Admin UMKM Bekasi',
      category: 'Tips Bisnis',
      content: `
        <p>Di era digital saat ini, pelaku UMKM harus mampu beradaptasi dengan perubahan perilaku konsumen yang semakin mengandalkan teknologi dalam berbelanja. Berikut adalah beberapa strategi yang dapat membantu meningkatkan penjualan UMKM Anda:</p>

        <h3>1. Manfaatkan Media Sosial</h3>
        <p>Media sosial seperti Instagram, Facebook, dan TikTok adalah platform yang sangat efektif untuk mempromosikan produk. Buatlah konten yang menarik dan konsisten untuk membangun engagement dengan calon pelanggan.</p>

        <h3>2. Optimalkan E-Commerce</h3>
        <p>Jangan ragu untuk memanfaatkan marketplace seperti Tokopedia, Shopee, atau Bukalapak. Platform ini sudah memiliki jutaan pengguna aktif yang siap menjadi pelanggan Anda.</p>

        <h3>3. Bangun Website Sendiri</h3>
        <p>Memiliki website sendiri akan meningkatkan kredibilitas bisnis Anda. Website juga memudahkan pelanggan untuk menemukan informasi lengkap tentang produk dan layanan yang Anda tawarkan.</p>

        <h3>4. Gunakan Digital Marketing</h3>
        <p>Investasi pada iklan digital seperti Facebook Ads atau Google Ads dapat membantu menjangkau target pasar yang lebih spesifik dengan budget yang terukur.</p>

        <h3>5. Layanan Pelanggan yang Responsif</h3>
        <p>Pastikan Anda merespon pertanyaan dan keluhan pelanggan dengan cepat. Pelayanan yang baik akan meningkatkan kepercayaan dan loyalitas pelanggan.</p>

        <p>Dengan menerapkan strategi-strategi di atas secara konsisten, UMKM Anda akan memiliki peluang lebih besar untuk berkembang di era digital ini.</p>
      `
    },
    {
      id: 2,
      title: 'Program Bantuan Modal untuk UMKM Kota Bekasi',
      summary: 'Pemerintah Kota Bekasi meluncurkan program bantuan modal bagi pelaku UMKM',
      date: '5 hari yang lalu',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      author: 'Admin UMKM Bekasi',
      category: 'Berita',
      content: `
        <p>Pemerintah Kota Bekasi kembali menunjukkan komitmennya dalam mendukung perkembangan UMKM lokal dengan meluncurkan program bantuan modal usaha tahun 2025.</p>

        <h3>Detail Program</h3>
        <p>Program ini menyediakan bantuan modal dengan skema pinjaman lunak kepada pelaku UMKM yang memenuhi syarat. Berikut adalah detail programnya:</p>

        <ul>
          <li><strong>Jumlah Bantuan:</strong> Rp 5 juta - Rp 50 juta per UMKM</li>
          <li><strong>Bunga:</strong> 2% per tahun (sangat rendah)</li>
          <li><strong>Tenor:</strong> Maksimal 3 tahun</li>
          <li><strong>Masa Tenggang:</strong> 6 bulan pertama</li>
        </ul>

        <h3>Syarat dan Ketentuan</h3>
        <ul>
          <li>Memiliki KTP Kota Bekasi</li>
          <li>Memiliki usaha yang sudah berjalan minimal 1 tahun</li>
          <li>Memiliki NPWP dan NIB (Nomor Induk Berusaha)</li>
          <li>Tidak sedang menerima bantuan modal dari program pemerintah lainnya</li>
          <li>Melampirkan proposal usaha dan laporan keuangan sederhana</li>
        </ul>

        <h3>Cara Mendaftar</h3>
        <p>Pelaku UMKM yang berminat dapat mendaftar melalui website resmi Dinas Koperasi dan UMKM Kota Bekasi atau datang langsung ke kantor Dinas dengan membawa dokumen persyaratan.</p>

        <p>Periode pendaftaran dibuka mulai 1 Februari 2025 hingga 31 Maret 2025. Jangan lewatkan kesempatan emas ini untuk mengembangkan usaha Anda!</p>
      `
    },
    {
      id: 3,
      title: 'Kisah Sukses UMKM Lokal yang Go Internasional',
      summary: 'Inspirasi dari pelaku UMKM yang berhasil menembus pasar internasional',
      date: '1 minggu yang lalu',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      author: 'Admin UMKM Bekasi',
      category: 'Inspirasi',
      content: `
        <p>Dari sebuah usaha rumahan yang dimulai dengan modal pas-pasan, kini produk kerajinan tangan "Bekasi Craft" telah menembus pasar internasional dan diekspor ke berbagai negara di Asia dan Eropa.</p>

        <h3>Awal Mula</h3>
        <p>Ibu Siti Rahmawati, pemilik Bekasi Craft, memulai usahanya pada tahun 2018 dengan modal awal hanya Rp 2 juta. Berawal dari hobi membuat kerajinan anyaman bambu, kini usahanya telah berkembang menjadi bisnis dengan omzet ratusan juta per bulan.</p>

        <h3>Kunci Kesuksesan</h3>
        <p>"Kunci kesuksesan kami adalah konsistensi dalam menjaga kualitas dan terus berinovasi mengikuti tren pasar," ujar Ibu Siti.</p>

        <p>Berikut adalah beberapa strategi yang diterapkan:</p>
        <ul>
          <li><strong>Fokus pada Kualitas:</strong> Setiap produk dibuat dengan standar kualitas tinggi dan dikontrol ketat sebelum dipasarkan</li>
          <li><strong>Inovasi Desain:</strong> Rutin menghadirkan desain baru yang mengikuti tren global namun tetap mempertahankan ciri khas lokal</li>
          <li><strong>Pemanfaatan Digital Marketing:</strong> Aktif mempromosikan produk melalui media sosial dan marketplace internasional</li>
          <li><strong>Sertifikasi Produk:</strong> Memiliki sertifikasi SNI dan halal yang meningkatkan kepercayaan konsumen</li>
          <li><strong>Networking:</strong> Aktif mengikuti pameran dan event UMKM untuk memperluas jaringan</li>
        </ul>

        <h3>Ekspansi Internasional</h3>
        <p>Pada tahun 2023, Bekasi Craft mulai merambah pasar internasional melalui platform e-commerce global. Produknya kini telah diekspor ke Singapura, Malaysia, Jepang, dan beberapa negara Eropa.</p>

        <p>"Jangan pernah takut bermimpi besar. Yang penting terus belajar, beradaptasi, dan pantang menyerah," pesan Ibu Siti untuk para pelaku UMKM lainnya.</p>

        <h3>Dampak Sosial</h3>
        <p>Kesuksesan Bekasi Craft juga berdampak positif bagi masyarakat sekitar. Saat ini, usaha ini telah mempekerjakan lebih dari 30 pengrajin lokal dan terus membuka peluang kerja bagi warga sekitar.</p>
      `
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ arrowBack, shareOutline, bookmarkOutline });
  }

  ngOnInit() {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.loadArticle(parseInt(articleId));
    }
  }

  loadArticle(id: number) {
    this.article = this.articles.find(a => a.id === id) || null;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  shareArticle() {
    // Implement share functionality
    if (navigator.share && this.article) {
      navigator.share({
        title: this.article.title,
        text: this.article.summary,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    }
  }

  bookmarkArticle() {
    // Implement bookmark functionality
    console.log('Bookmark article');
  }
}
