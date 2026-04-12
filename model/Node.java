package model;

/**
 * A simple node in the system
 */
public class Node {
    private String id;       // Unique ID (e.g. "mueller-001")
    private String label;    // Display name (e.g. "Müller Dairy")
    private String type;     // Type (e.g. "MANUFACTURER" or "PRIVATE_LABEL")

    // Constructor
    public Node(String id, String label, String type) {
        this.id = id;
        this.label = label;
        this.type = type;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public String getType() {
        return type;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Node{" +
                "id='" + id + '\'' +
                ", label='" + label + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
