package com.hiddenmaker.controller;

import com.hiddenmaker.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller to display graph on HTML page
 */
@Controller
public class GraphController {

    @Autowired
    private GraphService graphService;

    @GetMapping("/")
    public String showGraph(Model model) {
        model.addAttribute("nodes", graphService.getAllNodes());
        model.addAttribute("edges", graphService.getAllEdges());
        return "graph";
    }
}
