package br.com.kjf.barbershop;

import org.apache.catalina.filters.CorsFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import br.com.kjf.barbershop.classes.JwtAuthenticationFilter;
import br.com.kjf.barbershop.classes.UserDetailsServiceUtils;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final UserDetailsServiceUtils userDetailsServiceUtils;

	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, UserDetailsServiceUtils userDetailsServiceUtils) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.userDetailsServiceUtils = userDetailsServiceUtils;
	}
	
    @Bean
    PasswordEncoder passwordEncoder(){
		return new BCryptPasswordEncoder();
	}

    @SuppressWarnings("removal")
    @Bean
    AuthenticationManager authenticationManager(HttpSecurity httpSec, PasswordEncoder passEncoder, UserDetailsService userDetailsService) throws Exception {
		return httpSec.getSharedObject(AuthenticationManagerBuilder.class)
				.userDetailsService(userDetailsService)
				.passwordEncoder(passEncoder)
				.and()
				.build();
	}

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSec) throws Exception{
        httpSec.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/auth/**", "/meta/**").permitAll()
                                .requestMatchers("/book/all", "/book/admin").hasRole("ADMIN")
                                .anyRequest().authenticated()
                )
                .sessionManagement(sessionManagement ->
                        sessionManagement
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                ).cors(cors -> cors.configurationSource(null));
		
		httpSec.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		
		return httpSec.build();
	}
    
//    public WebSecurityCustomizer webSecurityCustomizer() {
//    	return web -> web.ignoring().requestMatchers("/auth/**");
//    }
	
}
