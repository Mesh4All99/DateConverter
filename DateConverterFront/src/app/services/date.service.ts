import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CurrentDateResponse {
    hijri: string;
    fullHijri: string;
    gregorian: string;
    fullGregorian: string;
}

export interface ToHijriResponse {
    hijriShort: string;
    hijriLong: string;
}

export interface ToGregorianResponse {
    gregorianShort: string;
    gregorianLong: string;
}

export interface DateDiffResponse {
    date: string;
    hijri: string;
}

@Injectable({
    providedIn: 'root'
})
export class DateService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'https://localhost:5000';

    getCurrentDate(): Observable<CurrentDateResponse> {
        return this.http.get<CurrentDateResponse>(`${this.baseUrl}/`);
    }

    toHijri(date: Date): Observable<ToHijriResponse> {
        const dateStr = date.toISOString();
        return this.http.get<ToHijriResponse>(`${this.baseUrl}/to-hijri?date=${dateStr}`);
    }

    toGregorian(year: number, month: number, day: number): Observable<ToGregorianResponse> {
        return this.http.get<ToGregorianResponse>(
            `${this.baseUrl}/to-gregorian?year=${year}&month=${month}&day=${day}`
        );
    }

    getDateDiff(date: Date, numberOfDays: number): Observable<DateDiffResponse> {
        const dateStr = date.toISOString();
        return this.http.get<DateDiffResponse>(
            `${this.baseUrl}/Date-Diff?date=${dateStr}&numberOfDays=${numberOfDays}`
        );
    }
}
