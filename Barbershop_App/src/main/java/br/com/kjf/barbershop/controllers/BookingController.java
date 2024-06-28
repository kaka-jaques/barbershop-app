package br.com.kjf.barbershop.controllers;

import java.util.GregorianCalendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.kjf.barbershop.classes.JwtUtil;
import br.com.kjf.barbershop.repository.BookingRepository;
import br.com.kjf.barbershop.repository.ClientRepository;
import br.com.kjf.barbershop.repository.ServicesRepository;
import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.BookingVO;
import br.com.kjf.barbershop.vo.UserVO;

@RestController
@CrossOrigin(origins = {"http://localhost:5500"}, allowCredentials = "true")
@RequestMapping("/book")
public class BookingController {

	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private ClientRepository clientRepository;
	
	@Autowired
	private ServicesRepository servicesRepository;
	
	ObjectMapper objMapper = new ObjectMapper();
	
	@PostMapping
	public ResponseEntity<?> registerBook(@RequestBody BookingVO book, @RequestHeader(name = "Cookie", required = false)String authToken, @RequestHeader(name = "Auth")Boolean auth) throws JsonMappingException, JsonProcessingException{
		
		book.setServices(servicesRepository.getServiceById(book.getServices().getId()));
		
		if(!auth) {
			clientRepository.save(book.getClient());
		}
		
		bookingRepository.save(book);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(objMapper.readTree(("{"
					+ "\"status\": \"book_created\","
					+ "\"message\": \"Your booking was created!\""
					+ "}")));
		
	}
	
	@GetMapping("/all")
	public ResponseEntity<?> getAllBooks(){
		
		List<BookingVO> books = bookingRepository.findAll();
		
		books.forEach(book -> {
			book.getClient().setBookings(null);
		});
		
		return ResponseEntity.ok(books);
		
	}
	
	@GetMapping("/admin")
	public ResponseEntity<?> getNextBooksToAdmin(){
		
		List<BookingVO> books = bookingRepository.findNextBooks(new GregorianCalendar());
		
		books.forEach(book -> {
			book.getClient().setBookings(null);
		});
		
		return ResponseEntity.ok(books);
		
	}
	
	@GetMapping("/client")
	public ResponseEntity<?> getNextBooksToClient(){
		
		List<BookingVO> bookWithoutCredentials = bookingRepository.findNextBooks(new GregorianCalendar());
		
		for(BookingVO book : bookWithoutCredentials) {
			book.setClient(null);
		}
		
		return ResponseEntity.ok(bookWithoutCredentials);
		
	}
	
}
