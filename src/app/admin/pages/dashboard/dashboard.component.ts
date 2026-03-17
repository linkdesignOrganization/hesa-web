import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MockDataService } from '../../../shared/services/mock-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private mockData = inject(MockDataService);
  data = signal<ReturnType<MockDataService['getDashboardData']> | null>(null);
  loading = signal(true);
  error = signal(false);

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  async loadDashboard(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      // Simulate async loading
      await new Promise(resolve => setTimeout(resolve, 800));
      const dashData = this.mockData.getDashboardData();
      this.data.set(dashData);
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }
}
