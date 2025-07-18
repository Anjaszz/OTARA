import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonSpinner,
  IonToast, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  checkmarkOutline,
  walletOutline,
  trendingUpOutline,
  trendingDownOutline,
  swapHorizontalOutline,
  calendarOutline,
  locationOutline,
  documentTextOutline,
  pricetagOutline,
  cardOutline,
  cashOutline,
  phonePortraitOutline,
  saveOutline, 
  refreshOutline, alertCircleOutline, gridOutline, checkmarkCircle, optionsOutline, checkmarkCircleOutline, closeOutline } from 'ionicons/icons';
import { 
  TransactionService, 
  CategoryService, 
  CreateTransactionRequest, 
  Category 
} from 'src/app/services/transaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.page.html',
  styleUrls: ['./add-transaction.page.scss'],
  standalone: true,
  imports: [IonIcon, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonToast
  ]
})
export class AddTransactionPage implements OnInit, OnDestroy {
  transactionForm!: FormGroup;
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  selectedType: 'income' | 'expense' | 'transfer' = 'expense';
  isLoading = false;
  isSaving = false;
  showToast = false;
  showOptionalFields = false;
  toastMessage = '';
  toastColor = 'danger';
  

  private subscriptions = new Subscription();

  accountTypes = [
    { value: 'cash' as const, label: 'Tunai', icon: 'cash-outline' },
    { value: 'bank' as const, label: 'Bank', icon: 'card-outline' },
    { value: 'credit_card' as const, label: 'Kartu Kredit', icon: 'card-outline' },
    { value: 'e_wallet' as const, label: 'E-Wallet', icon: 'phone-portrait-outline' },
    { value: 'savings' as const, label: 'Tabungan', icon: 'save-outline' }
  ];

