package com.shtrokfm.quadrober.user;

import com.shtrokfm.quadrober.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @PostMapping
  public User createUser(@RequestBody User user, @RequestAttribute("telegramId") String telegramId) {
    return this.userService.save(user, telegramId);
  }

  @GetMapping
  public User getUser(@RequestAttribute("telegramId") String telegramId) {
    return this.userService.findByTelegramId(telegramId);
  }

  @GetMapping("/{userId}")
  public User getUserById(@PathVariable String userId) {
    return this.userService.findByUserId(userId);
  }

  @DeleteMapping
  public boolean deleteUser(@RequestAttribute("telegramId") String telegramId) {
    return this.userService.delete(telegramId);
  }

  @PutMapping
  public User updateUser(@RequestBody User user, @RequestAttribute("telegramId") String telegramId) {
    return this.userService.update(user, telegramId);
  }
}
