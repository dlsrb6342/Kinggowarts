package com.kinggowarts.map;

import com.kinggowarts.map.models.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class MapService {
    @Autowired
    private LocationRepository locationDao;
    @Autowired
    private CoordinateRepository coordinateDao;

    List<Location> findAllLocationByType(String type){
        return locationDao.findAllByType(type);
    }

    List<HashMap<String, Object>> findAllCoordinate(){
        List<Location> locationList = locationDao.findAll();
        List<Object[]> coordinateList = coordinateDao.findAllByOrderByLocationIdAsc();
        List<HashMap<String, Object>> result = new ArrayList<>();
        for (Location location: locationList) {
            if(location.getId() == 0)
                continue;
            HashMap<String, Object> hashMap = new HashMap<>();
            HashMap<String, Double> center = new HashMap<>();
            center.put("lng", location.getCenter_lng());
            center.put("lat", location.getCenter_lat());
            hashMap.put("name", location.getName());
            hashMap.put("center", center);
            List<HashMap<String, Object>> coorList = new ArrayList<>();
            for (Object[] coordinate: coordinateList){
                BigInteger l_id = (BigInteger)coordinate[0];
                if(l_id.longValue() == location.getId()) {
                    HashMap<String, Object> coor = new HashMap<>();
                    coor.put("lat", coordinate[1]);
                    coor.put("lng", coordinate[2]);
                    coorList.add(coor);
                }
            }
            hashMap.put("path", coorList);
            result.add(hashMap);
        }
        return result;
    }

}
