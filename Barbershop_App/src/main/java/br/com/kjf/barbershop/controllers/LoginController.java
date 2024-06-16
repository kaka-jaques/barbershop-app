package br.com.kjf.barbershop.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.UserVO;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("clientManage")
public class LoginController {

	@Autowired
	private UserRepository userRepository;
	
	@GetMapping("/login")
	public ResponseEntity<?> websiteLogin(@RequestBody UserVO user){
		
		return ResponseEntity.ok(new UserVO());
		
	}
	
}
