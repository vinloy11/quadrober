package com.shtrokfm.quadrober.meeting;

import com.shtrokfm.quadrober.entity.Meeting;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


import java.time.Instant;
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

  @Query(
    "{ " +
      "'address.point' : { '$near' : { '$geometry': { 'type': 'Point', 'coordinates': [?0, ?1] }, '$maxDistance': ?2 } }"
      + "}"
  )
  List<Meeting> findNearMeetings(
    double pointx,
    double pointy,
    double distance
  );

  @Query("{ '$or': [ { 'owner.id': ?0 }, { 'followers.id': ?0 } ] }")
  List<Meeting> findByUserId(String  id);

  @Query(
    "{ " +
      "'address.point' : { '$geoWithin' : { '$box' : [ " +
      " [ ?0, ?1 ], " + // Нижний левый угол (долгота, широта)
      " [ ?2, ?3 ] " + // Верхний правый угол (долгота, широта)
      " ] } } " +
      "}"
  )
  List<Meeting> findByLocationWithinBounds(
    double lowerLeftLongitude,
    double lowerLeftLatitude,
    double upperRightLongitude,
    double upperRightLatitude
  );

  @Query(
    "{ " +
      "'address.point' : { '$geoWithin' : { '$box' : [ " +
      " [ ?0, ?1 ], " + // Нижний левый угол (долгота, широта)
      " [ ?2, ?3 ] " + // Верхний правый угол (долгота, широта)
      " ] } }, " +
      "'meetingDateTime': { '$gte': ?4, '$lt': ?5 }" + // Убедитесь, что встречи существуют
      "}"
  )
  List<Meeting> findByLocationWithinBoundsAndDateTime(
    double lowerLeftLongitude,
    double lowerLeftLatitude,
    double upperRightLongitude,
    double upperRightLatitude,
    Instant startOfDay,
    Instant endOfDay
  );
}
