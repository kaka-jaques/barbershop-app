package br.com.kjf.barbershop.controllers;

import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.kjf.barbershop.classes.JwtUtil;
import br.com.kjf.barbershop.repository.PlansRepository;
import br.com.kjf.barbershop.repository.RoleRepository;
import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.ClientVO;
import br.com.kjf.barbershop.vo.RoleVO;
import br.com.kjf.barbershop.vo.UserVO;
import io.jsonwebtoken.ExpiredJwtException;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
@RequestMapping("/auth")
public class LoginController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PlansRepository plansRepository;
	
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
	
	@GetMapping
	public ResponseEntity<?> websiteAuth(@RequestHeader(name = "Authorization")String auth) throws JsonMappingException, JsonProcessingException{
		
		UserVO user = null;
		
		HttpHeaders headers = new HttpHeaders();
		headers.add("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
		
		try {
			user = userRepository.findByUsernameOrEmail(jwtUtil.extractUsername(auth.substring(7)));
		}catch(ExpiredJwtException e) {
			return null;
		}catch(AuthenticationException e) {
			return null;
		}
		
		if(user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers).body(objMapper.readTree(("{"
						+ "\"error\": \"user_not_found\","
						+ "\"message\": \"The authentication token return an invalid user.\""
						+ "}")));
		}else {
			user.setPassword(null);
			return ResponseEntity.status(HttpStatus.FOUND).headers(headers).body(user);
		}
		
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> websiteLogin(@RequestBody UserVO user, @RequestHeader("keep")boolean keep) throws JsonMappingException, JsonProcessingException, UsernameNotFoundException{
		
		HttpHeaders headers = new HttpHeaders();
		
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(user.getUser(), user.getPassword())
			);
		}catch(AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new String("Unauthorized! Username or Password incorrect!"));
		}
		
		final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUser());
		String token = jwtUtil.generateLoginToken(userDetails.getUsername(), keep);
		headers.add("Set-Cookie", "token="+token+";Max-Age=10800; SameSite=Strict;");
		
		return ResponseEntity.status(HttpStatus.OK).headers(headers).body(
				objMapper.readTree("{"
						+ "\"status\": \"Sucessful Logged!\","
						+ "\"token\": \""+ token +"\""
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
		
		ClientVO client = new ClientVO();
		client.setImage_url("https://cdn-icons-png.flaticon.com/512/17/17004.png");
		client.setActive(true);
		client.setPlano(plansRepository.findById(1));
		
		user.setClient(client);
		
		userRepository.save(user);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(
					objMapper.readTree("{"
							+ "\"status\": \"Sucessful Registered!\","
							+ "\"token\": \""+ jwtUtil.generateLoginToken(userDetailsService.loadUserByUsername(user.getUser()).getUsername(), false) +"\""
							+ "}")
				);
		
	}
	
}
