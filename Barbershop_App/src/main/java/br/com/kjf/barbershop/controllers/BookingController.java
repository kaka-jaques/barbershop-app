package br.com.kjf.barbershop.controllers;

import java.util.GregorianCalendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
	public List<BookingVO> getAllBooks(){
		
		return bookingRepository.findAll();
		
	}
	
	public List<BookingVO> getNextBooksToAdmin(){
		
		return bookingRepository.findNextBooks(new GregorianCalendar());
		
	}
	
	public List<BookingVO> getNextBooksToClient(){
		
		List<BookingVO> bookWithoutCredentials = bookingRepository.findNextBooks(new GregorianCalendar());
		
		for(BookingVO book : bookWithoutCredentials) {
			book.setClient_vo(null);
		}
		
		return bookWithoutCredentials;
		
	}
	
}
