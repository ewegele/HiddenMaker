import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Node, Edge } from '../models/graph.model';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getNodes(): Observable<Node[]> {
    return this.http.get<Node[]>(`${this.apiUrl}/nodes`);
  }

  getEdges(): Observable<Edge[]> {
    return this.http.get<Edge[]>(`${this.apiUrl}/edges`);
  }

  createNode(node: Node): Promise<any> {
    return this.http.post(`${this.apiUrl}/nodes`, node).toPromise();
  }
}
