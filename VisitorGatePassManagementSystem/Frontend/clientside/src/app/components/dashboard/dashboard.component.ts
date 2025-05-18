import { Component, OnInit } from '@angular/core';
import { VisitorService } from '../../services/visitor.service';
import { Visitor } from '../../models/visitor.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  visitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  searchQuery: string = '';
  checkedInCount: number = 0;
  checkedOutCount: number = 0;
  totalVisitors: number = 0;

  constructor(private visitorService: VisitorService) {}

  ngOnInit(): void {
    this.loadVisitors();
  }
// Update your loadVisitors method:
loadVisitors(): void {
  this.visitorService.getAllVisitors().subscribe({
    next: (response) => {
      // Ensure we're working with an array
      this.visitors = Array.isArray(response) ? response : [];
      this.filteredVisitors = [...this.visitors];
      this.updateStats();
    },
    error: (err) => {
      console.error('Error loading visitors:', err);
      this.visitors = [];
      this.filteredVisitors = [];
    }
  });
}
  updateStats(): void {
    this.checkedInCount = this.visitors.filter(v => v.status === 'checked-in').length;
    this.checkedOutCount = this.visitors.filter(v => v.status === 'checked-out').length;
    this.totalVisitors = this.visitors.length;
  }

  filterVisitors(): void {
    if (!this.searchQuery) {
      this.filteredVisitors = [...this.visitors];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredVisitors = this.visitors.filter(v => 
      v.name.toLowerCase().includes(query) ||
      v.email.toLowerCase().includes(query) ||
      v.contactNumber.toLowerCase().includes(query) ||
      v.purpose.toLowerCase().includes(query)
    );
  }


  openFilters(): void {
    // Implement filter modal/dialog logic
    console.log('Open filter dialog');
  }
}