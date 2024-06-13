package br.com.kjf.barbershop.classes;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class ResponseHandler {

	@ResponseStatus(code = HttpStatus.NOT_FOUND)
	public class NotFoundException extends RuntimeException{
		public NotFoundException(String message) {
			super(message);
		}
	}
	
	@ResponseStatus(code = HttpStatus.BAD_REQUEST)
	public class BadRequestException extends RuntimeException{
		public BadRequestException(String message) {
			super(message);
		}
	}
	
}
