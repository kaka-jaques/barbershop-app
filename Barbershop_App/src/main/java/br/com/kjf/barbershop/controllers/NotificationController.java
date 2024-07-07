package br.com.kjf.barbershop.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.kjf.barbershop.classes.JwtUtil;
import br.com.kjf.barbershop.repository.NotificationConfigRepository;
import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.NotificationConfigVO;
import br.com.kjf.barbershop.vo.UserVO;
import io.jsonwebtoken.ExpiredJwtException;

@RestController
@CrossOrigin(origins = "http://localhost:8100")
@RequestMapping("/notify")
public class NotificationController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private NotificationConfigRepository configRepository;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@CrossOrigin(allowCredentials = "true")
	@GetMapping
	public ResponseEntity<?> getConfig(@RequestHeader(name = "Cookie")String auth) {
		
		UserVO user = null;
		NotificationConfigVO nc = null;
		
		try {
			user = userRepository.findByUsernameOrEmail(jwtUtil.extractUsername(auth.substring(6, (auth.indexOf(";") == -1?auth.length():auth.indexOf(";")))));
		}catch(ExpiredJwtException e) {
			e.printStackTrace();
		}catch(AuthenticationException e) {
			e.printStackTrace();
		}
		
		if(user != null) {
			nc = configRepository.getConfigByUser(user);
		}
		
		return ResponseEntity.ok(nc);
		
	}
	
	@CrossOrigin(allowCredentials = "true")
	@GetMapping("/get")
	public ResponseEntity<?> getNotifications(){
		
		
		
	}
	
}
