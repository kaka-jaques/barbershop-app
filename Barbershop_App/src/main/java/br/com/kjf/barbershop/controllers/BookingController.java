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
@RequestMapping("/book")
public class BookingController {

	@Autowired
	private BookingRepository bookingRepository;
	
	@GetMapping("/all")
	public ResponseEntity<?> getAllBooks(){
		
		List<BookingVO> books = bookingRepository.findAll();
		
		books.forEach(book -> {
			book.getClient_vo().setBookings(null);
		});
		
		return ResponseEntity.ok(books);
		
	}
	
	@GetMapping("/admin")
	public ResponseEntity<?> getNextBooksToAdmin(){
		
		List<BookingVO> books = bookingRepository.findNextBooks(new GregorianCalendar());
		
		books.forEach(book -> {
			book.getClient_vo().setBookings(null);
		});
		
		return ResponseEntity.ok(books);
		
	}
	
	@GetMapping("/client")
	public ResponseEntity<?> getNextBooksToClient(){
		
		List<BookingVO> bookWithoutCredentials = bookingRepository.findNextBooks(new GregorianCalendar());
		
		for(BookingVO book : bookWithoutCredentials) {
			book.setClient_vo(null);
		}
		
		return ResponseEntity.ok(bookWithoutCredentials);
		
	}
	
}
