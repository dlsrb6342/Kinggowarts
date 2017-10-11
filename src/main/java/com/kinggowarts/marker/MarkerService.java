package com.kinggowarts.marker;

import com.kinggowarts.marker.models.Marker;
import com.kinggowarts.marker.models.MarkerCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
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
    @Autowired
    private TagRepository tagDao;

    List<Marker> findAllByCategory(String q, String type){
        if(markerCategoryDao.findByName(q) == null){
            return null;
        }
        return markerDao.findAllByMarkerCategory_NameAndMarkerCategory_Type(q, type);
    }

    List<Marker> searchMarker(String q){
        List<Marker> searchListByName = searchMarkerByName(q);
        List<Marker> searchListByTag = markerSearchDao.findAllByTagsName(q);
        int nameSize = searchListByName.size();
        int tagSize = searchListByTag.size();
        List<Marker> markerList = new ArrayList<>();

        for(int i = 0; i < Math.max(nameSize, tagSize); i++){
            if(i < nameSize)
                markerList.add(searchListByName.get(i));
            if(i < tagSize)
                markerList.add(searchListByTag.get(i));
        }

        return markerList;
    }

    private List<Marker> searchMarkerByName(String q){
        if(q.equals("공대")) {
            return markerSearchDao.findAllByNameLike(q);
        } else {
            return markerSearchDao.findAllByNameContains(q);
        }
    }

    @Transactional
    String saveMarker(Marker marker) {
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
            coordinateDao.save(marker.getCenter());
            coordinateDao.save(marker.getPath());
            tagDao.save(marker.getTags());
            markerDao.save(marker);
            markerSearchDao.save(marker);
            return "success";
        }
    }

    @Transactional
    String editMarker(Marker newMarker, long id) {
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
            coordinateDao.delete(marker.getPath());
            tagDao.delete(marker.getTags());
            newMarker.setId(id);
            newMarker.setMarkerCategory(markerCategory);
            coordinateDao.save(newMarker.getCenter());
            coordinateDao.save(newMarker.getPath());
            tagDao.save(newMarker.getTags());
            markerDao.save(newMarker);
            markerSearchDao.save(newMarker);
            return "success";
        }
    }

    String deleteMarker(long id) {
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
