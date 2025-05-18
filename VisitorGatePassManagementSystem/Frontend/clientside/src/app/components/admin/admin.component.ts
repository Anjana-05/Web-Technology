import { Component, OnInit } from '@angular/core';
import { VisitorService } from '../../services/visitor.service';
import { Visitor } from '../../models/visitor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
 visitors: Visitor[] = [];
   filteredVisitors: Visitor[] = [];
   searchQuery: string = '';
   checkedInCount: number = 0;
   checkedOutCount: number = 0;
   totalVisitors: number = 0;
 
   constructor(
    private visitorService: VisitorService,
   ) {}
 
    ngOnInit(): void {
    this.loadVisitors();
  }

 // Update your loadVisitors method:
 loadVisitors(): void {
   this.visitorService.getAllVisitors().subscribe({
     next: (response) => {
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
    deleteVisitor(id: string): void {
      if (confirm('Are you sure you want to delete this visitor?')) {
        console.log('Deleting visitor with ID:', id); // Debug print
        this.visitorService.deleteVisitor(id).subscribe({
          next: () => {
            console.log('Visitor deleted');
            this.loadVisitors();
          },
          error: (error) => {
            console.error('Delete error:', error);
          }
        });
      }
    }
}

