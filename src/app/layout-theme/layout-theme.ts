import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, signal, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../components/sidebar/sidebar';

@Component({
  selector: 'app-layout-theme',
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    Sidebar,
  ],
  standalone: true,
  templateUrl: './layout-theme.html',
  styleUrl: './layout-theme.scss',
})
export class LayoutTheme {
  private breakpointObserver = inject(BreakpointObserver);

  isCollapsed = signal(false);
  isDarkMode = signal(false);

  isHandset = computed(() => this.breakpointObserver.isMatched(Breakpoints.Handset));

  constructor() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.isDarkMode.set(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  toggleCollapse() {
    this.isCollapsed.update((collapsed) => !collapsed);
  }

  toggleTheme() {
    const newTheme = !this.isDarkMode();
    this.isDarkMode.set(newTheme);

    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  getPageTitle(): string {
    const url = window.location.pathname;
    switch (url) {
      case '/tasks':
        return 'Tasks';
      case '/users':
        return 'Users';
      case '/settings':
        return 'Settings';
      default:
        return 'Form Task Details';
    }
  }

  closeMobileMenu(drawer: any) {
    if (this.isHandset()) {
      drawer.close();
    }
  }
}
