import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateService, CurrentDateResponse, ToHijriResponse, ToGregorianResponse, DateDiffResponse } from './services/date.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly dateService = inject(DateService);

  // Current date data
  currentDate = signal<CurrentDateResponse | null>(null);

  // Tab navigation
  activeTab = signal<'current' | 'toHijri' | 'toGregorian' | 'dateDiff'>('current');

  // To Hijri conversion
  gregorianInput = signal('');
  hijriResult = signal<ToHijriResponse | null>(null);

  // To Gregorian conversion
  hijriYear = signal<number>(1446);
  hijriMonth = signal<number>(6);
  hijriDay = signal<number>(15);
  gregorianResult = signal<ToGregorianResponse | null>(null);

  // Date difference
  diffDate = signal('');
  diffDays = signal<number>(30);
  diffResult = signal<DateDiffResponse | null>(null);

  // Loading states
  loading = signal(false);
  error = signal<string | null>(null);

  // Hijri months for dropdown
  hijriMonths = [
    { value: 1, name: 'محرم' },
    { value: 2, name: 'صفر' },
    { value: 3, name: 'ربيع الأول' },
    { value: 4, name: 'ربيع الآخر' },
    { value: 5, name: 'جمادى الأولى' },
    { value: 6, name: 'جمادى الآخرة' },
    { value: 7, name: 'رجب' },
    { value: 8, name: 'شعبان' },
    { value: 9, name: 'رمضان' },
    { value: 10, name: 'شوال' },
    { value: 11, name: 'ذو القعدة' },
    { value: 12, name: 'ذو الحجة' }
  ];

  ngOnInit(): void {
    this.loadCurrentDate();
    this.setDefaultDates();
  }

  private setDefaultDates(): void {
    const today = new Date();
    this.gregorianInput.set(today.toISOString().split('T')[0]);
    this.diffDate.set(today.toISOString().split('T')[0]);
  }

  loadCurrentDate(): void {
    this.loading.set(true);
    this.error.set(null);

    this.dateService.getCurrentDate().subscribe({
      next: (data) => {
        this.currentDate.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('فشل في تحميل التاريخ الحالي');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  convertToHijri(): void {
    if (!this.gregorianInput()) return;

    this.loading.set(true);
    this.error.set(null);

    const date = new Date(this.gregorianInput());

    this.dateService.toHijri(date).subscribe({
      next: (data) => {
        this.hijriResult.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('فشل في تحويل التاريخ');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  convertToGregorian(): void {
    this.loading.set(true);
    this.error.set(null);

    this.dateService.toGregorian(
      this.hijriYear(),
      this.hijriMonth(),
      this.hijriDay()
    ).subscribe({
      next: (data) => {
        this.gregorianResult.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('فشل في تحويل التاريخ');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  calculateDateDiff(): void {
    if (!this.diffDate()) return;

    this.loading.set(true);
    this.error.set(null);

    const date = new Date(this.diffDate());

    this.dateService.getDateDiff(date, this.diffDays()).subscribe({
      next: (data) => {
        this.diffResult.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('فشل في حساب الفرق');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  setActiveTab(tab: 'current' | 'toHijri' | 'toGregorian' | 'dateDiff'): void {
    this.activeTab.set(tab);
    this.error.set(null);
  }
}
