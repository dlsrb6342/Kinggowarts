package com.kinggowarts.marker;

import com.kinggowarts.map.CoordinateRepository;
import com.kinggowarts.map.models.Coordinate;
import com.kinggowarts.marker.models.Marker;
import com.kinggowarts.marker.models.MarkerCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class MarkerService {
    @Autowired
    private MarkerRepository markerDao;
    @Autowired
    private MarkerSearchRepository markerSearchDao;
    @Autowired
    private MarkerCategoryRepository markerCategoryDao;
    @Autowired
    private CoordinateRepository coordinateDao;

    public List<Marker> findAllByCategory(String q){
        if(markerCategoryDao.findByName(q) == null){
            return null;
        }
        return markerDao.findAllByMarkerCategory_Name(q);
    }

    public List<Marker> searchMarker(String q){
        return markerSearchDao.findAllByNameContains(q);
    }

    @Transactional
    public String saveMarker(Marker marker) {
        MarkerCategory markerCategory = markerCategoryDao.findByName(marker.getMarkerCategory().getName());
        if(markerDao.findByName(marker.getName()) != null){
            return "duplicatedName";
        } else if(markerCategory == null) {
            return "noCategory";
        } else {
            if(!marker.getType().equals("user")){
                return "notAllowed";
            }
            marker.setMarkerCategory(markerCategory);
            Coordinate center = marker.getCenter();
            coordinateDao.save(center);
            markerDao.save(marker);
            markerSearchDao.save(marker);
            return "success";
        }
    }

    @Transactional
    public String editMarker(Marker newMarker, long id) {
        Marker marker = markerDao.findOne(id);
        MarkerCategory markerCategory = markerCategoryDao.findByName(newMarker.getMarkerCategory().getName());
        if (marker == null) {
            return "noMarker";
        } else if(markerCategory == null) {
            return "noCategory";
        } else if (markerDao.findByName(newMarker.getName()).getId() != id) {
            return "duplicatedName";
        } else {
            if (!newMarker.getType().equals("user")){
                return "notAllowed";
            }
            coordinateDao.delete(marker.getCenter());
            newMarker.setId(id);
            newMarker.setMarkerCategory(markerCategory);
            coordinateDao.save(newMarker.getCenter());
            markerDao.save(newMarker);
            markerSearchDao.save(newMarker);
            return "success";
        }
    }

    public String deleteMarker(long id) {
        Marker marker = markerDao.findOne(id);
        if(marker == null){
            return "noMarker";
        } else {
            markerDao.delete(marker);
            markerSearchDao.delete(marker);
            return "success";
        }
    }
}
