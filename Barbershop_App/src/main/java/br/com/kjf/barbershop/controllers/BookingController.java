package br.com.kjf.barbershop.controllers;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
import br.com.kjf.barbershop.repository.PlansRepository;
import br.com.kjf.barbershop.repository.ServicesRepository;
import br.com.kjf.barbershop.vo.BookingVO;

@RestController
@CrossOrigin(origins = {"127.0.0.1:5500", "http://localhost:5500", "http://localhost:8100"}, allowCredentials = "true")
@RequestMapping("/book")
public class BookingController {

	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private ClientRepository clientRepository;
	
	@Autowired
	private PlansRepository plansRepository;
	
	@Autowired
	private ServicesRepository servicesRepository;
	
	ObjectMapper objMapper = new ObjectMapper();
	
	@PostMapping
	public ResponseEntity<?> registerBook(@RequestBody BookingVO book, @RequestHeader(name = "Cookie", required = false)String authToken, @RequestHeader(name = "Auth")Boolean auth) throws JsonMappingException, JsonProcessingException{
		
		book.setServices(servicesRepository.getServiceById(book.getServices().getId()));
		
		if(!auth) {
			book.getClient().setPlano(plansRepository.findById(1));
			clientRepository.save(book.getClient());
		} else {
			book.setClient(clientRepository.findById(book.getClient().getId()).get());
		}
		
		bookingRepository.save(book);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(objMapper.readTree(("{"
					+ "\"status\": \"book_created\","
					+ "\"message\": \"Your booking was created!\""
					+ "}")));
		
	}
	
	@PutMapping
	public ResponseEntity<?> updateBook(@RequestBody BookingVO book){
		bookingRepository.save(book);
		return ResponseEntity.ok(null);
	}
	
	@GetMapping("/all")
	public ResponseEntity<?> getAllBooks(){
		
		List<BookingVO> books = bookingRepository.findAll();
		
		books.forEach(book -> {
			book.getClient().setBookings(null);
			book.getBookingDate().setTimeZone(TimeZone.getTimeZone("UTC"));
			if(book.getBarberman() != null) {
				book.getBarberman().getClient().setBookings(null);
			}
		});
		
		return ResponseEntity.ok(books);
		
	}
	
	@GetMapping("/admin/{id}")
	public ResponseEntity<?> getNextBooksToAdmin(@PathVariable("id")int id){
		
		List<BookingVO> books;
		
		if(id == 0) {
			books = bookingRepository.findNextBooks();
		}else {
			books = bookingRepository.findNextBooks(id);
		}
		
		books.forEach(book -> {
			book.getBookingDate().setTimeZone(TimeZone.getTimeZone("UTC"));
			book.getClient().setBookings(null);
			if(book.getBarberman() != null) {
				book.getBarberman().getClient().setBookings(null);
			}
		});
		
		return ResponseEntity.ok(books);
		
	}
	
	@GetMapping("/today/{id}")
	public ResponseEntity<?> getBooksForToday(@PathVariable("id")int id){
		
		Date dateTomorrow = Date.from(LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
		Calendar calendarTomorrow = Calendar.getInstance();
		calendarTomorrow.setTime(dateTomorrow);
		
		List<BookingVO> books;
		
		if(id == 0) {
			books = bookingRepository.getBooksForToday(new GregorianCalendar(), calendarTomorrow);
		}else {
			books = bookingRepository.getBooksForToday(new GregorianCalendar(), calendarTomorrow, id);
		}
		
		for(BookingVO book : books) {
			book.getBookingDate().setTimeZone(TimeZone.getTimeZone("UTC"));
			book.getClient().setBookings(null);
			if(book.getBarberman() != null) {
				book.getBarberman().getClient().setBookings(null);
			}
		}
		
		return ResponseEntity.ok(books);
		
	}
	
	@PostMapping("/period/{id}")
	public ResponseEntity<?> getBooksForPeriod(@RequestBody Map<String, String> periodTime, @PathVariable("id")int id) throws ParseException{
		
		DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
	    ZonedDateTime startDate = ZonedDateTime.parse(periodTime.get("startDate"), formatter);
	    ZonedDateTime endDate = ZonedDateTime.parse(periodTime.get("endDate"), formatter);

	    ZonedDateTime startDateUtc = startDate.withZoneSameInstant(ZoneId.of("UTC"));
	    ZonedDateTime endDateUtc = endDate.withZoneSameInstant(ZoneId.of("UTC"));

	    // Convertendo para os tipos compatíveis com o repositório
	    GregorianCalendar startPeriod = GregorianCalendar.from(startDateUtc);
	    GregorianCalendar endPeriod = GregorianCalendar.from(endDateUtc);
		
		List<BookingVO> books;
		
		if(id == 0) {
			books = bookingRepository.getBooksForPeriod(startPeriod, endPeriod);
		}else {
			books = bookingRepository.getBooksForPeriod(startPeriod, endPeriod, id);
		}
		
		for(BookingVO book : books) {
			book.getBookingDate().setTimeZone(TimeZone.getTimeZone("UTC"));
			book.getClient().setBookings(null);
			if(book.getBarberman() != null) {
				book.getBarberman().getClient().setBookings(null);
			}
		}
		
		return ResponseEntity.ok(books);
		
	}
	
	@GetMapping("/client")
	public ResponseEntity<?> getNextBooksToClient(){
		
		List<BookingVO> bookWithoutCredentials = bookingRepository.findNextBooks();
		
		for(BookingVO book : bookWithoutCredentials) {
			book.getBookingDate().setTimeZone(TimeZone.getTimeZone("UTC"));
			book.setClient(null);
		}
		
		return ResponseEntity.ok(bookWithoutCredentials);
		
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteBook(@PathVariable("id")int id) throws JsonMappingException, JsonProcessingException{
		
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
