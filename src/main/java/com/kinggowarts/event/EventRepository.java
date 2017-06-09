package com.kinggowarts.event;


import com.kinggowarts.event.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long>{
    @Query("select e from Event e")
    List<OnlyCreatorName> findAllByCustom();
}
