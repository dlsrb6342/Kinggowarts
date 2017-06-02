package com.kinggowarts.map;

import com.kinggowarts.map.models.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping(value="/api/map")
public class MapController {

    @Autowired
    private MapService mapService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<Location> findAllCoordinate(@RequestParam("type") String type) {
        return mapService.findAllCoordinate(type);
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String saveLocation(@ModelAttribute("location") Location location) {
        return mapService.saveLocation(location);
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public List<Location> searchLocation(@RequestParam("q") String q) {
        return mapService.searchLocation(q);
    }
}