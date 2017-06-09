package com.kinggowarts.event;

import com.kinggowarts.authentication.UserAuth;
import com.kinggowarts.event.models.Event;
import com.kinggowarts.map.TagRepository;
import com.kinggowarts.member.MemberRepository;
import com.kinggowarts.member.models.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class EventService {
    @Autowired
    private EventRepository eventDao;
    @Autowired
    private MemberRepository memberDao;
    @Autowired
    private TagRepository tagDao;
    @Autowired
    private EventSearchRepository eventSearchDao;

    public List<OnlyCreatorName> findAll(){
        return eventDao.findAllByCustom();
    }

    public String saveEvent(Event event){
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Member member = memberDao.findOne(user.getMemSeq());
        if(member == null){
            return "noMember";
        } else {
            tagDao.save(event.getTags());
            event.setCreator(member);
            eventDao.save(event);
            eventSearchDao.save(event);
            return "success";
        }
    }

    public String deleteEvent(long id){
        Event event = eventDao.findOne(id);
        if(event == null){
            return "noEvent";
        } else {
            tagDao.delete(event.getTags());
            eventDao.delete(event);
            eventSearchDao.delete(event);
            return "success";
        }
    }

    public String editEvent(Event newEvent, long id){
        Event event = eventDao.findOne(id);
        if(event == null){
            return "noEvent";
        } else {
            tagDao.delete(event.getTags());
            newEvent.setId(id);
            UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Member member = memberDao.findOne(user.getMemSeq());
            if (member == null) {
                return "noMember";
            }
            newEvent.setCreator(member);
            tagDao.save(newEvent.getTags());
            eventDao.save(newEvent);
            eventSearchDao.save(newEvent);
            return "success";
        }
    }

    public List<Event> searchEvent(String q){
        List<Event> searchListByName = eventSearchDao.findAllByTitleContainsOrAboutContains(q, q);
        List<Event> searchListByTag = eventSearchDao.findAllByTagsName(q);
        int nameSize = searchListByName.size();
        int tagSize = searchListByTag.size();
        List<Event> eventList = new ArrayList<>();

        for(int i = 0; i < Math.max(nameSize, tagSize); i++){
            if(i < nameSize)
                eventList.add(searchListByName.get(i));
            if(i < tagSize)
                eventList.add(searchListByTag.get(i));
        }

        return eventList;
    }
}
