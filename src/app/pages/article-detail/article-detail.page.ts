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
import { HttpClient } from '@angular/common/http';

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
  articles: Article[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    addIcons({ arrowBack, shareOutline, bookmarkOutline });
  }

  ngOnInit() {
    this.loadArticlesData();
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.loadArticle(parseInt(articleId));
    }
  }

  loadArticlesData() {
    this.http.get<Article[]>('assets/data/articles.json').subscribe({
      next: (data) => {
        this.articles = data;
        // Reload article if id is already set
        const articleId = this.route.snapshot.paramMap.get('id');
        if (articleId) {
          this.loadArticle(parseInt(articleId));
        }
      },
      error: (err) => {
        console.error('Error loading articles:', err);
      }
    });
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
