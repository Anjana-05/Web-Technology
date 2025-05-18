import { Component, OnInit } from '@angular/core';
import { VisitorService } from '../../services/visitor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Visitor } from '../../models/visitor.model';

@Component({
  selector: 'app-visitor-checkout',
  standalone: false,
  templateUrl: './visitor-checkout.component.html',
  styleUrls: ['./visitor-checkout.component.css']
})
export class VisitorCheckoutComponent implements OnInit {
  searchId: string = '';
  visitor: any = null;

  constructor(private visitorService: VisitorService) {}

  ngOnInit(): void {
    console.log('VisitorCheckoutComponent initialized');
  }

  searchVisitor(): void {
    if (!this.searchId.trim()) {
      alert('Enter a Visitor ID');
      return;
    }

    this.visitorService.searchVisitor(this.searchId).subscribe({
      next: (data) => this.visitor = data,
      error: (err) => {
        console.error(err);
        alert('Visitor not found');
        this.visitor = null;
      }
    });
  }

  checkout(): void {
    if (!this.visitor) return;

    this.visitorService.checkoutVisitor(this.visitor._id).subscribe({
      next: (res) => alert(res.message),
      error: (err) => {
        console.error(err);
        alert(err.error.message || 'Checkout failed');
      }
    });
  }
}