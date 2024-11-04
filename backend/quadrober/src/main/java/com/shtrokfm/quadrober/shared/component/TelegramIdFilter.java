package com.shtrokfm.quadrober.shared.component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class TelegramIdFilter implements Filter, Ordered {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
    throws IOException, ServletException {
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    String authorization = httpRequest.getHeader("authorization");

    if (authorization != null) {
      String userId = extractUserIdFromAuthorization(authorization);
      // Сохраняем userId в атрибутах запроса
      httpRequest.setAttribute("telegramId", userId);
    }

    chain.doFilter(request, response);
  }

  private String extractUserIdFromAuthorization(String authorization) throws JsonProcessingException {
    // Логика извлечения user id из authorization
    String[] parts = authorization.split("&");
    for (String part : parts) {
      if (part.startsWith("user=")) {
        try {
          String userJson = part.substring(5);
          String decodedJson = java.net.URLDecoder.decode(userJson, StandardCharsets.UTF_8);
          ObjectMapper objectMapper = new ObjectMapper();
          JsonNode userObject = objectMapper.readTree(decodedJson);
          return userObject.get("id").asText();
        } catch (JsonProcessingException e) {
          return null;
        }
      }
    }
    return null;
  }

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
    // Инициализация фильтра, если необходимо
  }

  @Override
  public void destroy() {
    // Освобождение ресурсов, если необходимо
  }

  @Override
  public int getOrder() {
    return 1; // Установите порядок выполнения (меньше - раньше)
  }
}