  transactionTypes = [
    { value: 'expense' as const, label: 'Pengeluaran', icon: 'trending-down-outline', color: 'text-red-600', bgColor: 'bg-red-100' },
    { value: 'income' as const, label: 'Pemasukan', icon: 'trending-up-outline', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'transfer' as const, label: 'Transfer', icon: 'swap-horizontal-outline', color: 'text-blue-600', bgColor: 'bg-blue-100' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {
    addIcons({arrowBackOutline,refreshOutline,walletOutline,alertCircleOutline,gridOutline,checkmarkCircle,documentTextOutline,cardOutline,calendarOutline,optionsOutline,locationOutline,pricetagOutline,checkmarkCircleOutline,closeOutline,checkmarkOutline,trendingUpOutline,trendingDownOutline,swapHorizontalOutline,cashOutline,phonePortraitOutline,saveOutline});

    this.initializeForm();
  }

  // NEW: Separate method untuk inisialisasi form
  private initializeForm() {
    this.transactionForm = this.fb.group({
      type: [this.selectedType, [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      account: ['cash', [Validators.required]],
      paymentMethod: [''],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      location: [''],
      notes: [''],
      tags: [''],
      isRecurring: [false]
    });
  }

  ngOnInit() {
    // UPDATED: Reset form setiap kali halaman dimuat
    this.resetFormToDefault();
    this.loadCategories();
    this.setupFormSubscriptions();
  }

  ngOnDestroy() {
    // UPDATED: Reset form setiap kali halaman ditinggalkan
    this.resetFormToDefault();
    this.subscriptions.unsubscribe();
  }

  // NEW: Method untuk reset form ke default values
  private resetFormToDefault() {
    this.selectedType = 'expense';
    this.showOptionalFields = false;
    this.isSaving = false;
    this.showToast = false;
    
    // Reset form dengan nilai default
    if (this.transactionForm) {
      this.transactionForm.reset({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        account: 'cash',
        paymentMethod: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        notes: '',
        tags: '',
        isRecurring: false
      });
      
      // TAMBAHAN: Reset manual input field jumlah di DOM
      this.resetAmountInput();
      
      // Mark form as pristine untuk menghindari warning unsaved changes
      this.transactionForm.markAsPristine();
      this.transactionForm.markAsUntouched();
    }
  }

  // NEW: Method untuk reset input jumlah secara manual
  private resetAmountInput() {
    // Reset input field jumlah yang ter-format
    setTimeout(() => {
      const amountInput = document.querySelector('input[placeholder="0"]') as HTMLInputElement;
      if (amountInput) {
        amountInput.value = '';
      }
    }, 0);
  }

  private setupFormSubscriptions() {
    // Watch for type changes to filter categories
    const typeSub = this.transactionForm.get('type')?.valueChanges.subscribe(type => {
      if (type) {
        this.selectedType = type;
        this.filterCategories();
        // Clear category selection when type changes
        this.transactionForm.patchValue({ category: '' });
      }
    });

    if (typeSub) {
      this.subscriptions.add(typeSub);
    }
  }

  private loadCategories() {
    this.isLoading = true;
    
    const categorySub = this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response && response.success && response.data && response.data.categories) {
          this.categories = response.data.categories.filter(cat => cat.isActive);
          this.filterCategories();
        } else {
          console.error('Invalid categories response structure:', response);
          this.categories = [];
          this.filteredCategories = [];
          this.showToastMessage('Format data kategori tidak valid', 'danger');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
        this.filteredCategories = [];
        this.showToastMessage(error?.message || 'Gagal memuat kategori', 'danger');
        this.isLoading = false;
      }
    });

    this.subscriptions.add(categorySub);
  }

  private filterCategories() {
    if (!Array.isArray(this.categories)) {
      this.filteredCategories = [];
      return;
    }
    
    // For transfer type, we might want to show both income and expense categories
    // or have specific transfer categories
    if (this.selectedType === 'transfer') {
      // For now, show all active categories for transfer
      this.filteredCategories = this.categories.filter(cat => cat.isActive);
    } else {
      this.filteredCategories = this.categories.filter(cat => 
        cat.type === this.selectedType && cat.isActive
      );
    }
  }

  selectType(type: 'income' | 'expense' | 'transfer') {
    this.selectedType = type;
    this.transactionForm.patchValue({ type });
  }

  formatCurrency(event: any) {
    const input = event.target;
    let value = input.value.replace(/[^0-9]/g, '');
    
    if (value) {
      const numericValue = parseInt(value);
      const formattedValue = new Intl.NumberFormat('id-ID').format(numericValue);
      input.value = formattedValue;
      
      // Update form control with numeric value
      this.transactionForm.patchValue({ amount: numericValue });
    } else {
      // PERBAIKAN: Reset input dan form control saat value kosong
      input.value = '';
      this.transactionForm.patchValue({ amount: '' });
    }
  }

  async onSubmit() {
    if (this.transactionForm.valid) {
      this.isSaving = true;
      
      try {
        const formData = this.transactionForm.value;
        
        // Process tags - convert comma-separated string to array
        const tags = formData.tags 
          ? formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
          : [];

        // Ensure amount is a number
        const amount = typeof formData.amount === 'string' 
          ? parseInt(formData.amount.replace(/[^0-9]/g, ''))
          : formData.amount;

        // Build transaction request according to API spec
        const transactionData: CreateTransactionRequest = {
          type: formData.type,
          amount: amount,
          category: formData.category,
          description: formData.description.trim(),
          account: formData.account,
          date: formData.date,
        };

        // Add optional fields only if they have values
        if (formData.paymentMethod && formData.paymentMethod.trim()) {
          transactionData.paymentMethod = formData.paymentMethod.trim();
        }
        
        if (formData.location && formData.location.trim()) {
          transactionData.location = formData.location.trim();
        }
        
        if (formData.notes && formData.notes.trim()) {
          transactionData.notes = formData.notes.trim();
        }
        
        if (tags.length > 0) {
          transactionData.tags = tags;
        }

        console.log('Sending transaction data:', transactionData); // Debug log

        const createSub = this.transactionService.createTransaction(transactionData).subscribe({
          next: (response) => {
            if (response.success) {
              this.showToastMessage('Transaksi berhasil ditambahkan!', 'success');
              
              // UPDATED: Reset form setelah berhasil submit, kemudian navigate
              setTimeout(() => {
                this.resetFormToDefault();
                this.router.navigate(['/dashboard']);
              }, 1500);
            } else {
              this.showToastMessage('Gagal menambahkan transaksi', 'danger');
            }
            this.isSaving = false;
          },
          error: (error) => {
            console.error('Error creating transaction:', error);
            this.showToastMessage(error?.message || 'Gagal menambahkan transaksi', 'danger');
            this.isSaving = false;
          }
        });

        this.subscriptions.add(createSub);
        
      } catch (error: any) {
        console.error('Form submission error:', error);
        this.showToastMessage('Terjadi kesalahan saat memproses data', 'danger');
        this.isSaving = false;
      }
    } else {
      this.showToastMessage('Mohon lengkapi semua field yang diperlukan', 'warning');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack() {
    // UPDATED: Reset form sebelum navigate kembali
    this.resetFormToDefault();
    this.router.navigate(['/dashboard']);
  }

  toggleOptionalFields() {
    this.showOptionalFields = !this.showOptionalFields;
  }

  resetForm() {
    // UPDATED: Gunakan method resetFormToDefault yang baru
    this.showOptionalFields = false;
    
    setTimeout(() => {
      this.resetFormToDefault();
      this.filterCategories();
      
      // Show success feedback
      this.showToastMessage('Form berhasil direset', 'success');
    }, 100);
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  // Getters for form validation
  get amount() { return this.transactionForm.get('amount'); }
  get category() { return this.transactionForm.get('category'); }
  get description() { return this.transactionForm.get('description'); }
  get account() { return this.transactionForm.get('account'); }
  get date() { return this.transactionForm.get('date'); }

  // Helper methods
  getCategoryIcon(categoryId: string): string {
    if (!Array.isArray(this.categories)) return 'pricetag-outline';
    const category = this.categories.find(cat => cat._id === categoryId);
    return category?.icon || 'pricetag-outline';
  }

  getCategoryColor(categoryId: string): string {
    if (!Array.isArray(this.categories)) return '#6b7280';
    const category = this.categories.find(cat => cat._id === categoryId);
    return category?.color || '#6b7280';
  }

  getAccountIcon(accountType: string): string {
    const account = this.accountTypes.find(acc => acc.value === accountType);
    return account?.icon || 'wallet-outline';
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}