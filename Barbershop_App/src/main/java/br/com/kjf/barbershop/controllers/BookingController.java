package br.com.kjf.barbershop.controllers;

import java.util.GregorianCalendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.kjf.barbershop.repository.BookingRepository;
import br.com.kjf.barbershop.vo.BookingVO;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("booking")
public class BookingController {

	@Autowired
	private BookingRepository bookingRepository;
	
	@GetMapping
	public ResponseEntity<?> getAllBooks(){
		
		return ResponseEntity.ok(bookingRepository.findAll());
		
	}
	
	public ResponseEntity<?> getNextBooksToAdmin(@RequestHeader("Authorization") String auth){
		
		return ResponseEntity.ok(bookingRepository.findNextBooks(new GregorianCalendar()));
		
	}
	
	public ResponseEntity<?> getNextBooksToClient(){
		
		List<BookingVO> bookWithoutCredentials = bookingRepository.findNextBooks(new GregorianCalendar());
		
		for(BookingVO book : bookWithoutCredentials) {
			book.setClient_vo(null);
		}
		
		return ResponseEntity.ok(bookWithoutCredentials);
		
	}
	
}
