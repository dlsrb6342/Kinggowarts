package com.kinggowarts.marker;

import com.kinggowarts.marker.models.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.GET;
import java.util.List;

@RestController @RequestMapping("/api/marker")
public class MarkerController {
    @Autowired
    private MarkerService markerService;

    @GetMapping("")
    public List<Marker> findAllByType(@RequestParam String q, @RequestParam String type){
        return markerService.findAllByCategory(q, type);
    }

    @PostMapping("")
    public String saveMarker(@RequestBody Marker marker){
        return markerService.saveMarker(marker);
    }

    @PutMapping("/{id}")
    public String editMarker(@PathVariable long id, @RequestBody Marker marker){
        return markerService.editMarker(marker, id);
    }

    @DeleteMapping("/{id}")
    public String deleteMarker(@PathVariable long id){
        return markerService.deleteMarker(id);
    }

    @GetMapping("/search")
    public List<Marker> searchMarker(@RequestParam String q) {
        return markerService.searchMarker(q);
    }
}
