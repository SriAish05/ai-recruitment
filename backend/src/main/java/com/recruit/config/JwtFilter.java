package com.recruit.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Read the Authorization header
        String authHeader = request.getHeader("Authorization");

        // 2. No Bearer token — pass through, Spring handles 401
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Strip "Bearer " prefix, extract username
        String token = authHeader.substring(7);
        log.debug("Token received: {}", token.substring(0, Math.min(20, token.length())));
        String username;
        try {
            username = jwtUtil.extractUsername(token);
            log.debug("Username extracted: {}", username);
        } catch (Exception e) {
            log.error("JWT parsing failed", e);
            filterChain.doFilter(request, response);
            return;
        }

        // 4. Valid token + no existing auth = authenticate this request
        if (username != null &&
            SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token, username)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        username, null, List.of()
                    );
                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                // 5. Tell Spring Security this request is authenticated
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                log.debug("validateToken returned false for username: {}", username);
            }
        }

        filterChain.doFilter(request, response);
    }
}
