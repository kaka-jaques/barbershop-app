package br.com.kjf.barbershop.classes;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
		
		System.out.println(request.getRequestURI());
		
		if(request.getRequestURI().startsWith("/auth/")) {
			chain.doFilter(request, response);
			return;
		}
		
		if(request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer ")) {
			
			try {
				username = jwtUtil.extractUsername(request.getHeader("Authorization").substring(7));
			}catch(ExpiredJwtException e) {
				e.printStackTrace();
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
			
		}
		
	}
	
}
