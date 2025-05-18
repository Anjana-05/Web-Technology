import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visitor } from '../models/visitor.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private apiUrl = 'http://localhost:3000/api/visitors';

  constructor(private http: HttpClient) { }

    getAllVisitors(): Observable<Visitor[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(visitors =>
        visitors.map(visitor => ({
          ...visitor,
          id: visitor._id  
        }))
      )
    );
  }


  createVisitor(visitorData: Omit<Visitor, 'id'>): Observable<Visitor> {
    return this.http.post<Visitor>(`${this.apiUrl}`, visitorData);
  }

  checkInVisitor(visitorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkIn`, visitorData);
  }

  searchVisitor(visitorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?q=${visitorId}`);
  }

  checkoutVisitor(visitorId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, { visitorId });
  }
  deleteVisitor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
