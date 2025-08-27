import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  // Inputs
  isCollapsed = input<boolean>(false);
  isDarkMode = input<boolean>(false);
  isHandset = input<boolean>(false);

  // Outputs
  toggleCollapse = output<void>();
  toggleTheme = output<void>();
  navItemClick = output<void>();

  onToggleCollapse() {
    this.toggleCollapse.emit();
  }

  onToggleTheme() {
    this.toggleTheme.emit();
  }

  onNavItemClick() {
    this.navItemClick.emit();
  }
}
