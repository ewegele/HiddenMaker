import { Component, OnInit } from '@angular/core';
import { GraphService } from './services/graph.service';
import { Node, Edge } from './models/graph.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  nodes: Node[] = [];
  edges: Edge[] = [];
  loading = true;
  error: string | null = null;
  showAddNodeModal = false;
  newNodeForm = {
    id: '',
    label: '',
    type: ''
  };
  submitting = false;

  constructor(private graphService: GraphService) {}

  ngOnInit(): void {
    this.loadGraphData();
  }

  loadGraphData(): void {
    this.loading = true;
    this.error = null;

    Promise.all([
      this.graphService.getNodes().toPromise(),
      this.graphService.getEdges().toPromise()
    ]).then(([nodes, edges]) => {
      this.nodes = nodes || [];
      this.edges = edges || [];
      this.loading = false;
    }).catch(err => {
      this.error = 'Failed to load graph data';
      console.error(err);
      this.loading = false;
    });
  }

  openAddNodeModal(): void {
    this.showAddNodeModal = true;
    this.newNodeForm = { id: '', label: '', type: '' };
  }

  closeAddNodeModal(): void {
    this.showAddNodeModal = false;
    this.newNodeForm = { id: '', label: '', type: '' };
  }

  addNode(): void {
    if (!this.newNodeForm.id.trim() || !this.newNodeForm.label.trim() || !this.newNodeForm.type.trim()) {
      this.error = 'All fields are required';
      return;
    }

    this.submitting = true;
    const newNode: Node = {
      id: this.newNodeForm.id,
      label: this.newNodeForm.label,
      type: this.newNodeForm.type
    };

    this.graphService.createNode(newNode).then(() => {
      this.nodes.push(newNode);
      this.closeAddNodeModal();
      this.submitting = false;
      this.error = null;
    }).catch(err => {
      this.error = 'Failed to create node';
      console.error(err);
      this.submitting = false;
    });
  }
}
