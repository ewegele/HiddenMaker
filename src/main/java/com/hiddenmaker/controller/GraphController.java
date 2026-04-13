package com.hiddenmaker.controller;

import com.hiddenmaker.model.Edge;
import com.hiddenmaker.model.Node;
import com.hiddenmaker.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

/**
 * Controller to display graph on HTML page
 */
@Controller
public class GraphController {

    @Autowired
    private GraphService graphService;

    @GetMapping("/")
    public String showGraph(Model model) {
        return "forward:index.html";
    }
}

/**
 * REST API Controller for graph data
 */
@RestController
@RequestMapping("/api")
class GraphApiController {

    @Autowired
    private GraphService graphService;

    @GetMapping("/nodes")
    public List<Node> getAllNodes() {
        return graphService.getAllNodes();
    }

    @GetMapping("/edges")
    public List<Edge> getAllEdges() {
        return graphService.getAllEdges();
    }

    @PostMapping("/nodes")
    public ResponseEntity<Node> createNode(@RequestBody Node node) {
        try {
            graphService.addNode(node);
            return ResponseEntity.status(HttpStatus.CREATED).body(node);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
