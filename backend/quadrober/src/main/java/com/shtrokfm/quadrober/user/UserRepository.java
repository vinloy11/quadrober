package com.shtrokfm.quadrober.user;

import com.shtrokfm.quadrober.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> { }
