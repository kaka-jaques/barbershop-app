package br.com.kjf.barbershop.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.kjf.barbershop.classes.JwtUtil;
import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.UserVO;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class LoginController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UserDetailsService userDetailsService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@PostMapping("/login")
	public ResponseEntity<?> websiteLogin(@RequestBody UserVO user){
		
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(user.getUser(), user.getPassword())
			);
		}catch(AuthenticationException e) {
			return ResponseEntity.status(401).body(new String("Unauthorized! Username or Password incorrect!"));
		}
		
		final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUser());
		
		return ResponseEntity.ok(new String(jwtUtil.generateLoginToken(userDetails.getUsername())));
		
	}
	
	@PostMapping("/register")
	public ResponseEntity<?> websiteRegister(@RequestBody UserVO user){
		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		
		userRepository.save(user);
		
		return ResponseEntity.ok(new String("Sucessful Registered!"));
		
	}
	
}
