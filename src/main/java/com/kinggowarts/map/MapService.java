package com.kinggowarts.map;

import com.kinggowarts.map.models.Location;
import com.kinggowarts.map.models.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;


@Service
public class MapService {
    @Autowired
    private LocationRepository locationDao;
    @Autowired
    private LocationSearchRepository locationSearchDao;
    @Autowired
    private CoordinateRepository coordinateDao;
    @Autowired
    private TagRepository tagDao;


    List<Location> findAllCoordinate(String type) {
        List<Location> locationList = locationDao.findAllByType(type);
        return locationList;
    }

    @Transactional
    String saveLocation(Location location) {
        System.out.println(location);
        if (locationDao.findFirstByName(location.getName()) != null) {
            return "duplicatedName";
        } else {
            coordinateDao.save(location.getCenter());
            coordinateDao.save(location.getPath());
            tagDao.save(location.getTags());
            locationDao.save(location);
            locationSearchDao.save(location);
            return "success";
        }
    }

    List<Location> searchLocation(String q) {
        return locationSearchDao.findAllByNameContains(q);
    }
}
