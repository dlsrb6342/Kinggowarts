package com.kinggowarts.notice;

import com.kinggowarts.member.FavoriteProjection;
import com.kinggowarts.member.FavoriteRepository;
import com.kinggowarts.notice.models.Notice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class NoticeService {
    @Autowired
    private FavoriteRepository favoriteRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private NoticeRepository noticeRepository;
    @Autowired
    private NoticeSearchRepository noticeSearchRepository;

    NoticeProjection findById(long id) {
        return noticeRepository.findById(id);
    }

    Object findAllByFavorite(Long memSeq) {
        List<FavoriteProjection> favorites = favoriteRepository.findAllByMember_MemberSeq(memSeq);
        HashMap<String, List<NoticeProjection>> hashMap = new HashMap<>();
        for(FavoriteProjection f : favorites){
            List<NoticeProjection> result = new ArrayList<>();
            result.addAll(noticeRepository.findByCategory_IdAndPageIsNull(f.getC_id()));
            result.addAll(noticeRepository.findByPage_IdIn(f.getP_id()));
            result.sort(Comparator.comparing(NoticeProjection::getTime));
            String name = categoryRepository.findOne(f.getC_id()).getDetail();
            hashMap.put(name, result);
        }
        return hashMap;
    }

    Object findByFavorite(Long memSeq){
        List<FavoriteProjection> favorites = favoriteRepository.findAllByMember_MemberSeq(memSeq);
        HashMap<String, List<NoticeProjection>> hashMap = new HashMap<>();
        for(FavoriteProjection f : favorites){
            List<NoticeProjection> result = new ArrayList<>();
            result.addAll(noticeRepository.findTop30ByCategory_IdOrPage_IdIn(f.getC_id(), f.getP_id()));
            result.sort(Comparator.comparing(NoticeProjection::getTime));
            String name = categoryRepository.findOne(f.getC_id()).getDetail();
            hashMap.put(name, result);
        }
        return hashMap;
    }

    List<Notice> searchNotice(String q){
        return noticeSearchRepository.findAllByContentsContainsOrTitleContainsOrderByTimeDesc(q, q);
    }

    List<CategoryProjection> findAllCategory(){
        return categoryRepository.findAllByProjection();
    }
}
