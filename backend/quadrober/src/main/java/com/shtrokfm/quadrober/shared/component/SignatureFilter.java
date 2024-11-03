package com.shtrokfm.quadrober.shared.component;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@Component
public class SignatureFilter implements Filter {
  @Value("${bot.auth.disabled}")
  private String botAuthDisabled;

  @Value("${bot.token}")
  private String botToken;

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
    throws IOException, ServletException {

    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;

    String path = httpRequest.getRequestURI();

    // Пропускаем запросы к /public
    if (path.startsWith("/public") || this.botAuthDisabled.equals("true")) {
      chain.doFilter(request, response);
      return;
    }

    // Извлекаем данные из заголовка Authorization
    String authorizationHeader = httpRequest.getHeader("Authorization");
    if (authorizationHeader == null || !authorizationHeader.startsWith("twa-init-data ")) {
      httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header");
      return;
    }

    // Извлекаем данные
    String data = authorizationHeader.replace("twa-init-data ", "");

    if (!checkSignature(data, botToken)) {
      httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid signature");
      return;
    }

    // Если подпись валидна, продолжаем выполнение цепочки фильтров
    chain.doFilter(request, response);
  }

  private boolean checkSignature(String data, String botToken) {
    if (data == null || data.isEmpty()) {
      return false;
    }

    try {
      // Декодируем данные
      String encoded = URLDecoder.decode(data, StandardCharsets.UTF_8.name());
      String[] arr = encoded.split("&");
      String hash = null;

      // Находим хэш
      for (String str : arr) {
        if (str.startsWith("hash=")) {
          hash = str.split("=")[1];
          break;
        }
      }

      if (hash == null) {
        return false;
      }

      // Удаляем хэш из массива
      arr = Arrays.stream(arr).filter(str -> !str.startsWith("hash=")).toArray(String[]::new);
      Arrays.sort(arr); // Сортируем массив

      // Формируем строку проверки данных
      String dataCheckString = String.join("\n", arr);

      // Создаем секретный ключ
      String secretKey = createHmacSha256(botToken, "WebAppData");

      // Создаем HMAC-SHA-256 подпись для строки проверки данных
      String computedHash = createHmacSha256(dataCheckString, secretKey);

      // Сравниваем хэши
      return computedHash.equals(hash);
    } catch (Exception e) {
      e.printStackTrace();
      return false;
    }
  }

  private String createHmacSha256(String data, String key) throws Exception {
    javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
    javax.crypto.spec.SecretKeySpec secretKeySpec = new javax.crypto.spec.SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    mac.init(secretKeySpec);
    byte[] hmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

    // Преобразуем в шестнадцатеричное представление
    StringBuilder hexString = new StringBuilder();
    for (byte b : hmac) {
      String hex = Integer.toHexString(0xff & b);
      if (hex.length() == 1) hexString.append('0');
      hexString.append(hex);
    }

    return hexString.toString();
  }
}
