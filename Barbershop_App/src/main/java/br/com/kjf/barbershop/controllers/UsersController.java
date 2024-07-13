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

import br.com.kjf.barbershop.repository.ClientRepository;
import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.BonusVO;
import br.com.kjf.barbershop.vo.BookingVO;
import br.com.kjf.barbershop.vo.UserVO;

@RestController
@CrossOrigin(origins = {"http://localhost:8100"}, allowCredentials = "true")
@RequestMapping("/users")
public class UsersController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ClientRepository clientRepository;
	
	@GetMapping
	public ResponseEntity<?> getAllUsers() {
		
		List<UserVO> users = userRepository.findAll();
		
		for(UserVO user : users) {
			user.setPassword(null);
			if(user.getClient().getBookings() != null) {
				for(BookingVO book : user.getClient().getBookings()) {
					book.setClient(null);
				}
			}
		}
		return ResponseEntity.ok(users);
	}
	
	@GetMapping("/temp")
	public ResponseEntity<?> getTempClient(){
		return ResponseEntity.ok(clientRepository.getTempClients());
	}
	
	@PostMapping
	public ResponseEntity<?> giveAnualBonus(@RequestBody BonusVO bonus){
		
	}
	
}
