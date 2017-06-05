package com.kinggowarts.map;

import com.kinggowarts.map.models.Location;
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
        if (locationDao.findByName(location.getName()) != null) {
            return "duplicatedName";
        } else {
            if (!location.getType().equals("user")){
                return "notAllowed";
            }
            coordinateDao.save(location.getCenter());
            coordinateDao.save(location.getPath());
            tagDao.save(location.getTags());
            locationDao.save(location);
            locationSearchDao.save(location);
            return "success";
        }
    }

    String editLocation(Location newLocation, long id){
        Location location = locationDao.findOne(id);
        if (location == null) {
            return "noLocation";
        } else if(!location.getType().equals("user")) {
            return "notAllowed";
        } else {
            if(locationDao.findByName(newLocation.getName()).getId() != id){
                return "duplicatedName";
            }
            coordinateDao.delete(location.getCenter());
            coordinateDao.delete(location.getPath());
            tagDao.delete(location.getTags());
            newLocation.setId(id);
            coordinateDao.save(newLocation.getCenter());
            coordinateDao.save(newLocation.getPath());
            tagDao.save(newLocation.getTags());
            locationDao.save(newLocation);
            locationSearchDao.save(newLocation);
            return "success";
        }
    }

    String deleteLocation(long id){
        Location location = locationDao.findOne(id);
        if (location == null) {
            return "noLocation";
        } else if(!location.getType().equals("user")) {
            return "notAllowed";
        } else {
            locationDao.delete(location);
            locationSearchDao.delete(location);
            return "success";
        }
    }

    List<Location> searchLocation(String q){
        List<Location> searchListByName = searchName(q);
        List<Location> searchListByTag = locationSearchDao.findAllByTagsName(q);
        int nameSize = searchListByName.size();
        int tagSize = searchListByTag.size();
        List<Location> locationList = new ArrayList<>();

        for(int i = 0; i < Math.max(nameSize, tagSize); i++){
            if(i < nameSize)
                locationList.add(searchListByName.get(i));
            if(i < tagSize)
                locationList.add(searchListByTag.get(i));
        }

        return locationList;
    }

    private List<Location> searchName(String q) {
        if(q.equals("공대")) {
            return locationSearchDao.findAllByNameLike(q);
        } else {
            return locationSearchDao.findAllByNameContains(q);
        }
    }
}
