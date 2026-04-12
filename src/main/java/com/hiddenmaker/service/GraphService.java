package com.hiddenmaker.service;

import com.hiddenmaker.model.Node;
import com.hiddenmaker.model.Edge;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

/**
 * Service to manage nodes and edges
 */
@Service
public class GraphService {

    private List<Node> nodes;
    private List<Edge> edges;

    public GraphService() {
        this.nodes = new ArrayList<>();
        this.edges = new ArrayList<>();
        initializeData();
    }

    // Initialize sample data
    private void initializeData() {
        // Create Node 1
        Node node1 = new Node("gut-guenstig-1", "Buttertoast", "GutUndGuenstig");

        // Create Node 2
        Node node2 = new Node("harry-1", "Butter Toast", "Harry");

        nodes.add(node1);
        nodes.add(node2);

        // Create Edge from Node 1 to Node 2
        Edge edge = new Edge("gut-guenstig-1", "harry-1", "manifactored_from");
        edges.add(edge);
    }

    public List<Node> getAllNodes() {
        return nodes;
    }

    public List<Edge> getAllEdges() {
        return edges;
    }

    public void addNode(Node node) {
        nodes.add(node);
    }

    public void addEdge(Edge edge) {
        edges.add(edge);
    }
}
