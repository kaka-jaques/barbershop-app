package br.com.kjf.barbershop.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.kjf.barbershop.repository.ServicesRepository;
import br.com.kjf.barbershop.vo.ServicesVO;

@RestController
@CrossOrigin(allowCredentials = "true", origins = {"http://localhost:8100"})
@RequestMapping("config")
public class ConfigController {

	@Autowired
	private ServicesRepository servicesRepository;
	
	@GetMapping("/services")
	public ResponseEntity<?> getServices(){
		List<ServicesVO> services = servicesRepository.findAll();	
		return ResponseEntity.ok(services);
	}
	
	@PostMapping("/services")
	public ResponseEntity<?> createService(@RequestBody ServicesVO service){
		servicesRepository.save(service);
		return ResponseEntity.ok(null);
	}
	
	@PutMapping("/services")
	public ResponseEntity<?> setService(@RequestBody ServicesVO service){
		servicesRepository.save(service);
		return ResponseEntity.ok(null);
	}
	
}
