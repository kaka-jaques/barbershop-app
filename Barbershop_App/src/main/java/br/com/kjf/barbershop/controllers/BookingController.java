package br.com.kjf.barbershop.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.kjf.barbershop.repository.BookingRepository;
import br.com.kjf.barbershop.repository.ClientRepository;
import br.com.kjf.barbershop.repository.ServicesRepository;
import br.com.kjf.barbershop.vo.BookingVO;

@RestController
@CrossOrigin(origins = {"http://localhost:5500", "http://localhost:8100"}, allowCredentials = "true")
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
		
		List<BookingVO> books = bookingRepository.findNextBooks();
		
		books.forEach(book -> {
			book.getClient().setBookings(null);
		});
		
		return ResponseEntity.ok(books);
		
	}
	
	@GetMapping("/client")
	public ResponseEntity<?> getNextBooksToClient(){
		
		List<BookingVO> bookWithoutCredentials = bookingRepository.findNextBooks();
		
		for(BookingVO book : bookWithoutCredentials) {
			book.setClient(null);
		}
		
		return ResponseEntity.ok(bookWithoutCredentials);
		
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteBook(@RequestParam("id")int id) throws JsonMappingException, JsonProcessingException{
		try {
			bookingRepository.deleteById(id);
		}catch(Exception e) {
			return ResponseEntity.badRequest().body(objMapper.readTree("{"
					+ "\"error\": \""+e.getCause()+"\""
					+ "\"message\": \""+e.getMessage()+"\""
					+ "}"));
		}
		
		return ResponseEntity.ok(objMapper.readTree("{"
				+ "\"status\": \"book:"+id+" successful deleted!\""
				+ "}"));
		
	}
	
}
