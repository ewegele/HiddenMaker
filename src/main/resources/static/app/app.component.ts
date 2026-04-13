import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { GraphService } from './services/graph.service';
import { Node, Edge } from './models/graph.model';
import * as d3 from 'd3';

interface D3Node extends Node {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  index?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('graph', { static: false }) graphContainer!: ElementRef;

  nodes: D3Node[] = [];
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
  
  selectedNode: D3Node | null = null;
  showSidebar = false;
  
  private simulation: d3.Simulation<D3Node, any> | null = null;
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | null = null;
  private link: d3.Selection<SVGLineElement, Edge, SVGGElement, unknown> | null = null;
  private node: d3.Selection<SVGCircleElement, D3Node, SVGGElement, unknown> | null = null;
  private labels: d3.Selection<SVGTextElement, D3Node, SVGGElement, unknown> | null = null;

  constructor(
    private graphService: GraphService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadGraphData();
  }

  ngAfterViewInit(): void {
    if (!this.loading) {
      setTimeout(() => this.initializeGraph(), 100);
    }
  }

  loadGraphData(): void {
    this.loading = true;
    this.error = null;

    Promise.all([
      this.graphService.getNodes().toPromise().catch((err: any) => { console.error('Nodes API error:', err); return []; }),
      this.graphService.getEdges().toPromise().catch((err: any) => { console.error('Edges API error:', err); return []; })
    ]).then(([nodes, edges]: any[]) => {
      this.nodes = nodes || [];
      this.edges = edges || [];
      this.loading = false;
      this.cdr.markForCheck();
      
      if (this.nodes.length === 0 && this.edges.length === 0) {
        this.error = 'No data available - API may not be responding';
      }
      
      setTimeout(() => this.initializeGraph(), 100);
    }).catch(err => {
      this.error = 'Failed to load graph data: ' + (err?.message || 'Unknown error');
      console.error('Graph data error:', err);
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  initializeGraph(): void {
    if (!this.graphContainer || this.nodes.length === 0) {
      return;
    }

    const container = this.graphContainer.nativeElement;
    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 600;

    d3.select('#graph-svg').remove();

    this.svg = d3.select(container)
      .append('svg')
      .attr('id', 'graph-svg')
      .attr('width', width)
      .attr('height', height) as any;

    const g = this.svg!.append('g');

    // Add arrow markers for directed edges
    this.svg!.append('defs').selectAll('marker')
      .data(['end'])
      .join('marker')
      .attr('id', (d: any) => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('class', 'arrow-marker');

    // Create force simulation
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', (d3.forceLink as any)(this.edges)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(35));

    // Zoom functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .on('zoom', (event: any) => {
        g.attr('transform', event.transform);
      });

    this.svg!.call(zoom);

    // Draw links
    const linkSelection = g.selectAll('.link')
      .data(this.edges) as any;
    this.link = linkSelection
      .join('line')
      .attr('class', 'link')
      .attr('marker-end', 'url(#arrow-end)') as any;

    // Draw nodes
    const nodeSelection = g.selectAll('.node')
      .data(this.nodes) as any;
    this.node = nodeSelection
      .join('circle')
      .attr('class', 'node')
      .attr('r', 25)
      .attr('fill', (d: any) => this.getNodeColor(d.type))
      .call(this.drag(this.simulation as any) as any)
      .on('click', (e: any, d: any) => this.selectNode(d, e)) as any;

    // Draw labels
    const labelSelection = g.selectAll('.label')
      .data(this.nodes) as any;
    this.labels = labelSelection
      .join('text')
      .attr('class', 'label')
      .text((d: any) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('pointer-events', 'none') as any;

    // Update positions
    this.simulation!.on('tick', () => {
      if (this.link) {
        this.link
          .attr('x1', (d: any) => d.source.x || 0)
          .attr('y1', (d: any) => d.source.y || 0)
          .attr('x2', (d: any) => d.target.x || 0)
          .attr('y2', (d: any) => d.target.y || 0);
      }

      if (this.node) {
        this.node
          .attr('cx', (d: any) => d.x || 0)
          .attr('cy', (d: any) => d.y || 0);
      }

      if (this.labels) {
        this.labels
          .attr('x', (d: any) => d.x || 0)
          .attr('y', (d: any) => d.y || 0);
      }
    });
  }

  private drag(simulation: d3.Simulation<D3Node, any>) {
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  private getNodeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'manufacturer': '#FF6B6B',
      'supplier': '#4ECDC4',
      'distributor': '#45B7D1',
      'warehouse': '#FFA502',
      'producer': '#95E1D3',
      'consumer': '#C7CEEA',
    };
    return colors[type.toLowerCase()] || '#95E1D3';
  }

  selectNode(node: D3Node, event: any): void {
    event.stopPropagation();
    this.selectedNode = node;
    this.showSidebar = true;
    this.cdr.markForCheck();

    // Highlight selected node
    if (this.node) {
      this.node.classed('selected', (d: any) => d.id === node.id);
    }
  }

  closeSidebar(): void {
    this.showSidebar = false;
    this.selectedNode = null;
    if (this.node) {
      this.node.classed('selected', false);
    }
    this.cdr.markForCheck();
  }

  openAddNodeModal(): void {
    this.showAddNodeModal = true;
    this.newNodeForm = { id: '', label: '', type: '' };
    this.cdr.markForCheck();
  }

  closeAddNodeModal(): void {
    this.showAddNodeModal = false;
    this.newNodeForm = { id: '', label: '', type: '' };
    this.cdr.markForCheck();
  }

  addNode(): void {
    if (!this.newNodeForm.id.trim() || !this.newNodeForm.label.trim() || !this.newNodeForm.type.trim()) {
      this.error = 'All fields are required';
      this.cdr.markForCheck();
      return;
    }

    this.submitting = true;
    const newNode: D3Node = {
      id: this.newNodeForm.id,
      label: this.newNodeForm.label,
      type: this.newNodeForm.type
    };

    this.graphService.createNode(newNode).then(() => {
      this.nodes.push(newNode);
      this.closeAddNodeModal();
      this.submitting = false;
      this.error = null;
      this.cdr.markForCheck();
      setTimeout(() => this.initializeGraph(), 100);
    }).catch(err => {
      this.error = 'Failed to create node';
      console.error(err);
      this.submitting = false;
      this.cdr.markForCheck();
    });
  }

  onNodeIdChange(event: any): void {
    this.newNodeForm.id = event.target.value;
  }

  onNodeLabelChange(event: any): void {
    this.newNodeForm.label = event.target.value;
  }

  onNodeTypeChange(event: any): void {
    this.newNodeForm.type = event.target.value;
  }

  hasConnections(nodeId: string): boolean {
    return this.edges.some((e: Edge) => e.source === nodeId || e.target === nodeId);
  }
}
