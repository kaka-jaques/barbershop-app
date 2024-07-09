package br.com.kjf.barbershop.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
	public ResponseEntity<?> getMonthBills(@RequestParam("month")int month, @RequestParam("year")int year){
		return ResponseEntity.ok(billRepository.getMonthBills(month, year));
	}
	
	@SuppressWarnings("null")
	@PostMapping
	public ResponseEntity<?> createBill(@RequestBody BillVO bill) throws JsonMappingException, JsonProcessingException{
		
		if(bill.getRecurrency().getDays() != 0) {
			BillVO nextBill = bill;
			List<BillVO> nextBills = null;
			for(LocalDate now = LocalDate.now();now.isBefore(bill.getLast_pay());now.plusDays(bill.getRecurrency().getDays())) {
				LocalDate nextPay = now;
				nextPay.plusDays(bill.getRecurrency().getDays());
				nextBill.setDay((byte) nextPay.getDayOfMonth());
				nextBill.setMonth((byte) nextPay.getMonthValue());
				nextBills.add(nextBill);
			}
			billRepository.saveAll(nextBills);
			return ResponseEntity.status(HttpStatus.CREATED).body(objMapper.readTree("{\"status\": \"bills successful created!\""));
		}else {
			billRepository.save(bill);
			return ResponseEntity.status(HttpStatus.CREATED).body(objMapper.readTree("{\"status\": \"bill successful created!\""));
		}
		
	}
	
}
