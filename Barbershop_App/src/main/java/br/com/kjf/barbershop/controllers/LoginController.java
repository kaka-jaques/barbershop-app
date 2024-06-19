package br.com.kjf.barbershop.controllers;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.kjf.barbershop.classes.JwtUtil;
import br.com.kjf.barbershop.repository.RoleRepository;
import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.RoleVO;
import br.com.kjf.barbershop.vo.UserVO;
import jakarta.servlet.http.Cookie;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class LoginController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private RoleRepository roleRepository;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UserDetailsService userDetailsService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	private ObjectMapper objMapper = new ObjectMapper();
	
	@PostMapping("/login")
	public ResponseEntity<?> websiteLogin(@RequestBody UserVO user, @RequestHeader("keep")boolean keep) throws JsonMappingException, JsonProcessingException, UsernameNotFoundException{
		
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(user.getUser(), user.getPassword())
			);
		}catch(AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new String("Unauthorized! Username or Password incorrect!"));
		}
		
		final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUser());
		
		return ResponseEntity.ok(
				objMapper.readTree("{"
						+ "\"status\": \"Sucessful Logged!\","
						+ "\"token\": \""+ jwtUtil.generateLoginToken(userDetails.getUsername(), keep) +"\""
						+ "}")
				);
		
	}
	
	@PostMapping("/register")
	public ResponseEntity<?> websiteRegister(@RequestBody UserVO user) throws JsonMappingException, JsonProcessingException{
		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		
		RoleVO role = roleRepository.findById(3);
		
		Set<RoleVO> roles = new HashSet<>();
		roles.add(role);
		user.setRole(roles);
		
		userRepository.save(user);
		
		return ResponseEntity.ok(
					objMapper.readTree("{"
							+ "\"status\": \"Sucessful Registered!\","
							+ "\"token\": \""+ jwtUtil.generateLoginToken(userDetailsService.loadUserByUsername(user.getUser()).getUsername(), false) +"\""
							+ "}")
				);
		
	}
	
}
