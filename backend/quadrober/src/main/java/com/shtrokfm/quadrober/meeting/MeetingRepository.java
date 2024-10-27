package com.shtrokfm.quadrober.meeting;

import com.shtrokfm.quadrober.entity.Meeting;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


import java.time.Instant;
import java.util.Date;
import java.util.List;

// {
//    'address.point' : {
//        '$near' : { '$geometry': { 'type': 'Point', 'coordinates': [?0, ?1] }, '$maxDistance': ?2 }
//     },
//     'meetingDateTime': { '$gte': ?3, '$lt': ?4 }
// }
// }
public interface MeetingRepository extends MongoRepository<Meeting, String> {
  @Query(
    "{ " +
      "'address.point' : { '$near' : { '$geometry': { 'type': 'Point', 'coordinates': [?0, ?1] }, '$maxDistance': ?2 } },"
      + "'meetingDateTime': { '$gte': ?3, '$lt': ?4 }"
      + "}"
  )
  List<Meeting> findByLocationNearInCurrentDay(
    double pointx,
    double pointy,
    double distance,
    Instant startOfDay,
    Instant endOfDay
  );
}
