package br.com.kjf.barbershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.kjf.barbershop.vo.UserVO;

public interface UserRepository extends JpaRepository<UserVO, Integer>{

	@Query("FROM UserVO WHERE user = :user OR email = :user OR client.telephone = :user")
	public UserVO findByUsernameOrEmail(@Param("user") String user);
	
}
