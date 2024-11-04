package com.shtrokfm.quadrober.user;

import com.shtrokfm.quadrober.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;

  public User save(User user, String telegramId) {
    if (telegramId.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    User matchedUser = this.userRepository.findByTelegramId(telegramId);

    if (matchedUser != null) {
      throw new ResponseStatusException(HttpStatus.CONFLICT);
    }

    return this.userRepository.save(user);
  }

  public boolean delete(String telegramId) {
    User matchedUser = this.userRepository.findByTelegramId(telegramId);

    if (matchedUser == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    this.userRepository.deleteUserByTelegramId(telegramId);

    return true;
  }

  public User update(User user, String telegramId) {
    User matchedUser = this.userRepository.findByTelegramId(telegramId);

    if (matchedUser == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    if (!Objects.equals(user.getId(), matchedUser.getId())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT);
    }

    return this.userRepository.save(user);
  }

  public User findByTelegramId(String telegramId) {
    User matchedUser = this.userRepository.findByTelegramId(telegramId);

    if (matchedUser == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    return matchedUser;
  }
}
