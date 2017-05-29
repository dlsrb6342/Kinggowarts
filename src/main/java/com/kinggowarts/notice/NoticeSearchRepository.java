package com.kinggowarts.notice;


import com.kinggowarts.notice.models.Notice;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface NoticeSearchRepository extends ElasticsearchRepository<Notice, Long>{
    List<Notice> findAllByContentsContainsOrTitleContains(String q);
}
