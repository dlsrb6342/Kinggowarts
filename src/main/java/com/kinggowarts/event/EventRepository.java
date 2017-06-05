package com.kinggowarts.event;


import com.kinggowarts.event.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long>{
}
