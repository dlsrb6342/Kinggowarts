package com.kinggowarts.map;

import com.kinggowarts.map.models.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value="/api/map")
public class MapController {

    @Autowired
    private MapService mapService;

    @RequestMapping(value="", method=RequestMethod.GET)
    public List<HashMap<String, Object>> findAllCoordinate(){
        return mapService.findAllCoordinate();
    }

    @RequestMapping(value="/{type}", method=RequestMethod.GET)
    public List<Location> findByType(@PathVariable("type") String type){
        return mapService.findAllLocationByType(type);
    }
}
