package br.com.kjf.barbershop.classes;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private UserDetailsService userDetailsService;
	
	protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain chain) throws ServletException, IOException{
		
		String username = null;
		String[] freePaths = {"/auth/login", "/auth/register", "/auth", "/meta/webhook"};
		
		if(request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer ")) {
			
			try {
				username = jwtUtil.extractUsername(request.getHeader("Authorization").substring(7));
			}catch(ExpiredJwtException e) {
				response.setStatus(401);
				response.setContentType("application/json");
				response.getWriter().write("{"
						+ "\"error\": \"token_expired\","
						+ "\"message\": " +e.getMessage()
						+ "}");
			}catch(AuthenticationException e) {
				response.setStatus(401);
				response.setContentType("application/json");
				response.getWriter().write("{"
						+ "\"error\": \"authentication_error\","
						+ "\"message\": " +e.getMessage()
						+ "}");
			}
			
			if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
				
				if(jwtUtil.validateToken(request.getHeader("Authorization").substring(7), userDetails.getUsername())) {
					UsernamePasswordAuthenticationToken upat = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
					upat.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(upat);
				}
				
			}
			
			chain.doFilter(request, response);
			
		} else if(Arrays.asList(freePaths).contains(request.getRequestURI())) {
			
			chain.doFilter(request, response);
			
		}else if(request.getHeader("Authorization") == null){
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			response.setContentType("application/json");
			response.getWriter().write("{"
					+ "\"error\": \"token_not_found\","
					+ "\"message\": \"Your token is expired or not exist!\"" 
					+ "}");
		}else {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			response.setContentType("application/json");
			response.getWriter().write("{"
					+ "\"error\": \"request_not_found\","
					+ "\"message\": \"This endpoint not exist\"" 
					+ "}");
		}
		
	}
	
}
