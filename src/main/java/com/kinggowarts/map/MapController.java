package com.kinggowarts.map;

import com.kinggowarts.map.models.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/map")
public class MapController {

    @Autowired
    private MapService mapService;

    @GetMapping("")
    public List<Location> findAllCoordinate(@RequestParam("type") String type) {
        return mapService.findAllCoordinate(type);
    }

    @PostMapping("")
    public String saveLocation(@RequestBody Location location) {
        return mapService.saveLocation(location);
    }

    @GetMapping("/search")
    public List<Location> searchLocation(@RequestParam String q) {
        return mapService.searchLocation(q);
    }

    @DeleteMapping("/{id}")
    public String deleteLocation(@PathVariable("id") long id) {
        return mapService.deleteLocation(id);
    }

    @PutMapping("/{id}")
    public String editLocation(@PathVariable("id") long id,
                               @RequestBody Location location) {
        return mapService.editLocation(location, id);
    }
}