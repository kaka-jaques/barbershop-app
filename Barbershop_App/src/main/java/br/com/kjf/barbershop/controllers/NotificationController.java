package br.com.kjf.barbershop.controllers;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.kjf.barbershop.classes.JwtUtil;
import br.com.kjf.barbershop.repository.BillRepository;
import br.com.kjf.barbershop.repository.BookingRepository;
import br.com.kjf.barbershop.repository.ClientRepository;
import br.com.kjf.barbershop.repository.NotificationConfigRepository;
import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.NotificationConfigVO;
import br.com.kjf.barbershop.vo.UserVO;
import io.jsonwebtoken.ExpiredJwtException;

@RestController
@CrossOrigin(origins = {"http://localhost:8100"}, allowCredentials = "true")
@RequestMapping("/notify")
public class NotificationController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ClientRepository clientRepository;
	
	@Autowired
	private NotificationConfigRepository configRepository;
	
	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private BillRepository billRepository;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	private ObjectMapper objMapper = new ObjectMapper();
	
	@GetMapping
	public ResponseEntity<?> getConfig(@RequestHeader(name = "Cookie")String auth) throws JsonMappingException, JsonProcessingException {
		
		UserVO user = null;
		NotificationConfigVO nc = null;
		
		try {
			user = userRepository.findByUsernameOrEmail(jwtUtil.extractUsername(auth.substring(6, (auth.indexOf(";") == -1?auth.length():auth.indexOf(";")))));
		}catch(ExpiredJwtException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(objMapper.readTree("{"
							+ "\"error\": \"token_expired\""
							+ "\"message\": \""+e.getMessage()+"\""
							+ "}"));
		}catch(AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(objMapper.readTree("{"
							+ "\"error\": \"user_not_found_by_token\""
							+ "\"message\": \""+e.getMessage()+"\""
							+ "}"));
		}
		
		nc = configRepository.getConfigByUser(user);
		
		if(nc.equals(null)) nc = new NotificationConfigVO();
		
		
		return ResponseEntity.ok(nc);
		
	}
	
	@GetMapping("/get")
	public ResponseEntity<?> getNotifications() throws JsonMappingException, JsonProcessingException{
		
		Date dateToday = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());
		Date dateTomorrow = Date.from(LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
		
		Calendar calendarToday = Calendar.getInstance();
		Calendar calendarTomorrow = Calendar.getInstance();
		
		calendarToday.setTime(dateToday);
		calendarTomorrow.setTime(dateTomorrow);
		
		int serviceToday = bookingRepository.getBooksForToday(new GregorianCalendar(), calendarTomorrow).size();
		int billPending = billRepository.getPendingMonthBills().size();
		int billExpired = billRepository.getExpiredBills().size();
		int birthsToday = clientRepository.getTodayBirths().size();
		int birthsMonth = clientRepository.getMonthBirths().size();
		
		return ResponseEntity.ok(objMapper.readTree("{"
				+ "\"serviceToday\": "+serviceToday
				+ ",\"billPending\": "+billPending
				+ ",\"billExpired\": "+billExpired
				+ ",\"birthsToday\": "+birthsToday
				+ ",\"birthsMonth\": "+birthsMonth
				+ "}"));
		
	}

	@PutMapping
	public ResponseEntity<?> updateNotificationConfig(@RequestBody NotificationConfigVO nc) throws JsonMappingException, JsonProcessingException{
		configRepository.save(nc);
		return ResponseEntity.ok(objMapper.readTree("{\"status\": \"config successful updated!\""));
	}
	
}
