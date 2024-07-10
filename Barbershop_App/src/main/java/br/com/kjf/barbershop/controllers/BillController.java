package br.com.kjf.barbershop.controllers;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.kjf.barbershop.repository.BillRepository;
import br.com.kjf.barbershop.vo.BillVO;

@RestController
@CrossOrigin(origins = {"http://localhost:8100"})
@RequestMapping("/bill")
public class BillController {
	
	@Autowired
	private BillRepository billRepository;
	
	private ObjectMapper objMapper = new ObjectMapper();
	
	@GetMapping("/{month}/{year}")
	public ResponseEntity<?> getMonthBills(@PathVariable int month, @PathVariable int year){
		return ResponseEntity.ok(billRepository.getMonthBills(month, year));
	}
	
	@PostMapping
	public ResponseEntity<?> createBill(@RequestBody BillVO bill) throws JsonMappingException, JsonProcessingException{
		
		if(bill.getRecurrency().getDays() != 0) {
			List<BillVO> nextBills = new ArrayList<>();
			LocalDate now = LocalDate.of(bill.getYear(), bill.getMonth(), bill.getDay());
			while(now.isBefore(bill.getLast_pay())) {
				BillVO nextBill = new BillVO(bill);
				nextBill.setDay((byte) now.getDayOfMonth());
				nextBill.setMonth((byte) now.getMonthValue());
				nextBill.setYear(now.getYear());
				nextBills.add(nextBill);
				if(bill.getRecurrency().getDays() >= 30) {
					now = now.plusMonths(bill.getRecurrency().getDays() / 30);
				}else if(bill.getRecurrency().getDays() == 365) {
					now = now.plusYears(1);
				}else {
					now = now.plusDays(bill.getRecurrency().getDays());
				}
			}
			billRepository.saveAll(nextBills);
			return ResponseEntity.status(HttpStatus.CREATED).body(objMapper.readTree("{\"status\": \"bills successful created!\"}"));
		}else {
			billRepository.save(bill);
			return ResponseEntity.status(HttpStatus.CREATED).body(objMapper.readTree("{\"status\": \"bill successful created!\"}"));
		}
		
	}
	
}
