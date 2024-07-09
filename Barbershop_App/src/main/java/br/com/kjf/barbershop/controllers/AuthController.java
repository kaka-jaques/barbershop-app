package br.com.kjf.barbershop.controllers;

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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.kjf.barbershop.classes.JwtUtil;
import br.com.kjf.barbershop.classes.NetworkUtil;
import br.com.kjf.barbershop.repository.ClientRepository;
import br.com.kjf.barbershop.repository.PlansRepository;
import br.com.kjf.barbershop.repository.RoleRepository;
import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.ClientVO;
import br.com.kjf.barbershop.vo.NotificationConfigVO;
import br.com.kjf.barbershop.vo.RoleVO;
import br.com.kjf.barbershop.vo.UserVO;
import io.jsonwebtoken.ExpiredJwtException;

@RestController
@CrossOrigin(origins = {"http://localhost:5500", "http://localhost:8100"}, allowCredentials = "true")
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ClientRepository clientRepository;
	
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
	private NetworkUtil networkUtil;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	private ObjectMapper objMapper = new ObjectMapper();
	
	@GetMapping("/logout")
	public ResponseEntity<?> websiteLogout(){
		
		HttpHeaders headers = new HttpHeaders();
		
		headers.set("Set-Cookie", "token='';Max-Age=0; path=/");
		
		return ResponseEntity.ok().headers(headers).build();
		
	}
	
	@GetMapping
	public ResponseEntity<?> websiteAuth(@RequestHeader(name = "Cookie")String auth) throws JsonMappingException, JsonProcessingException{
		
		UserVO user = null;
		
		if(auth == null || !auth.startsWith("token")) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(objMapper.readTree(("{"
					+ "\"error\": \"token_not_found\","
					+ "\"message\": \"The authentication token is null.\""
					+ "}")));
		}
		
		try {
			user = userRepository.findByUsernameOrEmail(jwtUtil.extractUsername(auth.substring(6, (auth.indexOf(";") == -1?auth.length():auth.indexOf(";")))));
		}catch(ExpiredJwtException e) {
			return null;
		}catch(AuthenticationException e) {
			return null;
		}
		
		if(user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(objMapper.readTree(("{"
						+ "\"error\": \"user_not_found\","
						+ "\"message\": \"The authentication token return an invalid user.\""
						+ "}")));
		}else {
			user.setPassword(null);
			user.getClient().getBookings().forEach(book -> {
				book.setClient(null);
			});
			return ResponseEntity.status(HttpStatus.FOUND).body(user);
		}
		
	}
	
	//TODO - FINISH CREDENTIALS UPDATE
	@PutMapping("/credentials")
	public ResponseEntity<?> credentialsUpdate(@RequestHeader(name = "Cookie")String auth) throws JsonMappingException, JsonProcessingException{
		
		UserVO user = null;
		
		try {
			user = userRepository.findByUsernameOrEmail(jwtUtil.extractUsername(auth.substring(6, (auth.indexOf(";") == -1?auth.length():auth.indexOf(";")))));
		}catch(ExpiredJwtException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(objMapper.readTree(("{"
						+ "\"error\": \"token_expired\","
						+ "\"message\": \"The authentication token is expired.\""
						+ "}")));
		}catch(AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(objMapper.readTree(("{"
					+ "\"error\": \"user_not_found\","
					+ "\"message\": \"The authentication token return an invalid user.\""
					+ "}")));
		}
		
		if(user.getEmail() != null) {
			
		}
		
		return null;
		
	}
	
	@PostMapping(consumes = "multipart/form-data", path = "/update")
	public ResponseEntity<?> imageUpdate(@RequestHeader("Cookie")String auth, @RequestPart("file")MultipartFile file, @RequestParam("filename")String filename, @RequestParam("image_url")String image_url) throws JsonMappingException, JsonProcessingException{
	
		String oldFilename = userRepository.findByUsernameOrEmail(jwtUtil.extractUsername(auth.substring(6, (auth.indexOf(";") == -1?auth.length():auth.indexOf(";"))))).getClient().getImage_url().replace("/assets/imgs/", "");
		
		return networkUtil.ftpUpload(file, filename, oldFilename);
		
	}
	
	@PutMapping("/update")
	public ResponseEntity<?> profileUpdate(@RequestBody UserVO user) throws JsonMappingException, JsonProcessingException{
		
		try {
			user.setPassword(userRepository.findById(user.getId()).get().getPassword());
			userRepository.save(user);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(objMapper.readTree(("{"
					+ "\"error\": \"user_already_in_user\","
					+ "\"message\": \"The user already exist!\""
					+ "}")));
		}
		
		return ResponseEntity.status(HttpStatus.ACCEPTED).body(objMapper.readTree(("{"
				+ "\"status\": \"profile_updated\","
				+ "\"message\": \"Your profile was successful updated!\""
				+ "}")));
		
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
		final String token = jwtUtil.generateLoginToken(userDetails.getUsername(), keep);
		headers.add("Set-Cookie", "token="+token+";Max-Age="+(keep?"1296000":"54000")+"; SameSite=Strict; HttpOnly; path=/");
		
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
		client.setImage_url("/assets/imgs/default_profile.png");
		client.setActive(true);
		client.setPlano(plansRepository.findById(1));
		
		user.setClient(client);
		user.setNotificationConfig(new NotificationConfigVO());
		
		userRepository.save(user);
		
		final String token = jwtUtil.generateLoginToken(userDetailsService.loadUserByUsername(user.getUser()).getUsername(), false);
		
		HttpHeaders headers = new HttpHeaders();
		
		headers.set("Set-Cookie", "token="+token+";Max-Age=54000; SameSite=Strict; HttpOnly;");
		
		return ResponseEntity.status(HttpStatus.CREATED).body(
					objMapper.readTree("{"
							+ "\"status\": \"Sucessful Registered!\","
							+ "\"token\": \""+ token +"\""
							+ "}")
				);
		
	}
	
}
