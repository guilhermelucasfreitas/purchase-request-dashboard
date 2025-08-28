import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './stats-cards.html',
  styleUrl: './stats-cards.scss',
})
export class StatsCards {
  // Input signals for statistics
  pendingCount = input.required<number>();
  inProgressCount = input.required<number>();
  doneCount = input.required<number>();
  inReviewCount = input.required<number>();
  overdueCount = input.required<number>();
}
