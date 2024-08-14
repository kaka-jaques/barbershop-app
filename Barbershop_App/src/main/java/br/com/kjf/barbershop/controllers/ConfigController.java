package br.com.kjf.barbershop.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.kjf.barbershop.repository.PlansRepository;
import br.com.kjf.barbershop.repository.ServicesRepository;
import br.com.kjf.barbershop.vo.PlansVO;
import br.com.kjf.barbershop.vo.ServicesVO;

@RestController
@CrossOrigin(allowCredentials = "true", origins = {"http://localhost:8100"})
@RequestMapping("config")
public class ConfigController {

	@Autowired
	private ServicesRepository servicesRepository;
	
	@Autowired
	private PlansRepository plansRepository;
	
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
	public ResponseEntity<?> updateService(@RequestBody ServicesVO service){
		servicesRepository.save(service);
		return ResponseEntity.ok(null);
	}
	
	@DeleteMapping("/services/{id}")
	public ResponseEntity<?> deleteService(@PathVariable("id")int id){
		servicesRepository.deleteById(id);
		return ResponseEntity.ok(null);
	}
	
	@GetMapping("/plans")
	public ResponseEntity<?> getPlans(){
		List<PlansVO> plans = plansRepository.findAll();
		return ResponseEntity.ok(plans);
	}
	
	@PostMapping("/plans")
	public ResponseEntity<?> createPlan(@RequestBody PlansVO plan){
		plansRepository.save(plan);
		return ResponseEntity.ok(null);
	}
	
	@PutMapping("/plans")
	public ResponseEntity<?> updatePlan(@RequestBody PlansVO plan){
		plansRepository.save(plan);
		return ResponseEntity.ok(null);
	}
	
	@DeleteMapping("/plans/{id}")
	public ResponseEntity<?> deletePlan(@PathVariable("id")int id){
		plansRepository.deleteById(id);
		return ResponseEntity.ok(null);
	}
	
}
