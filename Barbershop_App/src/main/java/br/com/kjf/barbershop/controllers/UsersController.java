package br.com.kjf.barbershop.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.BonusVO;
import br.com.kjf.barbershop.vo.UserVO;

@RestController
@CrossOrigin(origins = {"http://localhost:8100"}, allowCredentials = "true")
@RequestMapping("/users")
public class UsersController {

	@Autowired
	private UserRepository userRepository;
	
	@GetMapping
	public ResponseEntity<?> getAllUsers() {
		
		List<UserVO> users = userRepository.findAll();
		
		for(UserVO user : users) {
			user.setPassword(null);
			user.getClient().setBookings(null);
		}
		
		return ResponseEntity.ok(users);
	}
	
	@GetMapping("/active")
	public ResponseEntity<?> getAllActiveUsers(){
		return ResponseEntity.ok(userRepository.getAllActiveUsers());
	}
	
	@PostMapping
	public ResponseEntity<?> giveAnualBonus(@RequestBody BonusVO bonus){
		
	}
	
}
