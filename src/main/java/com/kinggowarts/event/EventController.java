package com.kinggowarts.event;

import com.kinggowarts.event.models.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController @RequestMapping("/api/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("")
    public List<OnlyCreatorName> findAllEvent(){
        return eventService.findAll();
    }

    @PostMapping("")
    public String saveEvent(@RequestBody Event event){
        return eventService.saveEvent(event);
    }

    @DeleteMapping("/{id}")
    public String deleteEvent(@PathVariable("id") long id){
        return eventService.deleteEvent(id);
    }

    @PutMapping("/{id}")
    public String editEvent(@PathVariable("id") long id,
                            @RequestBody Event event){
        return eventService.editEvent(event, id);
    }

    @GetMapping("/search")
    public List<Event> searchEvent(@RequestParam("q") String q){
        return eventService.searchEvent(q);
    }
}
