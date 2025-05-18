export interface Visitor {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  purpose: string;
  checkInTime: Date;
  checkOutTime?: Date;
  status: 'checked-in' | 'checked-out';
}