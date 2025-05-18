import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitorService } from '../../services/visitor.service';
import { Visitor } from '../../models/visitor.model';

@Component({
  selector: 'app-visitor-checkin',
  standalone: false,
  templateUrl: './visitor-checkin.component.html',
  styleUrls: ['./visitor-checkin.component.css']
})
export class VisitorCheckinComponent implements OnInit {
  checkInForm!: FormGroup;
  submitted = false;
  isSubmitting = false;
  isSuccess = false;
  errorMessage: string | null = null;
  checkInTime = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private visitorService: VisitorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  get f() { return this.checkInForm.controls; }

  initializeForm(): void {
    this.checkInForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      purpose: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.checkInForm.invalid) return;

    this.isSubmitting = true;

    const visitorData: Omit<Visitor, 'id' | 'checkOutTime'> = {
      name: this.checkInForm.value.name,
      email: this.checkInForm.value.email,
      contactNumber: this.checkInForm.value.contactNumber,
      purpose: this.checkInForm.value.purpose,
      checkInTime: this.checkInTime,
      status: 'checked-in'
    };

    this.visitorService.checkInVisitor(visitorData).subscribe({
      next: () => {
        this.isSuccess = true;
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to check in visitor. Please try again.';
        console.error('Error checking in visitor:', err);
      }
    });
  }

  dismissAlert(): void {
    this.isSuccess = false;
    this.errorMessage = null;
  }

  printPass() {
    window.print();
  }
}
