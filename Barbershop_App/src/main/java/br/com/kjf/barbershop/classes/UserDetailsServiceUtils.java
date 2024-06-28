package br.com.kjf.barbershop.classes;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.kjf.barbershop.repository.UserRepository;
import br.com.kjf.barbershop.vo.UserVO;

@Service
public class UserDetailsServiceUtils implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserVO user = userRepository.findByUsernameOrEmail(username);
		if(user == null) {
			throw new UsernameNotFoundException("User not found!");
		}
		
		Set<SimpleGrantedAuthority> authorities = user.getRole().stream()
				.map(role -> new SimpleGrantedAuthority(role.getName()))
				.collect(Collectors.toSet());
		
		return new User(user.getUser(), user.getPassword(), authorities);
	}

}
