import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export class Auth {
  access_key :string;
	secret_key :string;
	client_id  :string;
}

interface Items{
  item_title:string;
  unit_price:number;
  quantity  :number;
}

export class Order {
  order_ref : string;
  wallet: string;
  total : number;
  items: Items[];
}

@Injectable({
  providedIn: 'root'
})
export class ShipayService {

  constructor(private http: HttpClient) { }

  private endpoint = "https://api-staging.shipay.com.br/"

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  auth(body: Auth): Observable<any> {
    let httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<Auth>(this.endpoint + 'pdvauth', JSON.stringify(body), httpHeader)
      .pipe(
        catchError(this.handleError<Auth>('Authentication Shipay'))
      );
  }

  order(order: Order, token:string): Observable<any>{
    let httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
                                  'Authorization': 'Bearer '+ token })
    };

    return this.http.post<Order>(this.endpoint + 'order', JSON.stringify(order), httpHeader)
      .pipe(
        catchError(this.handleError<Order>('Order Shipay'))
      )
  }

  status(order_id:string, token:string): Observable<any>{
    let httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
                                  'Authorization': 'Bearer '+ token })
    };

    return this.http.get<any>(this.endpoint + 'order/' + order_id, httpHeader)
      .pipe(
        catchError(this.handleError<Order>('Status Shipay'))
      )
  }

  cancel_order(order_id:string, token:string): Observable<any>{
    let httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
                                  'Authorization': 'Bearer '+ token })
    };

    return this.http.delete(this.endpoint + 'order/' + order_id, httpHeader)
      .pipe(
        catchError(this.handleError<Order>('Cancelamento Shipay'))
      )
  }
}
