package br.com.kjf.barbershop.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin("*")
@RequestMapping("/meta")
public class MetaWebhookController {

	ObjectMapper objMapper = new ObjectMapper();
	
	@PostMapping("/webhook")
	public ResponseEntity<?> handleWebhook(@RequestBody String payload) throws JsonMappingException, JsonProcessingException {
		
		return ResponseEntity.ok(objMapper.readTree("{"
				+ "\"status\": \"Payload recebido com sucesso!\""
				+ "}"));
		
	}
	
}
