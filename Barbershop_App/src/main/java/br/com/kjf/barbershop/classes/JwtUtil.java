package br.com.kjf.barbershop.classes;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import br.com.kjf.barbershop.vo.UserVO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {

	private Key key;
	
	@PostConstruct
	public void init() {
		byte[] keyBytes = Decoders.BASE64.decode("mX+M1z9W2Y8pQxWh6fFgNcOvV2/JnO0+WJq3fTFLPeE=\r\n");
		key = Keys.hmacShaKeyFor(keyBytes);
	}
	
	public String generateLoginToken(String user, Boolean keepLogged) {
		Map<String, Object> claims = new HashMap<>();
		return createToken(claims, user, keepLogged);
	}
	
	public String createToken(Map<String, Object> claims, String subject, Boolean keepLogged) {
		
		int time;
		
		if(keepLogged) {
			time = 360;
		}
		else {
			time = 15;
		}
		
		return Jwts.builder()
				.claims(claims)
				.subject(subject)
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * time))
				.signWith(key)
				.compact();
	}
	
	public Boolean validateToken(String token, String user) {
		final String extractedUsername = extractUsername(token);
		return (extractedUsername.equals(user) && !isTokenExpired(token));
	}
	
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
	
	//TODO CRIAR MEIO PARAR RECUPERAR O SECRET E SETAR NOS MÉTODOS
	@SuppressWarnings("deprecation")
	private Claims extractAllClaims(String token) {
		return Jwts.parser().setSigningKey(key).build().parseSignedClaims(token).getPayload();
	}
	
	private Boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}
	
	private Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}
	
}
