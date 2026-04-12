package com.hiddenmaker.model;

/**
 * The connection between two nodes
 */
public class Edge {
    private String source; // ID of the manufacturer
    private String target; // ID of the private label
    private String relation; // Type of connection (e.g. "produced_for")

    // Constructor
    public Edge(String source, String target, String relation) {
        this.source = source;
        this.target = target;
        this.relation = relation;
    }

    // Getters
    public String getSource() {
        return source;
    }

    public String getTarget() {
        return target;
    }

    public String getRelation() {
        return relation;
    }

    // Setters
    public void setSource(String source) {
        this.source = source;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public void setRelation(String relation) {
        this.relation = relation;
    }

    @Override
    public String toString() {
        return "Edge{" +
                "source='" + source + '\'' +
                ", target='" + target + '\'' +
                ", relation='" + relation + '\'' +
                '}';
    }
}
