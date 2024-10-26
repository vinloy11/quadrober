package com.shtrokfm.quadrober.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
  private final UserRepository userRepository;

  @GetMapping
  public Boolean users() {
//    this.userRepository.deleteAll();
//    this.userRepository.save(new User("Andrew1"));
    return true;
  }
}
